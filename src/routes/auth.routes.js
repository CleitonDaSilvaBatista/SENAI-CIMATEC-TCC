const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/user', authController.getCurrentUser)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.get('/oauth-config', authController.oauthConfig)
router.post('/google-login', authController.googleLogin)

module.exports = router