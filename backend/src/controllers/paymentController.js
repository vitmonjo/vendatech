const Payment = require('../models/Payment');

// Mock do sistema de pagamento externo
const mockPaymentGateway = async (paymentData) => {
  // Simula delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simula diferentes cenários de resposta
  const random = Math.random();
  
  if (random < 0.1) {
    // 10% de chance de falha
    return {
      success: false,
      message: 'Pagamento recusado pelo banco',
      error: 'INSUFFICIENT_FUNDS'
    };
  } else if (random < 0.15) {
    // 5% de chance de erro de cartão
    return {
      success: false,
      message: 'Dados do cartão inválidos',
      error: 'INVALID_CARD'
    };
  } else {
    // 85% de chance de sucesso
    return {
      success: true,
      message: 'Pagamento processado com sucesso',
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
};

const processPayment = async (req, res) => {
  try {
    const { customerName, customerCpf, card, amount, description } = req.body;

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

    // Simula chamada para o sistema de pagamento externo
    const paymentResult = await mockPaymentGateway({
      customerName,
      customerCpf,
      card,
      amount,
      description
    });

    // Salva o registro do pagamento no banco (opcional)
    const paymentRecord = new Payment({
      customerName,
      customerCpf,
      amount,
      description,
      status: paymentResult.success ? 'completed' : 'failed',
      transactionId: paymentResult.transactionId,
      error: paymentResult.error,
      processedAt: new Date()
    });

    await paymentRecord.save();

    // Retorna resposta baseada no resultado do gateway
    if (paymentResult.success) {
      res.status(200).json({
        success: true,
        message: paymentResult.message,
        transactionId: paymentResult.transactionId
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.message,
        error: paymentResult.error
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

module.exports = {
  processPayment
};
