const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Rota para processar pagamento
router.post('/process', auth, processPayment);

module.exports = router;
