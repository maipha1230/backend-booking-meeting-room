const {
  User,
  UserRole,
  UserPosition,
  UserRank,
  UserType,
  UserAffiliation,
  UserStatus,
  MeetingRoom,
  MeetingRoomGallery,
  BookingPurpose,
  MeetingRoomDevice,
  Booking,
  BookingDevice,
  MeetingRoomSize,
  MeetingRoomStatus,
  LineNotify,
} = require("../../model/index.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  USER_IMAGE_PATH,
  JWT_SECRET,
  ROOM_IMAGE_PATH,
  HOST
} = require("../../config/config");

const getUserLoginForm = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ["user_id", "f_name", "l_name"],
      order: [["f_name", "asc"]],
      where: {
        user_role_id: 2,
      },
    });

    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    const user = await User.findOne({
      where: {
        user_id: user_id,
        user_role_id: 2,
      },
      attributes: [
        "f_name",
        "l_name",
        "picture_url",
        "password",
        "user_status_id",
        "user_role_id",
      ],
    });

    if (user) {
      const check_password = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (check_password) {
        if (user.user_status_id == 1) {
          const login_token = jwt.sign(
            { user_id: user_id, role_id: user.user_role_id },
            JWT_SECRET,
            {
              expiresIn: "8h",
            }
          );

          return res.send({
            status: 1,
            msg: "เข้าสู่ระบบสำเร็จ",
            token: login_token,
          });
        } else if (user.user_status_id == 2) {
          return res.send({ status: 2, msg: "คุณถูกระงับการใช้งาน" });
        }
      } else {
        return res.send({ status: 3, msg: "รหัสผ่านไม่ถูกต้อง" });
      }
    } else {
      return res.send({ status: 4, msg: "ไม่มีผู้ใช้งานในระบบ" });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getAdminLoginForm = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ["user_id", "f_name", "l_name"],
      order: [["f_name", "asc"]],
      where: {
        user_role_id: 1,
      },
    });

    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const adminLogin = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    const user = await User.findOne({
      where: {
        user_id: user_id,
        user_role_id: 1,
      },
      attributes: [
        "f_name",
        "l_name",
        "picture_url",
        "password",
        "user_status_id",
        "user_role_id",
      ],
    });

    if (user) {
      const check_password = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (check_password) {
        if (user.user_status_id == 1) {
          const login_token = jwt.sign(
            { user_id: user_id, role_id: user.user_role_id },
            JWT_SECRET,
            {
              expiresIn: "8h",
            }
          );

          return res.send({
            status: 1,
            msg: "เข้าสู่ระบบสำเร็จ",
            token: login_token,
          });
        } else if (user.user_status_id == 2) {
          return res.send({ status: 2, msg: "คุณถูกระงับการใช้งาน" });
        }
      } else {
        return res.send({ status: 3, msg: "รหัสผ่านไม่ถูกต้อง" });
      }
    } else {
      return res.send({ status: 4, msg: "ไม่มีผู้ดูแลในระบบ" });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
const getRoomList = async (req, res) => {
  try {
    const room = await MeetingRoom.findAll({
      attributes: ["room_id", "room_name"],
      include: [
        {
          model: MeetingRoomGallery,
          attributes: ["img_path"],
        },
      ],
    });

    const data = [];

    room.forEach((r) => {
      let temp = {};
      temp.room_id = r.room_id;
      temp.room_name = r.room_name;
      temp.room_img = ROOM_IMAGE_PATH + r.room_galleries[0].img_path;
      data.push(temp);
    });

    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getBookingPurposeList = async (req, res) => {
  try {
    const data = await BookingPurpose.findAll({
      order: [["name", "asc"]],
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getRoomDeviceList = async (req, res) => {
  try {
    let data = await MeetingRoomDevice.findAll({
      order: [["name", "asc"]],
      attributes: ["room_device_id", "name"],
    });
    let device = [];
    data.forEach((d) => {
      device.push({
        room_device_id: d.room_device_id,
        name: d.name,
        selected: false,
      });
    });
    return res.send({ status: 1, data: device });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const userSubmitBooking = async (req, res) => {
  try {
    const user_id = res.locals.user_id

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

    const booking = await Booking.create({
      user_id: user_id,
      room_id: req.body.room,
      title: req.body.title,
      booking_purpose_id: req.body.purpose,
      quantity: req.body.quantity,
      date: req.body.date,
      time_start: req.body.time_start,
      time_end: req.body.time_end,
      link: req.body.link,
      approve_status: 0
    })

    const latest = await Booking.findOne({
      order: [['booking_id', 'desc']],
      attributes: ['booking_id', 'date'],
      include: [ 
        { model: MeetingRoom, attributes: ['room_name'] },
        { model: User, attributes: ['f_name', 'l_name'] } ]
    })

    const booking_id = latest.booking_id

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

    let token = await LineNotify.findOne({
      order: [['line_notify_id', 'desc']]
    })
    if (token) {
      token = token.token
      const lineNotify = require("line-notify-nodejs")(
      token 
    );
    
    let msg = "\n"
    msg += "แจ้งเตือนการจองห้องประชุม\n"
    msg += `ห้องประชุม: ${latest.room.room_name}\n`
    msg += `เรื่อง: ${req.body.title}\n`
    msg += `ผู้จอง: ${latest.user.f_name} ${latest.user.l_name}\n`
    msg += `วันที่: ${latest.date}\n`
    msg += `เวลา: ${req.body.time_start} - ${req.body.time_end}\n`
    msg += `ลิงค์การอนุมัติ: ${HOST}/admin/booking-room/${booking_id}`
    lineNotify.notify({message: msg})
    }
    
    return res.send({ status: 1, msg: "บันทึกการจองห้องประชุมสำเร็จ" })
    
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const userEditBooking = async(req, res) => {
  try {
    //console.log(req.body);
    const user_id = res.locals.user_id
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

    const booking = await Booking.update({
      room_id: req.body.room,
      title: req.body.title,
      booking_purpose_id: req.body.purpose,
      quantity: req.body.quantity,
      date: req.body.date,
      time_start: req.body.time_start,
      time_end: req.body.time_end,
      link: req.body.link
    },
    {
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
    msg += "แจ้งเตือนการจองห้องประชุม ถูกแก้ไขโดยผู้จอง\n"
    msg += `ห้องประชุม: ${latest.room.room_name}\n`
    msg += `เรื่อง: ${req.body.title}\n`
    msg += `ผู้จอง: ${latest.user.f_name} ${latest.user.l_name}\n`
    msg += `วันที่: ${latest.date}\n`
    msg += `เวลา: ${req.body.time_start} - ${req.body.time_end}\n`
    msg += `ลิงค์การอนุมัติ: ${HOST}/admin/booking-room/${latest.booking_id}`
    lineNotify.notify({message: msg})
    }
   
    return res.send({ status: 1, msg: "แก้ไขการจองห้องประชุมสำเร็จ" })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const userBookingList = async (req, res) => {
  try {
    const user_id = res.locals.user_id

    const booking = await Booking.findAll({
      where: {
        user_id: user_id
      },
      order: [['createdAt', 'desc']],
      include: [
        {
          model: MeetingRoom,
          attributes: ['room_name'],
        },
        {
          model: BookingPurpose,
          attributes: ['name']
        }
      ]
    })

    let data = []
    booking.forEach((b) => {
      let temp = {}
      temp.booking_id = b.booking_id
      temp.room_name = b.room.room_name
      temp.title = b.title
      temp.purpose = b.booking_purpose.name
      temp.date = b.date
      temp.time = `${b.time_start} - ${b.time_end}`
      temp.approve_status = b.approve_status
      temp.createdAt = b.createdAt
      data.push(temp)
    })
    return res.send({ status: 1, data: data })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getUserBookingById = async(req, res) => {
  try {
    const booking_id = req.params.booking_id

    const booking = await Booking.findOne({
      where: {
        booking_id: booking_id
      },
      include: [
        {
          model: BookingDevice,
          attributes: ['room_device_id']
        }
      ]
    })

    const data = { 
      booking_id: req.params.booking_id,
      room: booking.room_id,
      title: booking.title,
      quantity: booking.quantity,
      purpose: booking.booking_purpose_id,
      date: booking.date,
      time_start: booking.time_start,
      time_end: booking.time_end,
      link: booking.link,
      device: booking.booking_devices
    }

    return res.send({ status: 1 , data: data})

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const userRemoveBooking = async(req, res) => {
  try {
    const booking_id = req.params.booking_id

    const latest = await Booking.findOne({
      where: {
        booking_id: booking_id
      },
      order: [['booking_id', 'desc']],
      attributes: ['booking_id', 'date', 'time_start', 'time_end', 'title'],
      include: [ 
        { model: MeetingRoom, attributes: ['room_name'] },
        { model: User, attributes: ['f_name', 'l_name'] } ]
    })

    const remove = await Booking.destroy({
      where: {
        booking_id: booking_id
      }
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
    msg += "แจ้งเตือนการจองห้องประชุม ถูกยกเลิกโดยผู้จอง\n"
    msg += `ห้องประชุม: ${latest.room.room_name}\n`
    msg += `เรื่อง: ${latest.title}\n`
    msg += `ผู้จอง: ${latest.user.f_name} ${latest.user.l_name}\n`
    msg += `วันที่: ${latest.date}\n`
    msg += `เวลา: ${latest.time_start} - ${latest.time_end}\n`
    lineNotify.notify({message: msg})
    }

    return res.send({ status: 1, msg: "ยกเลิกการจองสำเร็จ" })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkUserOwnBooking = async(req, res) => {
  try {
    const user_id = res.locals.user_id
    const booking_id = req.params.booking_id

    const check = await Booking.findOne({
      where: {
        user_id: user_id,
        booking_id: booking_id
      }
    })

    if (check) {
      return res.send({ status: 1 }) // own booking
    } else {
      return res.send({ status: 2 }) // not own booking
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getMeetingRoomList = async(req ,res) => {
  try {
    const date = new Date()

    let booking = await Booking.findAll({
      where: {
        date: date,
        approve_status: 1
      },
      order: [['time_start', 'asc']]
    })

    let room = await MeetingRoom.findAll({
      order: [['room_id', 'asc']],
      include: [
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
      ],
      where: {
        room_status_id: 1
      }
    })

    let data = []

    room.forEach((r) => {
      let temp = {}
      temp.room_id = r.room_id
      temp.room_name = r.room_name
      temp.room_size = r.room_size.name
      temp.room_capacity = r.room_capacity
      temp.room_status = r.room_status.name
      temp.gallery = []
      r.room_galleries.forEach((g) => {
        temp.gallery.push(ROOM_IMAGE_PATH + g.img_path)
      })
      let available = []
      booking.forEach((b) => {
        if (r.room_id == b.room_id){
          let dateNow = new Date()
          let start = new Date(b.date +' '+b.time_start)
          let end = new Date(b.date+ ' '+ b.time_end)
          available.push(start <= dateNow && dateNow <= end)
        }
      })
      temp.room_available = !available.some((a) => a == true)
      data.push(temp)

    })

    


    return res.send({ status: 1, data: data })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getBookingToCalendar = async (req ,res) => {
  try {
    
    let booking = await Booking.findAll({
      where: {
        approve_status: 1
      },
      order: [['booking_id', 'asc']],
      attributes: ['booking_id', 'date', 'time_start', 'time_end'],
      include: [
        {
          model: MeetingRoom,
          attributes: ['room_name', 'room_color']
        }
      ]
    })

    let data = []
    booking.forEach((b) => {
      let temp = {}
      temp.id = b.booking_id
      temp.title = b.room.room_name
      temp.start = new Date(b.date +' '+b.time_start)
      temp.end = new Date(b.date+' '+b.time_end)
      temp.backgroundColor = b.room.room_color
      temp.borderColor = b.room.room_color
      data.push(temp)
    })

    return res.send({ status: 1, data: data })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const eventDateCalendar = async (req, res) => {
  try {
    const date = req.body.date

    let booking = await Booking.findAll({
      where: {
        date: date,
        approve_status: 1,
      },
      order: [['createdAt', 'asc']],
      attributes: ['title', 'date', 'time_start', 'time_end'],
      include: [
        {
          model: User,
          attributes: ['f_name', 'l_name']
        },
        {
          model: MeetingRoom,
          attributes: ['room_name']
        }
      ]
    })

    if (!booking || booking.length == 0) {
      return res.end()
    }

    let data = []

    booking.forEach((b) => {
      let temp = {}
      temp.title = b.title
      temp.date = b.date
      temp.time = b.time_start + " - " + b.time_end
      temp.user = b.user.f_name+ " " +b.user.l_name  
      temp.room_name = b.room.room_name
      data.push(temp)
    })

    return res.send({ status: 1, data: data })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const uploadImageProfile = async(req, res) => {
  try {
    const user_id = res.locals.user_id
    const img = req.body.gallery[0]
    if (img) {
      const upload = await User.update({
        picture_url: img
      },
      {
        where: {
          user_id: user_id
        }
      })
      return res.send({ status: 1, msg: 'อัพโหลดรูปโปรไฟล์สำเร็จ' })
    }
    return res.send({ status: 2 })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getUserDetail = async(req ,res) => {
  try {
    const user_id = res.locals.user_id

    const user = await User.findOne({
      where: {
        user_id: user_id
      },
    });

    data = {};
    data.f_name = user.f_name;
    data.l_name = user.l_name;
    data.phone = user.phone;
    data.email = user.email;
    data.picture_url = USER_IMAGE_PATH + user.picture_url;
    data.affiliation = user.user_affiliation_id;
    data.position = user.user_position_id;
    data.rank= user.user_rank_id;
    data.type = user.user_type_id;

    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(err.message);
  }
}

const userGetUserPosition = async (req, res) => {
  try {
    const data = await UserPosition.findAll({
      order: [['user_position_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const userGetUserAffiliation = async (req, res) => {
  try {
    const data = await UserAffiliation.findAll({
      order: [['user_affiliation_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const userGetUserRank = async (req, res) => {
  try {
    const data = await UserRank.findAll({
      order: [['user_rank_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const userGetUserType = async (req, res) => {
  try {
    const data = await UserType.findAll({
      order: [['user_type_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const userUpdateUser = async (req ,res) => {
  try {
    const user_id = res.locals.user_id

      const update = await User.update(
        {
          f_name: req.body.f_name,
          l_name: req.body.l_name,
          phone: req.body.phone,
          email: req.body.email,
          user_affiliation_id: req.body.affiliation,
          user_position_id: req.body.position,
          user_rank_id: req.body.rank,
          user_type_id: req.body.type,
        },
        {
          where: {
            user_id: user_id,
          },
        }
      );
    return res.send({ status: 1, msg: "อัพเดตข้อมูลส่วนตัวสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

const userChangePassword = async (req, res) => {
  try {
    const user_id = res.locals.user_id
    //console.log(req.body);
    let old = req.body.old
    const password = await bcrypt.hash(req.body.password, 10);

    let compare = await User.findOne({
      where: {
        user_id: user_id
      },
      attributes: ['password']
    })
    // console.log(await bcrypt.hash(old, 10) == compare.password);
    // console.log(await bcrypt.hash(old, 10));
    // console.log(compare.password);
    let check_password = bcrypt.compareSync(old, compare.password)

    if (!check_password) {
      return res.send({ status: 2, msg: "รหัสผ่านเดิมไม่ถูกต้อง" })
    } else {
      let change = await User.update({
        password: password
      },
      {
        where: {
          user_id: user_id
        }
      })
      return res.send({ status: 1, msg: "เปลี่ยนรหัสผ่านใหม่สำเร็จ" })
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getBookingPrint = async(req, res) => {
  try {
    const booking_id = req.params.booking_id

    let temp = await Booking.findOne({
        where: {
            booking_id: booking_id
        },
        attributes: ['title', 'quantity', 'date', 'time_start', 'time_end', 'link', 'createdAt', 'updatedAt'],
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
    booking.user = temp.user.f_name + " " + temp.user.l_name
    booking.phone = temp.user.phone
    booking.position = temp.user.user_position.user_position_name
    booking.affiliation = temp.user.user_affiliation.user_affiliation_name
    booking.room = temp.room.room_name
    booking.title = temp.title
    booking.quantity = temp.quantity
    booking.date = temp.date
    booking.time_start = temp.time_start
    booking.time_end = temp.time_end
    booking.updatedAt = temp.updatedAt
    booking.purpose = temp.booking_purpose.name
    booking.link = temp.link
    booking.device = []
    temp.booking_devices.forEach((device) => {
        booking.device.push(device.room_device.name)
    })

    return res.send({ status: 1, data: booking})

} catch (err) {
    return res.status(500).send(err.message)
}
}


module.exports = {
  getUserLoginForm: getUserLoginForm,
  userLogin: userLogin,
  getAdminLoginForm: getAdminLoginForm,
  adminLogin: adminLogin,
  getRoomList: getRoomList,
  getBookingPurposeList: getBookingPurposeList,
  getRoomDeviceList: getRoomDeviceList,
  userSubmitBooking: userSubmitBooking,
  userEditBooking: userEditBooking,
  userBookingList: userBookingList,
  getUserBookingById: getUserBookingById,
  userRemoveBooking: userRemoveBooking,
  checkUserOwnBooking: checkUserOwnBooking,
  getMeetingRoomList: getMeetingRoomList,
  getBookingToCalendar: getBookingToCalendar,
  eventDateCalendar: eventDateCalendar,
  uploadImageProfile: uploadImageProfile,
  getUserDetail: getUserDetail,
  userGetUserPosition: userGetUserPosition,
  userGetUserAffiliation: userGetUserAffiliation,
  userGetUserRank: userGetUserRank,
  userGetUserType: userGetUserType,
  userUpdateUser: userUpdateUser,
  userChangePassword: userChangePassword,
  getBookingPrint: getBookingPrint
};
