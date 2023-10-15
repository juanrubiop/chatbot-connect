// app/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../model/User');
const { Role } = require('../model/Role');

const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const validateToken = async (req, res, next) => {
    try {
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            next();
        } else {
            return res.status(401).json({
                message: "Unauthorized."
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized."
        });
    }
}

const validateAuthorization = async (req, res, next) => {
    const decoded = jwt.decode(req.header(tokenHeaderKey));
    const user = await User.findOne({
        where: { id: decoded.userId },
        include: { model: Role, attributes: ['permissions']}
    })
    if (user.Role.permissions < 2) {
        return res.status(403).json({
            userId: user.id,
            message: "Unauthorized."
        })
    }
    next()
}

module.exports = {
    validateToken,
    validateAuthorization
}
