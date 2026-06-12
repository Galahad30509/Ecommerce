"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const hashPassword_1 = require("../utils/hashPassword");
const generateToken_1 = require("../utils/generateToken");
const AppError_1 = require("../utils/AppError");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await (0, auth_service_1.findUserByEmail)(email);
    if (existingUser) {
        return res.status(400).json({
            message: 'Email already exists',
        });
    }
    const hashedPassword = await (0, hashPassword_1.hashPassword)(password);
    const user = await (0, auth_service_1.createUser)(name, email, hashedPassword);
    res.status(201).json({
        message: 'Register Success',
        user,
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await (0, auth_service_1.findUserByEmail)(email);
    if (!user) {
        return res.status(401).json({
            message: 'Invalid credentials',
        });
    }
    const isMatch = await (0, hashPassword_1.comparePassword)(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: 'Invalid credentials',
        });
    }
    const token = (0, generateToken_1.generateToken)(user.id, user.role);
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
exports.login = login;
const profile = async (req, res) => {
    const user = await (0, auth_service_1.findPublicUserById)(req.user.id);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    res.json({
        user,
    });
};
exports.profile = profile;
