"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findPublicUserById = exports.findUserByEmail = void 0;
const db_1 = __importDefault(require("../config/db"));
const findUserByEmail = async (email) => {
    return db_1.default.user.findUnique({
        where: {
            email,
        },
    });
};
exports.findUserByEmail = findUserByEmail;
const findPublicUserById = async (id) => {
    return db_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};
exports.findPublicUserById = findPublicUserById;
const createUser = async (name, email, password) => {
    return db_1.default.user.create({
        data: {
            name,
            email,
            password,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};
exports.createUser = createUser;
