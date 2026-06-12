"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
            message: 'Forbidden',
        });
    }
    next();
};
exports.adminOnly = adminOnly;
