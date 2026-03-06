const { Router } = require('express')
const authController = require('../config/controllers/auth.controller') 
const authMiddleware = require('../config/middleware/auth.middleware')       

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public
 */
authRouter.post('/login', authController.loginUserController)


/** 
 * @route POST /api/auth/logout
 * @description clear token from user cookies and add the token to blacklist
 * @access public
 */
authRouter.get('/logout', authController.logoutUserController)


/**
 * @route GET /api/auth/profile
 * @description Get the profile of the logged in user, expecting token in cookies
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController)


module.exports = authRouter
