const express = require('express')
const router = express.Router()
const multer = require('../../services/upload-image/multer')
const userController = require('../../controller/user/user.controller')
const validator = require('../../services/validators/validator')

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

//user submit booking
router.post('/userSubmitBooking', validator.userVerify, userController.userSubmitBooking)

//user edit booking
router.put('/userEditBooking/:booking_id', validator.userVerify, userController.userEditBooking)

//user booking list
router.get('/userBookingList', validator.userVerify, userController.userBookingList)

//get user booking by id
router.get('/getUserBookingById/:booking_id', validator.userVerify, userController.getUserBookingById)

//user remove booking
router.delete('/userRemoveBooking/:booking_id', validator.userVerify, userController.userRemoveBooking)

//check user own booking
router.get('/checkUserOwnBooking/:booking_id', validator.userVerify, userController.checkUserOwnBooking)

//get meeting room list
router.get('/getMeetingRoomList', userController.getMeetingRoomList)

//get booking to calendar
router.get('/getBookingToCalendar', userController.getBookingToCalendar)




module.exports = router