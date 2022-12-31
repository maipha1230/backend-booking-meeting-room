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
  const { Op } = require("sequelize");
  const { USER_IMAGE_PATH, JWT_SECRET, ROOM_IMAGE_PATH } = require("../../config/config");
  const bcrypt = require("bcrypt");
  
  const path = require("path");
  const fs = require("fs");
  
  const jwt = require("jsonwebtoken");

  const getBookingList = async(req, res) => {
    try {
        const status = req.body.status
        const room  = req.body.room
        
        const date = new Date()

        let booking = await Booking.findAll({
            where: {
                approve_status: status,
                date: { [Op.gte]: date },
                room_id: { [Op.in]: room }
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
            attributes: ['title', 'quantity', 'date', 'time_start', 'time_end', 'link', 'createdAt'],
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
        booking.link = temp.link
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

  const getEditBookingById = async(req, res) => {
    try {
        const booking_id  = req.params.booking_id

        let booking = await Booking.findOne({
            where: {
                booking_id: booking_id
            },
            attributes: [
                'booking_id', 
                'room_id',
                'booking_purpose_id',
                'title',
                'quantity',
                'date',
                'time_start',
                'time_end',
                'link'
            ],
            include: [
                {
                    model: BookingDevice,
                    attributes: ['room_device_id']
                }
            ]
        })

        let data = {}
        data.booking_id = booking.booking_id
        data.room = booking.room_id
        data.title = booking.title
        data.purpose = booking.booking_purpose_id
        data.quantity = booking.quantity
        data.date = booking.date
        data.time_start = booking.time_start
        data.time_end = booking.time_end
        data.link = booking.link
        data.device = []
        booking.booking_devices.forEach((device) => {
            data.device.push(device.room_device_id)
        })

        return res.send({ status:1 , data: data })

    } catch (err) {
        return res.status(500).send(err.message)
    }
  }

  const bookingPermission = async (req, res) => {
    try {
        const admin_id = res.locals.admin_id
        const booking_id = req.params.booking_id
        const permit = req.body.permit

        const update = await Booking.update({
            approve_status: permit
        },{
            where: {
                booking_id: booking_id
            }
        })

        const admin = await User.findOne({
            where: {
                user_id: admin_id
            },
            attributes: ['f_name', 'l_name']
          })

          const latest = await Booking.findOne({
            where: {
                booking_id: booking_id
            },
            order: [['booking_id', 'desc']],
            attributes: ['booking_id', 'date'],
            include: [ 
              { model: MeetingRoom, attributes: ['room_name'] },
              { model: User, attributes: ['f_name', 'l_name'] } ]
          })

          let token = await LineNotify.findOne({
            order: [['line_notify_id', 'desc']]
          })
          if (token) {
            token = token.token
            const lineNotify = require("line-notify-nodejs")(
            token 
          );
          let msg = "\n"
          if (permit == 1) {
            msg += "แจ้งเตือนการจองห้องประชุม\n"
            msg += "(ผ่านการอนุมัติ)\n"
            msg += `ยืนยันโดยผู้ดูแลระบบ(${admin.f_name} ${admin.l_name})\n`
            msg += `ห้องประชุม: ${latest.room.room_name}\n`
            msg += `เรื่อง: ${req.body.title}\n`
            msg += `ผู้จอง: ${latest.user.f_name} ${latest.user.l_name}\n`
            msg += `วันที่: ${latest.date}\n`
            msg += `เวลา: ${req.body.time_start} - ${req.body.time_end}\n`
            msg += `ลิงค์การอนุมัติ: http://localhost:4200/admin/booking-room`
          } else if (permit == 2) {
            msg += "แจ้งเตือนการจองห้องประชุม\n"
            msg += "(ไม่ผ่านผ่านการอนุมัติ)\n"
            msg += `ถูกแก้ไขโดยผู้ดูแลระบบ(${admin.f_name} ${admin.l_name})\n`
            msg += `ห้องประชุม: ${latest.room.room_name}\n`
            msg += `เรื่อง: ${req.body.title}\n`
            msg += `ผู้จอง: ${latest.user.f_name} ${latest.user.l_name}\n`
            msg += `วันที่: ${latest.date}\n`
            msg += `เวลา: ${req.body.time_start} - ${req.body.time_end}\n`
            msg += `ลิงค์การอนุมัติ: http://localhost:4200/admin/booking-room`
          }
          lineNotify.notify({message: msg})
          }

        

        return res.send({ status: 1, msg: "บันทึกการอนุญาตคำร้องสำเร็จ" })

    } catch (err) {
        return res.status(500).send(err.message)
    }
  }

  const adminUpdateBooking = async(req ,res) => {
    try {

        const admin_id = res.locals.admin_id
        const booking_id = req.params.booking_id
        
        const booked = await Booking.findAll({
            where: {
              date: req.body.date,
              room_id: req.body.room,
              approve_status: 1
            },
            attributes: ['time_start', 'time_end'],
            order: [['time_start', 'asc']]
          })
          
          const time = {
            time_start: req.body.time_start,
            time_end: req.body.time_end
          }
      
        const overlapping = (a, b) => {
            const getMinutes = s => {
               const p = s.split(':').map(Number);
               return p[0] * 60 + p[1];
            };
            return getMinutes(a.time_end) > getMinutes(b.time_start) && getMinutes(b.time_end) > getMinutes(a.time_start);
         };
      
         const isOverlapping = (arr) => {
            for (let i = 0; i < arr.length; i++) {
              if (overlapping(time, arr[i])) {
                return true;
             }
            };
            return false;
         };
         if (booked) {
          if (isOverlapping(booked)) {
            return res.send({ status: 2, msg: "เวลาที่คุณจองมีการจองอยู่แล้ว", booked: booked })
          }
         }

        const update = await Booking.update({
            title: req.body.title,
            room_id: req.body.room,
            booking_purpose_id: req.body.purpose,
            quantity: req.body.quantity,
            date: req.body.date,
            time_start: req.body.time_start,
            time_end: req.body.time_end,
            link: req.body.link
        }, {
            where: {
                booking_id: booking_id
            }
        })

        const remove_old_device = await BookingDevice.destroy({
            where: {
              booking_id: booking_id
            }
          })
      
          if (req.body.device.length > 0) {
            let device = []
            for (let i = 0; i < req.body.device.length ; i++) {
              device.push({
                booking_id: booking_id,
                room_device_id: req.body.device[i].room_device_id
              })
            }
            const booking_device = await BookingDevice.bulkCreate(device)
          } else {
            const booking_device = await BookingDevice.create({
              booking_id: booking_id,
              room_device_id: null
            })
          }


          const admin = await User.findOne({
            where: {
                user_id: admin_id
            },
            attributes: ['f_name', 'l_name']
          })

          const latest = await Booking.findOne({
            where: {
                booking_id: booking_id
            },
            order: [['booking_id', 'desc']],
            attributes: ['booking_id', 'date'],
            include: [ 
              { model: MeetingRoom, attributes: ['room_name'] },
              { model: User, attributes: ['f_name', 'l_name'] } ]
          })

          let token = await LineNotify.findOne({
            order: [['line_notify_id', 'desc']]
          })
          if (token) {
            token = token.token
            const lineNotify = require("line-notify-nodejs")(
            token 
          );
          
          let msg = ""
          msg += "แจ้งเตือนการจองห้องประชุม\n"
          msg += `ถูกแก้ไขโดยผู้ดูแลระบบ(${admin.f_name} ${admin.l_name})\n`
          msg += `ห้องประชุม: ${latest.room.room_name}\n`
          msg += `เรื่อง: ${req.body.title}\n`
          msg += `ผู้จอง: ${latest.user.f_name} ${latest.user.l_name}\n`
          msg += `วันที่: ${latest.date}\n`
          msg += `เวลา: ${req.body.time_start} - ${req.body.time_end}\n`
          msg += `ลิงค์การอนุมัติ: http://localhost:4200/admin/booking-room`
          lineNotify.notify({message: msg})
          }


          return res.send({ status: 1, msg: "แก้ไขคำร้องสำเร็จ" })

    } catch (err) {
        return res.status(500).send(err.message)
    }

  }

  const getBookingHistory = async(req, res) => {
    try {
      const dateFrom = req.body.dateFrom
      const dateTo = req.body.dateTo

      const booking = await Booking.findAll({
        where: {
          date: { [Op.between]: [dateFrom, dateTo] },
          approve_status: 1
        },
        order: [['date', 'asc']],
        attributes:['booking_id', 'title', 'quantity', 'date', 'time_start', 'time_end'],
        include: [
          {
            model: User,
            attributes: ['f_name', 'l_name']
          },
          {
            model: MeetingRoom,
            attributes: ['room_name']
          },
          {
            model: BookingPurpose,
            attributes: ['name']
          }
        ]
      })

      data = []
      booking.forEach((b, index) => {
        let temp = {}
        temp.index = index+1
        temp.booking_id = b.booking_id
        temp.room_name = b.room.room_name
        temp.title = b.title
        temp.purpose = b.booking_purpose.name
        temp.quantity = b.quantity
        temp.date = b.date,
        temp.time = b.time_start + ' - ' + b.time_end
        temp.user = b.user.f_name + ' ' + b.user.l_name
        data.push(temp)
      })

      return res.send({ status: 1, data: data })


    } catch (err) {
      return res.status(500).send(err.message)
    }
  }

  module.exports = {
    getBookingList: getBookingList,
    getBookingById: getBookingById,
    bookingPermission: bookingPermission,
    getEditBookingById: getEditBookingById,
    adminUpdateBooking: adminUpdateBooking,
    getBookingHistory: getBookingHistory
  }