const express = require('express')
const router = express.Router()
const multer = require('../../services/upload-image/multer')
const userController = require('../../controller/user/user.controller')

//get user login form
router.get('/getUserLoginForm', userController.getUserLoginForm)

//user login
router.post('/userLogin', userController.userLogin)


//get admin login form
router.get('/getAdminLoginForm', userController.getAdminLoginForm)

//admin login
router.post('/adminLogin', userController.adminLogin)

//get room list
router.get('/getRoomList', userController.getRoomList)

//get booking purpose list
router.get('/getBookingPurposeList', userController.getBookingPurposeList)

//get room device list
router.get('/getRoomDeviceList', userController.getRoomDeviceList)


module.exports = router