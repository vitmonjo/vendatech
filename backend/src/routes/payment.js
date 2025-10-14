const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Rota para processar pagamento
router.post('/process', authenticate, processPayment);

module.exports = router;
