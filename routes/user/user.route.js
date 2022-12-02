const express = require('express')
const router = express.Router()
const multer = require('../../services/upload-image/multer')
const userController = require('../../controller/user/user.controller')

//get user login form
router.get('/getUserLoginForm', userController.getUserLoginForm)

//user login
router.post('/userLogin', userController.userLogin)


module.exports = router