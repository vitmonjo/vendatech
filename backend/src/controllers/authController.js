const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Gerar JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuário já existe com este email'
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password
    });

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        },
        token
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Login do usuário
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Verificar se usuário existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        },
        token
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Obter perfil do usuário
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, password, currentPassword } = req.body;
    const userId = req.user.id;

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual se fornecida
    if (password && currentPassword) {
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }
    }

    // Atualizar campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Tornar usuário administrador
// @route   PUT /api/auth/make-admin
// @access  Private/Admin
const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    user.isAdmin = true;
    await user.save();

    res.json({
      success: true,
      message: 'Usuário tornado administrador com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('Erro ao tornar usuário admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Tornar vitmonjo@gmail.com administrador automaticamente
// @route   GET /api/auth/make-vitmonjo-admin
// @access  Public (temporário)
const makeVitmonjoAdmin = async (req, res) => {
  try {
    console.log('🔍 Procurando usuário vitmonjo@gmail.com...');
    
    // Buscar todos os usuários para debug
    const allUsers = await User.find({}, 'name email isAdmin');
    console.log('👥 Usuários existentes:', allUsers);

    let user = await User.findOne({ email: 'vitmonjo@gmail.com' });
    
    if (!user) {
      console.log('❌ Usuário vitmonjo@gmail.com não encontrado. Criando...');
      
      // Criar o usuário se não existir
      user = new User({
        name: 'João Vitor',
        email: 'vitmonjo@gmail.com',
        password: '123456', // Será hasheada automaticamente
        isAdmin: true
      });
      
      await user.save();
      console.log('✅ Usuário vitmonjo@gmail.com criado como administrador!');
    } else {
      console.log('👤 Usuário encontrado:', user.name, user.email, 'Admin:', user.isAdmin);
      
      user.isAdmin = true;
      await user.save();
      console.log('✅ Usuário vitmonjo@gmail.com tornado administrador!');
    }

    res.json({
      success: true,
      message: 'Usuário vitmonjo@gmail.com é agora administrador!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao tornar vitmonjo admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  makeAdmin,
  makeVitmonjoAdmin
};
