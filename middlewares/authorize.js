module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                succes: false,
                msg: 'No autorizado'
            })
        }
        next();
    }
}