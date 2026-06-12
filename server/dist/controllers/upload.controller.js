"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = void 0;
const uploadProductImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: 'No file uploaded',
        });
    }
    res.json({
        imageUrl: `/uploads/products/${req.file.filename}`,
    });
};
exports.uploadProductImage = uploadProductImage;
