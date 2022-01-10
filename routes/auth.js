const { Router } = require('express')
const authController = require('./../controllers/auth')

const router = Router()

router.post('/signup', authController.signUp)
router.post('/signin', authController.signIn)
router.post('/checkuser', authController.checkUser)

module.exports = router