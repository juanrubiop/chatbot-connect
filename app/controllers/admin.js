const { Role } = require('../model/Role');
const { User } = require('../model/User');


const listUsers = async (req, res) => {
    const users = await User.findAll();
    return res.status(200).json({
        users: users
    });
}

const createUser = async (req, res) => {
    var user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        return res.status(409).json({
            success: false,
            conflict: "email",
            message: "Email already registered in database"
        });
    }
    var user = await User.findOne({ where: { username: req.body.username } })
    if (user) {
        return res.status(409).json({
            success: false,
            conflict: "username",
            message: "Username is already in use, please choose another one."
        });
    }
    await User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role_id : req.body.roleId,
        name: req.body.name,
        is_active: req.body.isActive
    });
    return res.status(200).json({
        success: true,
        message: "User created successfully."
    });
}


const getUser = async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
        return res.status(404).json({
            success:false,
            message: "User not found."
        })
    }
    return res.status(200).json({
        user: user,
        success: true
    })
}

const deleteUser = async (req, res) => {
    const user = await User.findOne({ where: { id: req.body.userId } });
    if (!user || req.body.userId === 1) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }
    await User.destroy({
        where: {
            id: req.body.userId
        }
    });
    return res.status(200).json({
        success: true,
        message: "User deleted successfully."
    });
}


const deactivateUser = async (req, res) => {
    const user = await User.findOne({ where: { id: req.body.userId } });
    if (!user || req.body.userId === 1) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }
    await User.update({ is_active: false}, {
        where: {
            id: req.body.userId
        }
    });
    return res.status(200).json({
        success: true,
        message: "User deactivated successfully"
    })
}

const activateUser = async (req, res) => {
    const user = await User.findOne({ where: { id: req.body.userId } });
    if (!user || req.body.userId === 1) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }
    await User.update({ is_active: true}, {
        where: {
            id: req.body.userId
        }
    });
    return res.status(200).json({
        success: true,
        message: "User activated successfully."
    })
}


const getRoles = async (req, res) => {
    const roles = await Role.findAll();
    return res.status(200).json({roles: roles})
}

module.exports = {
    createUser,
    listUsers,
    deleteUser,
    deactivateUser,
    activateUser,
    getUser,
    getRoles
}
