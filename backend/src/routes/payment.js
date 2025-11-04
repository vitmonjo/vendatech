const express = require('express');
const router = express.Router();
const { processPayment, handleWebhook } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Rota para processar pagamento
router.post('/process', authenticate, processPayment);

// Rota de webhook do TrustPay (sem autenticação do usuário, apenas do TrustPay)
router.post('/webhook', handleWebhook);

module.exports = router;
