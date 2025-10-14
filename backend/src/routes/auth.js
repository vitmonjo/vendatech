const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, makeAdmin, makeVitmonjoAdmin } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validações para registro
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome deve ter entre 2 e 50 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// @route   POST /api/auth/register
// @desc    Registrar usuário
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login do usuário
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/profile
// @desc    Obter perfil do usuário
// @access  Private
router.get('/profile', authenticate, getProfile);

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', authenticate, updateProfile);

// @route   PUT /api/auth/make-admin
// @desc    Tornar usuário administrador
// @access  Private/Admin
router.put('/make-admin', authenticate, makeAdmin);

// @route   PUT /api/auth/make-admin-temp
// @desc    Tornar usuário administrador (temporário, sem auth)
// @access  Public (temporário)
router.put('/make-admin-temp', makeAdmin);

// @route   GET /api/auth/make-vitmonjo-admin
// @desc    Tornar vitmonjo@gmail.com administrador
// @access  Public (temporário)
router.get('/make-vitmonjo-admin', makeVitmonjoAdmin);

module.exports = router;
