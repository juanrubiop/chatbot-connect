//const connection = require("../../util/database/connectionSequalize")
const jwt = require('jsonwebtoken');
const { Role } = require('../model/Role');
const { User } = require('../model/User');
const { createHash } = require('crypto');


const generateToken = async (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY
    let data = {
        time: Date(),
        userId: req.body.id,
    }
    const token = jwt.sign(data, jwtSecretKey);
    return res.status(200).json({
        success: true,
        token: token,
        message: "user authentication success."
    })
}

const login = async (req, res) => {
    let user = await User.scope('auth').findOne({
        where: {
            email: req.body.email
        }
    });
    console.log(user)
    if (!user) {
        return res.status(404).json({ success: false , message: "User not found."})
    }
    if (!user.is_active) {
        return res.status(401).json({ success: false, message: "Unauthorized."})
    }
    let hash = createHash('sha256').update(req.body.password).digest('base64')
    if (hash === user.password) {
        delete user.password;
        req.body.id = user.id
        generateToken(req, res)
    } else {
        res.status(401).json({ success: false, message: "Unauthorized." });
    }
};


module.exports = {
    generateToken,
    login
}
