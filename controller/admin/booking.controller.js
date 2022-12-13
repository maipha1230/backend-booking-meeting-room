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
  } = require("../../model/index.model");
  const { USER_IMAGE_PATH, JWT_SECRET } = require("../../config/config");
  const bcrypt = require("bcrypt");
  
  const path = require("path");
  const fs = require("fs");
  
  const jwt = require("jsonwebtoken");

  const getBookingList = async(req, res) => {
    try {
        let booking = await Booking.findAll({
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

  module.exports = {
    getBookingList: getBookingList
  }