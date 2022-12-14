const express = require('express')
const router = express.Router()
const meetingRoomController = require('../../controller/admin/meeting-room.controller')
const userController = require('../../controller/admin/users.controller')
const bookingController = require('../../controller/admin/booking.controller')
const dashboardController = require('../../controller/admin/dashboard.controller')
const multer = require('../../services/upload-image/multer')

//create meeting room
router.post('/createMeetingRoom', multer.uploadImages, multer.resizeImagesMeetingRoom, multer.getResult, meetingRoomController.createMeetingRoom)

//get meeting room
router.get('/getMeetingRoom', meetingRoomController.getMeetingRoom)

//get meeting room by Id
router.get('/getMeetingRoomById/:room_id', meetingRoomController.getMeetingRoomById)

//update meeting room
router.put('/updateMeetingRoom/:room_id', multer.uploadImages, multer.resizeImagesMeetingRoom, multer.getResult, meetingRoomController.updateMeetingRoom)

//remove meeting room
router.delete('/removeMeetingRoom/:room_id', meetingRoomController.removeMeetingRoom)

//remove meeting room
router.delete('/removeMeetingRoom/:room_id', meetingRoomController.removeMeetingRoom)

//remove meeting room image
router.post('/removeMeetingRoomImage', meetingRoomController.removeMeetingRoomImage)

//create meeting room size
router.post('/createMeetingRoomSize', meetingRoomController.createMeetingRoomSize)

//get meeting room size
router.get('/getMeetingRoomSize', meetingRoomController.getMeetingRoomSize)

//remove meeting room size
router.delete('/removeMeetingRoomSize/:room_size_id', meetingRoomController.removeMeetingRoomSize)

//update meeting room size
router.put('/updateMeetingRoomSize/:room_size_id', meetingRoomController.updateMeetingRoomSize)

//create meeting room status
router.post('/createMeetingRoomStatus', meetingRoomController.createMeetingRoomStatus)

//get meeting room status
router.get('/getMeetingRoomStatus', meetingRoomController.getMeetingRoomStatus)

//remove meeting room status
router.delete('/removeMeetingRoomStatus/:room_status_id', meetingRoomController.removeMeetingRoomStatus)

//update meeting room status
router.put('/updateMeetingRoomStatus/:room_status_id', meetingRoomController.updateMeetingRoomStatus)

//create room device
router.post('/createMeetingRoomDevice', multer.uploadImages, multer.resizeImagesDevice, multer.getResult, meetingRoomController.createMeetingRoomDevice)

//get meeting room device
router.get('/getMeetingRoomDevice', meetingRoomController.getMeetingRoomDevice)

//get room device by id
router.get('/getMeetingRoomDeviceById/:room_device_id', meetingRoomController.getMeetingRoomDeviceById)

//update room device
router.put('/updateMeetingRoomDevice/:room_device_id',  multer.uploadImages, multer.resizeImagesDevice, multer.getResult, meetingRoomController.updateMeetingRoomDevice)

//remove room device
router.delete('/removeMeetingRoomDevice/:room_device_id', meetingRoomController.removeMeetingRoomDevice)


///////////////////// users  ////////////////////////

//create user
router.post('/createUser', multer.uploadImages, multer.resizeImagesUser, multer.getResult, userController.createUser)

//get users
router.get('/getUsers', userController.getUsers)

//get user by id
router.get('/getUserById/:user_id', userController.getUserById)

//update user
router.put('/updateUser/:user_id', multer.uploadImages, multer.resizeImagesUser, multer.getResult, userController.updateUser)

//remove user
router.delete('/removeUser/:user_id', userController.removeUser)

//reset user password
router.put('/resetUserPassword/:user_id', userController.resetUserPassword)

//create admin
router.post('/createAdmin', multer.uploadImages, multer.resizeImagesUser, multer.getResult, userController.createAdmin)

//get admins
router.get('/getAdmins', userController.getAdmins)

//get adminby id
router.get('/getAdminById/:user_id', userController.getAdminById)

//update admin
router.put('/updateAdmin/:user_id', multer.uploadImages, multer.resizeImagesUser, multer.getResult, userController.updateAdmin)

//remove admin
router.delete('/removeAdmin/:user_id', userController.removeAdmin)

//reset admin password
router.put('/resetAdminPassword/:user_id', userController.resetAdminPassword)

//create user role
router.post('/createUserRole', userController.createUserRole)

//get user role
router.get('/getUserRole', userController.getUserRole)

//update user role
router.put('/updateUserRole/:user_role_id', userController.updateUserRole)

//remove  user role
router.delete('/removeUserRole/:user_role_id', userController.removeUserRole)

//create user affiliation
router.post('/createUserAffiliation', userController.createUserAffiliation)

//get user affiliation
router.get('/getUserAffiliation', userController.getUserAffiliation)

//update user affiliation
router.put('/updateUserAffiliation/:user_affiliation_id', userController.updateUserAffiliation)

//remove  user affiliation
router.delete('/removeUserAffiliation/:user_affiliation_id', userController.removeUserAffiliation)

//create user position
router.post('/createUserPosition', userController.createUserPosition)

//get user position
router.get('/getUserPosition', userController.getUserPosition)

//update user position
router.put('/updateUserPosition/:user_position_id', userController.updateUserPosition)

//remove  user position
router.delete('/removeUserPosition/:user_position_id', userController.removeUserPosition)

//create user rank
router.post('/createUserRank', userController.createUserRank)

//get user rank
router.get('/getUserRank', userController.getUserRank)

//update user rank
router.put('/updateUserRank/:user_rank_id', userController.updateUserRank)

//remove  user rank
router.delete('/removeUserRank/:user_rank_id', userController.removeUserRank)

//create user type
router.post('/createUserType', userController.createUserType)

//get user type
router.get('/getUserType', userController.getUserType)

//update user type
router.put('/updateUserType/:user_type_id', userController.updateUserType)

//remove  user type
router.delete('/removeUserType/:user_type_id', userController.removeUserType)

//create user status
router.post('/createUserStatus', userController.createUserStatus)

//get user status
router.get('/getUserStatus', userController.getUserStatus)

//update user status
router.put('/updateUserStatus/:user_status_id', userController.updateUserStatus)

//remove  user status
router.delete('/removeUserStatus/:user_status_id', userController.removeUserStatus)

//get admin navbar
router.get('/getAdminNav', userController.getAdminNav)

//create line notify
router.post('/createLineNotify', userController.createLineNotify)

//get line notify
router.get('/getLineNotify', userController.getLineNotify)

//update line notify
router.put('/updateLineNotify/:line_notify_id', userController.updateLineNotify)

//remove line notify
router.delete('/removeLineNotify/:line_notify_id', userController.removeLineNotify)

/////////////////// booking /////////////////

//get booking list to admin page
router.post('/getBookingList', bookingController.getBookingList)

//get booking by id for detail 
router.get('/getBookingById/:booking_id', bookingController.getBookingById)

//booking permission
router.put('/bookingPermission/:booking_id', bookingController.bookingPermission)

//booking edit by id
router.get('/getEditBookingById/:booking_id', bookingController.getEditBookingById)

//admin edit booking
router.put('/adminUpdateBooking/:booking_id', bookingController.adminUpdateBooking)

//check exist booking
router.get('/checkBookingExist/:booking_id', bookingController.checkBookingExist)

////////////////////// dashboard ///////////////

router.get('/getBookingsOverview', dashboardController.getBookingsOverview)

router.get('/getUserOverview', dashboardController.getUserOverview)

router.get('/getAdminOverview', dashboardController.getAdminOverview)

router.post('/getRoomTime', dashboardController.getRoomTime)

router.get('/getAffiliationChart', dashboardController.getAffiliationChart)

////////////////// history ///////////////

router.post('/getBookingHistory', bookingController.getBookingHistory)


module.exports = router