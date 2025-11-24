// Middleware genérico para checar se o usuário está logado
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Acesso negado. Faça login para continuar.');
        return res.redirect('/login');
    }
    next();
};

module.exports = authMiddleware;