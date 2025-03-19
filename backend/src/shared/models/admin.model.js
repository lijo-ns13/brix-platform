"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
var mongoose_1 = require("mongoose");
var AdminSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, {
    timestamps: true
});
exports.Admin = mongoose_1.default.model('Admin', AdminSchema);
