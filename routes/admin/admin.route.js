const express = require('express')
const router = express.Router()
const meetingRoomController = require('../../controller/admin/meeting-room.controller')
const userController = require('../../controller/admin/users.controller')
const multer = require('../../services/upload-image/multer')

//create meeting room
router.post('/createMeetingRoom', multer.uploadImages, multer.resizeImagesMeetingRoom, multer.getResult, meetingRoomController.createMeetingRoom)

//get meeting room
router.get('/getMeetingRoom', meetingRoomController.getMeetingRoom)

//update meeting room
router.put('/updateMeetingRoom/:room_id', meetingRoomController.updateMeetingRoom)

//remove meeting room
router.delete('/removeMeetingRoom/:room_id', meetingRoomController.removeMeetingRoom)

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



module.exports = router