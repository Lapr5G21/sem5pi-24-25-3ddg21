"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const userService_1 = __importDefault(require("../../services/userService"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
var user_controller = require('../../controllers/userController');
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/auth', route);
    route.post('/signup', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            firstName: celebrate_1.Joi.string().required(),
            lastName: celebrate_1.Joi.string().required(),
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
            role: celebrate_1.Joi.string().required()
        }),
    }), async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
        try {
            const authServiceInstance = typedi_1.Container.get(userService_1.default);
            const userOrError = await authServiceInstance.SignUp(req.body);
            if (userOrError.isFailure) {
                logger.debug(userOrError.errorValue());
                return res.status(401).send(userOrError.errorValue());
            }
            const { userDTO, token } = userOrError.getValue();
            return res.status(201).json({ userDTO, token });
        }
        catch (e) {
            //logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
    route.post('/signin', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
        }),
    }), async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-In endpoint with body: %o', req.body);
        try {
            const { email, password } = req.body;
            const authServiceInstance = typedi_1.Container.get(userService_1.default);
            const result = await authServiceInstance.SignIn(email, password);
            if (result.isFailure)
                return res.json().status(403);
            const { userDTO, token } = result.getValue();
            return res.json({ userDTO, token }).status(200);
        }
        catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    });
    /**
     * @TODO Let's leave this as a place holder for now
     * The reason for a logout route could be deleting a 'push notification token'
     * so the device stops receiving push notifications after logout.
     *
     * Another use case for advance/enterprise apps, you can store a record of the jwt token
     * emitted for the session and add it to a black list.
     * It's really annoying to develop that but if you had to, please use Redis as your data store
     */
    route.post('/logout', middlewares_1.default.isAuth, (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
        try {
            //@TODO AuthService.Logout(req.user) do some clever stuff
            return res.status(200).end();
        }
        catch (e) {
            logger.error('🔥 error %o', e);
            return next(e);
        }
    });
    app.use('/users', route);
    route.get('/me', middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, user_controller.getMe);
};
//# sourceMappingURL=userRoute.js.map