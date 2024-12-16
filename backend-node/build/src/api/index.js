"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const userRoute_2 = __importDefault(require("./routes/userRoute"));
const roleRoute_1 = __importDefault(require("./routes/roleRoute"));
const allergyRoute_1 = __importDefault(require("./routes/allergyRoute"));
const medicalConditionRoute_1 = __importDefault(require("./routes/medicalConditionRoute"));
const medicalRecordRoute_1 = __importDefault(require("./routes/medicalRecordRoute"));
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, userRoute_1.default)(app);
    (0, userRoute_2.default)(app);
    (0, roleRoute_1.default)(app);
    (0, allergyRoute_1.default)(app);
    (0, medicalConditionRoute_1.default)(app);
    (0, medicalRecordRoute_1.default)(app);
    return app;
};
//# sourceMappingURL=index.js.map