const {
    User,
    UserRole,
    UserPosition,
    UserRank,
    UserType,
    UserAffiliation,
    UserStatus,
    LineNotify,
    Booking,
    MeetingRoom,
    BookingPurpose,
    BookingDevice,
    MeetingRoomDevice,
    MeetingRoomSize,
    MeetingRoomStatus,
    MeetingRoomGallery,
  } = require("../../model/index.model");
  const { USER_IMAGE_PATH, JWT_SECRET, ROOM_IMAGE_PATH } = require("../../config/config");
  const bcrypt = require("bcrypt");
  
  const path = require("path");
  const fs = require("fs");
  
  const jwt = require("jsonwebtoken");

  const getBookingList = async(req, res) => {
    try {
        const status = req.body.status

        let booking = await Booking.findAll({
            where: {
                approve_status: status
            },
            order: [['createdAt', 'asc']],
            include: [
                {
                    model: MeetingRoom,
                    attributes: ['room_name']
                },
                {
                    model: User,
                    attributes: ['f_name', 'l_name']
                }
            ]
        })

        let data = []
        booking.forEach((b) => {
            let temp = {}
            temp.booking_id = b.booking_id
            temp.title = b.title
            temp.room_name = b.room.room_name
            temp.user = b.user.f_name + ' '+ b.user.l_name
            temp.date = new Date(b.date)
            temp.time = b.time_start+ ' - '+b.time_end
            temp.approve_status = b.approve_status
            data.push(temp)
        })
        return res.send({ status: 1, data: data })
    } catch (err) {
        return res.status(500).send(err.message)
    }
  }

  const getBookingById = async(req ,res) => {
    try {
        const booking_id = req.params.booking_id

        let temp = await Booking.findOne({
            where: {
                booking_id: booking_id
            },
            attributes: ['title', 'quantity', 'date', 'time_start', 'time_end', 'createdAt'],
            include: [
                {
                    model: BookingPurpose,
                    attributes: ['name']
                },
                {
                    model: BookingDevice,
                    attributes: ['booking_device_id'],
                    include: [{
                        model: MeetingRoomDevice,
                        attributes: ['name']
                    }]
                },
                {
                    model: MeetingRoom,
                    attributes:['room_name', 'room_capacity'],
                    include:[
                        {
                            model: MeetingRoomSize,
                            attributes: ['name']
                        },
                        {
                            model: MeetingRoomStatus,
                            attributes: ['name']
                        },
                        {
                            model: MeetingRoomGallery,
                            attributes: ['img_path']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['f_name', 'l_name', 'phone', 'email', 'picture_url'],
                    include: [
                        {
                            model: UserAffiliation,
                            attributes: ['user_affiliation_name']
                        },
                        {
                            model: UserPosition,
                            attributes: ['user_position_name']
                        },
                        {
                            model: UserRank,
                            attributes: ['user_rank_name']
                        },
                        {
                            model: UserType,
                            attributes: ['user_type_name']
                        },
                    ]
                }
            ]
        })

        let booking = {}
        booking.booking_id = req.params.booking_id
        booking.title = temp.title
        booking.quantity = temp.quantity
        booking.date = temp.date
        booking.time_start = temp.time_start
        booking.time_end = temp.time_end
        booking.createdAt = temp.createdAt
        booking.purpose = temp.booking_purpose.name
        booking.device = []
        temp.booking_devices.forEach((device) => {
            booking.device.push(device.room_device.name)
        })

        let room = {}
        room.room_name = temp.room.room_name
        room.capacity = temp.room.room_capacity
        room.size = temp.room.room_size.name
        room.status = temp.room.room_status.name
        room.gallery = []
        temp.room.room_galleries.forEach((g) => {
            room.gallery.push(ROOM_IMAGE_PATH + g.img_path)
        })

        let user = {}
        user.name = temp.user.f_name + " " + temp.user.l_name
        user.phone = temp.user.phone
        user.email = temp.user.email
        user.picture_url = USER_IMAGE_PATH + temp.user.picture_url
        user.affiliation = temp.user.user_affiliation.user_affiliation_name
        user.position = temp.user.user_position.user_position_name
        user.rank = temp.user.user_rank.user_rank_name
        user.type = temp.user.user_type.user_type_name
        
        let data = {
            booking: booking,
            room: room,
            user: user
        }
        return res.send({ status: 1, data: data})

    } catch (err) {
        return res.status(500).send(err.message)
    }
  }

  const bookingPermission = async (req, res) => {
    try {
        const booking_id = req.params.booking_id
        const permit = req.body.permit

        const update = await Booking.update({
            approve_status: permit
        },{
            where: {
                booking_id: booking_id
            }
        })

        return res.send({ status: 1, msg: "บันทึกการอนุญาตคำร้องสำเร็จ" })

    } catch (err) {
        return res.status(500).send(err.message)
    }
  }

  module.exports = {
    getBookingList: getBookingList,
    getBookingById: getBookingById,
    bookingPermission: bookingPermission
  }