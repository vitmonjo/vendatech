const Payment = require('../models/Payment');

// Configuração TrustPay
const TRUSTPAY_API_URL = process.env.TRUSTPAY_API_URL || 'https://api.trustpay.com';
const TRUSTPAY_MERCHANT_SECRET = process.env.TRUSTPAY_MERCHANT_SECRET;

/**
 * Cria um Payment Intent no TrustPay
 * @param {Object} paymentData - Dados do pagamento
 * @returns {Promise<Object>} Resposta do TrustPay com ID da transação
 */
const createPaymentIntent = async (paymentData) => {
  const { customerName, customerEmail, amount, orderId, callbackUrl, returnUrl } = paymentData;

  // Gerar email se não fornecido
  const finalEmail = customerEmail && customerEmail.trim() 
    ? customerEmail.trim() 
    : `${customerName.toLowerCase().replace(/\s/g, '')}@example.com`;

  const intentPayload = {
    orderId: orderId || `ORDER-${Date.now()}`,
    amount: Math.round(amount * 100), // Converte para centavos
    currency: 'BRL',
    paymentMethod: 'credit_card',
    customer: {
      name: customerName,
      email: finalEmail
    },
    callbackUrl: callbackUrl,
    returnUrl: returnUrl
  };

  try {
    const response = await fetch(`${TRUSTPAY_API_URL}/api/merchant/v1/payment-intents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRUSTPAY_MERCHANT_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(intentPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Erro ao criar Payment Intent: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    throw error;
  }
};

/**
 * Captura o pagamento no TrustPay
 * @param {String} transactionId - ID da transação retornado pelo Payment Intent
 * @param {Object} cardData - Dados do cartão de crédito
 * @returns {Promise<Object>} Resposta da captura
 */
const capturePayment = async (transactionId, cardData) => {
  const capturePayload = {
    cardNumber: cardData.number.replace(/\s/g, ''),
    cardHolderName: cardData.holderName.toUpperCase(),
    expirationMonth: cardData.expiryMonth.padStart(2, '0'),
    expirationYear: cardData.expiryYear.length === 2 ? `20${cardData.expiryYear}` : cardData.expiryYear,
    cvv: cardData.cvv
  };

  try {
    const response = await fetch(`${TRUSTPAY_API_URL}/api/merchant/v1/payments/${transactionId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRUSTPAY_MERCHANT_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(capturePayload)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || { message: `Erro ao capturar pagamento: ${response.status}` }
      };
    }

    return data;
  } catch (error) {
    console.error('Erro ao capturar pagamento:', error);
    return {
      success: false,
      error: { message: error.message || 'Erro ao processar captura' }
    };
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

    // Validação do valor
    if (amount <= 0) {
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

    // Verificar se a chave secreta está configurada
    if (!TRUSTPAY_MERCHANT_SECRET) {
      console.error('TRUSTPAY_MERCHANT_SECRET não configurada');
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

    // Passo 1: Criar Payment Intent
    let paymentIntent;
    try {
      paymentIntent = await createPaymentIntent({
        customerName,
        customerEmail,
        amount,
        orderId: orderId || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        callbackUrl,
        returnUrl
      });

      if (!paymentIntent.success || !paymentIntent.data?.id) {
        throw new Error('Falha ao criar Payment Intent: ID não retornado');
      }
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao inicializar pagamento',
        error: 'PAYMENT_INTENT_ERROR'
      });
    }

    const trustpayTransactionId = paymentIntent.data.id || paymentIntent.data._id;

    // Passo 2: Capturar o pagamento
    const captureResult = await capturePayment(trustpayTransactionId, card);

    // Determinar status final
    const isApproved = captureResult.success && captureResult.data?.transaction?.status === 'APPROVED';
    const status = isApproved ? 'completed' : 'failed';
    const transactionId = isApproved 
      ? (captureResult.data.transaction?.bankTransactionId || trustpayTransactionId)
      : undefined;

    // Salvar o registro do pagamento no banco
    const paymentRecord = new Payment({
      customerName,
      customerCpf,
      amount,
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
        message: captureResult.message || 'Pagamento processado com sucesso',
        transactionId: transactionId,
        trustpayTransactionId: trustpayTransactionId
      });
    } else {
      const errorMessage = captureResult.error?.message || captureResult.message || 'Pagamento recusado';
      res.status(400).json({
        success: false,
        message: errorMessage,
        error: captureResult.error?.code || 'PAYMENT_DECLINED',
        trustpayTransactionId: trustpayTransactionId
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
