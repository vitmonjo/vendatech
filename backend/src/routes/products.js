const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// Validações para produto
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ max: 500 })
    .withMessage('Descrição não pode ter mais de 500 caracteres'),
  body('price')
    .isNumeric()
    .withMessage('Preço deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Preço não pode ser negativo'),
  body('category')
    .isIn(['eletrônicos', 'roupas', 'casa', 'esportes', 'livros', 'outros'])
    .withMessage('Categoria inválida'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro não negativo')
];

// @route   GET /api/products
// @desc    Obter todos os produtos
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Obter produto por ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Criar produto
// @access  Private/Admin
router.post('/', authenticate, requireAdmin, productValidation, createProduct);

// @route   PUT /api/products/:id
// @desc    Atualizar produto
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, productValidation, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Deletar produto
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

module.exports = router;
