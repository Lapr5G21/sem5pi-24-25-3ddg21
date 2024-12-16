"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = __importStar(require("sinon"));
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../config"));
const Result_1 = require("../core/logic/Result");
const roleController_1 = __importDefault(require("./roleController"));
describe('role controller', function () {
    beforeEach(function () {
    });
    it('createRole: returns json with id+name values', async function () {
        let body = { "name": 'role12' };
        let req = {};
        req.body = body;
        let res = {
            json: sinon.spy()
        };
        let next = () => { };
        let roleServiceClass = require(config_1.default.services.role.path).default;
        let roleServiceInstance = typedi_1.Container.get(roleServiceClass);
        typedi_1.Container.set(config_1.default.services.role.name, roleServiceInstance);
        roleServiceInstance = typedi_1.Container.get(config_1.default.services.role.name);
        sinon.stub(roleServiceInstance, "createRole").returns(Result_1.Result.ok({ "id": "123", "name": req.body.name }));
        const ctrl = new roleController_1.default(roleServiceInstance);
        await ctrl.createRole(req, res, next);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({ "id": "123", "name": req.body.name }));
    });
});
//# sourceMappingURL=roleController.test.js.map