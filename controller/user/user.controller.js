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
    MeetingRoomDevice
  } = require("../../model/index.model");

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const { USER_IMAGE_PATH, JWT_SECRET, ROOM_IMAGE_PATH} = require('../../config/config')

const getUserLoginForm = async(req, res) => {
    try {
        const data = await User.findAll({
            attributes: ['user_id', 'f_name', 'l_name'],
            order: [['f_name', 'asc']],
            where: {
                user_role_id: 2
            }
        })

        return res.send({ status: 1, data: data })
    } catch (err) {
        return res.status(500).send(err.message)
    }
  }

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
          "user_role_id"
        ],
      });
  
      if (user) {
        const check_password = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (check_password) {
          if (user.user_status_id == 1) {
            const login_token = jwt.sign({ user_id: user_id, role_id: user.user_role_id }, JWT_SECRET, {
              expiresIn: "2h",
            });
  
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
        return res.send({ status: 4, msg: "ไม่มีผู้ใช้งานในระบบ" })
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
          "user_role_id"
        ],
      });
  
      if (user) {
        const check_password = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (check_password) {
          if (user.user_status_id == 1) {
            const login_token = jwt.sign({ user_id: user_id , role_id: user.user_role_id }, JWT_SECRET, {
              expiresIn: "2h",
            });
  
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
        return res.send({ status: 4, msg: "ไม่มีผู้ดูแลในระบบ" })
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };
    const getRoomList = async(req, res) => {
      try {
        const room = await MeetingRoom.findAll({
          attributes: ['room_id','room_name'],
          include: [
            {
              model: MeetingRoomGallery,
              attributes: ['img_path']
            }
          ]
        })

        const data = []

        room.forEach((r) => {
          let temp = {}
          temp.room_id = r.room_id
          temp.room_name = r.room_name
          temp.room_img = ROOM_IMAGE_PATH + r.room_galleries[0].img_path
          data.push(temp)
        })

        return res.send({status: 1, data: data})

      } catch (err) {
        return res.status(500).send(err.message)
      }
    }

    const getBookingPurposeList = async (req, res) => {
      try {
        const data = await BookingPurpose.findAll({
          order: [['name', 'asc']]
        })
        return res.send({ status: 1, data: data })
      } catch (err) {
        return res.status(500).send(err.message)
      }
    }

    const getRoomDeviceList = async (req, res) => {
      try {
        let data = await MeetingRoomDevice.findAll({
          order: [['name', 'asc']],
          attributes: ['room_device_id', 'name']
        })
        let device = []
        data.forEach((d) => {
          device.push({
            room_device_id: d.room_device_id,
            name: d.name,
            selected: false
          })
        })
        return res.send({ status: 1, data: device})

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
    getRoomDeviceList: getRoomDeviceList
  }