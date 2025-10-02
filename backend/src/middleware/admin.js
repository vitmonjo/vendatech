// Middleware para verificar se o usuário é administrador
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado' 
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade' 
    });
  }

  next();
};

module.exports = { requireAdmin };
