const Payment = require('../models/Payment');
const axios = require('axios');
const crypto = require('crypto');

// Configuração TrustPay - usando a mesma lógica do trust-pay
const TRUSTPAY_API_URL = process.env.TRUSTPAY_API_URL || 'https://sistema-de-pagamentos-backend.onrender.com';
const TRUSTPAY_MERCHANT_KEY = process.env.TRUSTPAY_MERCHANT_KEY || 'merchant-1761947103058-4332';
const TRUSTPAY_MERCHANT_SECRET = process.env.TRUSTPAY_MERCHANT_SECRET || 'a5b4da4a4478e530c39ca5eb9a8bcb0607560d10e85275bc095c81496c98f022';

/**
 * Cria um Payment Intent no TrustPay usando autenticação HMAC SHA256
 * @param {Object} paymentData - Dados do pagamento
 * @returns {Promise<Object>} Resposta do TrustPay com ID da transação
 */
const createPaymentIntent = async (paymentData) => {
  const { customerName, customerEmail, amount, orderId, callbackUrl, returnUrl, installments } = paymentData;

  // Gerar email se não fornecido
  const finalEmail = customerEmail && customerEmail.trim() 
    ? customerEmail.trim() 
    : `${customerName.toLowerCase().replace(/\s/g, '')}@example.com`;

  // Garantir que amount seja tratado como número decimal e convertido para centavos
  let amountValue = amount;
  if (typeof amountValue === 'string') {
    // Se for string, substituir vírgula por ponto e converter para número
    amountValue = parseFloat(String(amountValue).replace(',', '.'));
  }
  amountValue = Number(amountValue);
  
  // Verificar se o valor já está em centavos (se for maior que 1000 e inteiro, provavelmente já está)
  let amountInCents;
  if (amountValue > 1000 && amountValue % 1 === 0) {
    console.log('--- [INTENT] Valor já está em centavos:', amountValue);
    amountInCents = Number(Math.round(amountValue));
  } else {
    // Converter para centavos (multiplicar por 100 e arredondar)
    amountInCents = Number(Math.round(amountValue * 100));
    console.log('--- [INTENT] Valor convertido de reais para centavos:', amountValue, '->', amountInCents);
  }

  const intentPayload = {
    orderId: orderId || `ORDER-${Date.now()}`,
    amount: amountInCents, // Valor em centavos (inteiro)
    currency: 'BRL',
    paymentMethod: 'credit_card',
    customer: {
      name: customerName,
      email: finalEmail
    },
    callbackUrl: callbackUrl,
    returnUrl: returnUrl,
    installments: installments ? { quantity: Number(installments) } : undefined
  };

  try {
    // Remover campos undefined do payload
    Object.keys(intentPayload).forEach(key => {
      if (intentPayload[key] === undefined) {
        delete intentPayload[key];
      }
    });

    const method = 'POST';
    const path = '/api/merchant/v1/payment-intents';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = JSON.stringify(intentPayload);
    const signatureBase = `${method}\n${path}\n${timestamp}\n${rawBody}`;
    const signature = crypto.createHmac('sha256', TRUSTPAY_MERCHANT_SECRET).update(signatureBase).digest('hex');

    console.log('--- [INTENT] Requisição para TrustPay:', JSON.stringify(intentPayload, null, 2));

    const response = await axios.post(
      `${TRUSTPAY_API_URL}${path}`,
      intentPayload,
      {
        headers: {
          'x-api-key': TRUSTPAY_MERCHANT_KEY,
          'x-timestamp': timestamp,
          'x-signature': signature,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('--- [INTENT] Resposta TrustPay:', JSON.stringify(response.data, null, 2));
    
    // Remove o campo 'status' da resposta do intent (se existir no nível raiz)
    const { status, ...intentWithoutStatus } = response.data;
    return intentWithoutStatus;
  } catch (error) {
    if (error.response) {
      console.error('--- [INTENT] ERRO TrustPay:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      throw new Error(error.response.data?.error?.message || error.response.data?.message || `Erro ao criar Payment Intent: ${error.response.status}`);
    } else {
      console.error('--- [INTENT] ERRO TrustPay:', error.message);
      throw error;
    }
  }
};

/**
 * Captura o pagamento no TrustPay usando autenticação HMAC SHA256
 * @param {String} transactionId - ID da transação retornado pelo Payment Intent
 * @param {Object} cardData - Dados do cartão de crédito
 * @returns {Promise<Object>} Resposta da captura
 */
const capturePayment = async (transactionId, cardData) => {
  // Garantir formato correto dos dados
  const cardNumber = String(cardData.number || '').replace(/\s/g, '');
  const cardHolderName = String(cardData.holderName || '').trim().toUpperCase();
  const expiryMonth = String(cardData.expiryMonth || '').trim();
  const expiryYear = String(cardData.expiryYear || '').trim();
  const cvv = String(cardData.cvv || '').trim();

  // Formatar mês (garantir 2 dígitos)
  const expirationMonth = expiryMonth.padStart(2, '0');
  
  // Formatar ano (garantir 4 dígitos)
  let expirationYear = expiryYear;
  if (expiryYear.length === 2) {
    expirationYear = `20${expiryYear}`;
  } else if (expiryYear.length !== 4) {
    // Se não for 2 nem 4 dígitos, assumir que é ano de 2 dígitos
    expirationYear = `20${expiryYear.padStart(2, '0')}`;
  }

  const capturePayload = {
    cardNumber: cardNumber,
    cardHolderName: cardHolderName,
    expirationMonth: expirationMonth,
    expirationYear: expirationYear,
    cvv: cvv,
    intentId: transactionId // TrustPay pode exigir esse campo no corpo
  };

  // Validar dados antes de enviar
  if (!cardNumber || cardNumber.length < 13) {
    throw new Error('Número do cartão inválido');
  }
  if (!cardHolderName || cardHolderName.length < 2) {
    throw new Error('Nome do portador inválido');
  }
  if (!expirationMonth || expirationMonth.length !== 2 || parseInt(expirationMonth) < 1 || parseInt(expirationMonth) > 12) {
    throw new Error('Mês de expiração inválido');
  }
  if (!expirationYear || expirationYear.length !== 4) {
    throw new Error('Ano de expiração inválido');
  }
  if (!cvv || cvv.length < 3) {
    throw new Error('CVV inválido');
  }

  try {
    const method = 'POST';
    const path = `/api/merchant/v1/payments/${transactionId}/capture`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = JSON.stringify(capturePayload);
    const signatureBase = `${method}\n${path}\n${timestamp}\n${rawBody}`;
    const signature = crypto.createHmac('sha256', TRUSTPAY_MERCHANT_SECRET).update(signatureBase).digest('hex');

    console.log('--- [CAPTURE] Dados recebidos do frontend:', JSON.stringify(cardData, null, 2));
    console.log('--- [CAPTURE] Payload formatado para TrustPay:', JSON.stringify(capturePayload, null, 2));

    const response = await axios.post(
      `${TRUSTPAY_API_URL}${path}`,
      capturePayload,
      {
        headers: {
          'x-api-key': TRUSTPAY_MERCHANT_KEY,
          'x-timestamp': timestamp,
          'x-signature': signature,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('--- [CAPTURE] Resposta TrustPay:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data;
      console.error('--- [CAPTURE] ERRO TrustPay:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: errorData,
        details: errorData?.error?.details || null
      });
      return {
        success: false,
        error: errorData?.error || { message: `Erro ao capturar pagamento: ${error.response.status}` },
        details: errorData?.error?.details || null
      };
    } else {
      console.error('--- [CAPTURE] ERRO TrustPay:', error.message);
      return {
        success: false,
        error: { message: error.message || 'Erro ao processar captura' }
      };
    }
  }
};

/**
 * Processa um pagamento completo (Payment Intent + Capture)
 */
const processPayment = async (req, res) => {
  try {
    const { customerName, customerCpf, customerEmail, card, amount, description, orderId } = req.body;

    // Validações básicas
    if (!customerName || !customerCpf || !card || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios não fornecidos',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validação do valor - aceita número ou string
    console.log('--- [PAYMENT] Amount recebido do frontend (tipo, valor):', typeof amount, amount);
    
    let amountValue = amount;
    if (typeof amountValue === 'string') {
      amountValue = parseFloat(String(amountValue).replace(',', '.'));
    }
    amountValue = Number(amountValue);

    // Verificar se o valor já está em centavos
    // Se o valor for maior que 1000 e inteiro, provavelmente já está em centavos
    // Exemplo: 15999 (centavos) vs 159.99 (reais)
    // Mas se tiver casas decimais, definitivamente está em reais
    const isLikelyInCents = amountValue > 1000 && amountValue % 1 === 0;
    
    if (isLikelyInCents) {
      console.log('--- [PAYMENT] AVISO: Valor parece estar em centavos, não multiplicando por 100');
      console.log('--- [PAYMENT] Se isso estiver errado, ajuste o frontend para enviar em reais');
      // Manter como está, mas não multiplicar
    } else {
      console.log('--- [PAYMENT] Valor em reais, será convertido para centavos');
    }

    if (isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero',
        error: 'INVALID_AMOUNT'
      });
    }

    // Validação dos dados do cartão
    if (!card.number || !card.expiryMonth || !card.expiryYear || !card.cvv || !card.holderName) {
      return res.status(400).json({
        success: false,
        message: 'Dados do cartão incompletos',
        error: 'INCOMPLETE_CARD_DATA'
      });
    }

    // Verificar se as chaves estão configuradas
    if (!TRUSTPAY_MERCHANT_SECRET || !TRUSTPAY_MERCHANT_KEY) {
      console.error('TRUSTPAY_MERCHANT_SECRET ou TRUSTPAY_MERCHANT_KEY não configuradas');
      return res.status(500).json({
        success: false,
        message: 'Configuração do gateway de pagamento ausente',
        error: 'PAYMENT_GATEWAY_NOT_CONFIGURED'
      });
    }

    // Construir URLs de callback e retorno
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const callbackUrl = `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:5000/api'}/payment/webhook`;
    const returnUrl = `${baseUrl}/payment-success`;

    // amount já foi processado acima, então usamos amountValue diretamente
    console.log('--- [PAYMENT] Amount processado:', amountValue);
    
    // Se o valor já parece estar em centavos (valor > 1000 e inteiro), converter para reais
    // createPaymentIntent espera receber em REAIS e converte para centavos internamente
    let amountInReais = amountValue;
    if (amountValue > 1000 && amountValue % 1 === 0) {
      console.log('--- [PAYMENT] Valor está em centavos, convertendo para reais:', amountValue, '->', amountValue / 100);
      amountInReais = amountValue / 100;
    } else {
      console.log('--- [PAYMENT] Valor já está em reais, usando diretamente:', amountValue);
    }

    // Passo 1: Criar Payment Intent
    let paymentIntent;
    try {
      paymentIntent = await createPaymentIntent({
        customerName,
        customerEmail,
        amount: amountInReais, // Sempre enviar em reais para createPaymentIntent
        orderId: orderId || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        callbackUrl,
        returnUrl,
        installments: req.body.installments // Suporta parcelas se fornecido
      });

      // Verificar se o intent foi criado com sucesso e obter o ID
      const intentId = paymentIntent?.data?.id || paymentIntent?.data?._id || paymentIntent?.id || paymentIntent?._id;
      
      if (!intentId) {
        throw new Error('Falha ao criar Payment Intent: ID não retornado');
      }

      // Se o status já for APPROVED, não precisa capturar
      const status = paymentIntent?.data?.status || paymentIntent?.status;
      if (status === 'APPROVED') {
        // Salvar pagamento já aprovado
        const paymentRecord = new Payment({
          customerName,
          customerCpf,
          amount,
          description,
          status: 'completed',
          transactionId: paymentIntent?.data?.transaction?.bankTransactionId || intentId,
          trustpayTransactionId: intentId,
          trustpayOrderId: paymentIntent?.data?.orderId || paymentIntent?.orderId,
          processedAt: new Date()
        });
        await paymentRecord.save();

        return res.status(200).json({
          success: true,
          message: 'Pagamento processado com sucesso',
          transactionId: paymentIntent?.data?.transaction?.bankTransactionId || intentId,
          trustpayTransactionId: intentId
        });
      }

      paymentIntent.data = paymentIntent.data || paymentIntent;
      paymentIntent.data.id = intentId;
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao inicializar pagamento',
        error: 'PAYMENT_INTENT_ERROR'
      });
    }

    const trustpayTransactionId = paymentIntent.data.id || paymentIntent.data._id || paymentIntent.id;

    // Passo 2: Capturar o pagamento
    console.log('--- [PAYMENT] Dados do cartão recebidos:', JSON.stringify(card, null, 2));
    console.log('--- [PAYMENT] Transaction ID:', trustpayTransactionId);
    
    let captureResult;
    try {
      captureResult = await capturePayment(trustpayTransactionId, card);
    } catch (error) {
      console.error('--- [PAYMENT] Erro ao chamar capturePayment:', error.message);
      return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao processar dados do cartão',
        error: 'CARD_DATA_ERROR'
      });
    }

    // Determinar status final - verifica múltiplas possibilidades de resposta
    const captureStatus = captureResult?.data?.transaction?.status || captureResult?.data?.status || captureResult?.status;
    const isApproved = captureResult.success && (captureStatus === 'APPROVED' || captureStatus === 'AUTHORIZED');
    const status = isApproved ? 'completed' : 'failed';
    const transactionId = isApproved 
      ? (captureResult?.data?.transaction?.bankTransactionId || trustpayTransactionId)
      : undefined;

    // Salvar o registro do pagamento no banco
    const paymentRecord = new Payment({
      customerName,
      customerCpf,
      amount: amountValue,
      description,
      status: status,
      transactionId: transactionId,
      trustpayTransactionId: trustpayTransactionId,
      trustpayOrderId: paymentIntent.data.orderId,
      error: captureResult.error?.message || captureResult.error?.code,
      processedAt: new Date()
    });

    await paymentRecord.save();

    // Retornar resposta baseada no resultado da captura
    if (isApproved) {
      res.status(200).json({
        success: true,
        message: captureResult?.message || 'Pagamento processado com sucesso',
        transactionId: transactionId,
        trustpayTransactionId: trustpayTransactionId
      });
    } else {
      const errorMessage = captureResult?.error?.message || captureResult?.message || 'Pagamento recusado';
      res.status(400).json({
        success: false,
        message: errorMessage,
        error: captureResult?.error?.code || 'PAYMENT_DECLINED',
        trustpayTransactionId: trustpayTransactionId,
        details: captureResult?.error?.details || captureResult?.details || null
      });
    }

  } catch (error) {
    console.error('Erro no processamento do pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Webhook para receber notificações do TrustPay
 */
const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;

    console.log('Webhook recebido do TrustPay:', webhookData);

    // Buscar pagamento pelo ID da transação TrustPay
    if (webhookData.data?.id || webhookData.data?._id || webhookData.transactionId) {
      const trustpayTransactionId = webhookData.data?.id || webhookData.data?._id || webhookData.transactionId;
      
      const payment = await Payment.findOne({ trustpayTransactionId });

      if (payment) {
        // Atualizar status baseado na notificação
        const status = webhookData.data?.status || webhookData.status;
        
        if (status === 'APPROVED') {
          payment.status = 'completed';
          if (webhookData.data?.transaction?.bankTransactionId) {
            payment.transactionId = webhookData.data.transaction.bankTransactionId;
          }
        } else if (status === 'DECLINED' || status === 'FAILED') {
          payment.status = 'failed';
          payment.error = webhookData.error?.message || webhookData.message || 'Pagamento recusado';
        }

        await payment.save();
      }
    }

    // Responder ao TrustPay que o webhook foi processado
    res.status(200).json({ success: true, message: 'Webhook processado com sucesso' });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar webhook'
    });
  }
};

module.exports = {
  processPayment,
  handleWebhook
};
