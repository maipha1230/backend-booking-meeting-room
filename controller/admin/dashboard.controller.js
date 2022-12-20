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
  Sequelize,
  sequelize,
} = require("../../model/index.model");
const { Op } = require("sequelize");
const {
  USER_IMAGE_PATH,
  JWT_SECRET,
  ROOM_IMAGE_PATH,
} = require("../../config/config");
const users = require("../../model/schema/users/users");
const userStatus = require("../../model/schema/users/user-status");

const getBookingsOverview = async(req ,res) => {
  try {
    let booking = await sequelize.query(
      `
      SELECT bookings.approve_status as approve_status, COUNT(*) as count 
      FROM bookings
      GROUP BY bookings.approve_status
      `
    )

    booking = booking[0]
    let total = 0
    booking.forEach((b) => {
      total += b.count
    })
    
    return res.send({ status: 1, data: booking, total: total })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getUserOverview = async(req, res) => {
  try {
    let users = await sequelize.query(
      `
      SELECT users.user_status_id as status, COUNT(*) as count 
      FROM users
      WHERE users.user_role_id = 2
      GROUP BY users.user_status_id
      `
    ) 
    users = users[0]

    let status = await UserStatus.findAll()
    
    data = []
    status.forEach((s) => {
      data.push({
        status: s.user_status_id,
        count: 0
      })
    })  

    let total = 0

    data.forEach((d) => {
      users.forEach((user) => {
        if (user.status == d.status) {
          d.count = user.count
          total += user.count
        }
      })
    })

    return res.send({ status: 1, data: data, total: total  })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getAdminOverview = async(req, res) => {
  try {
    let users = await sequelize.query(
      `
      SELECT users.user_status_id as status, COUNT(*) as count 
      FROM users
      WHERE users.user_role_id = 1
      GROUP BY users.user_status_id
      `
    ) 
    users = users[0]

    let status = await UserStatus.findAll()
    
    data = []
    status.forEach((s) => {
      data.push({
        status: s.user_status_id,
        count: 0
      })
    })  

    let total = 0

    data.forEach((d) => {
      users.forEach((user) => {
        if (user.status == d.status) {
          d.count = user.count
          total += user.count
        }
      })
    })

    return res.send({ status: 1, data: data, total: total  })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}


const getRoomTime = async (req, res) => {
  try {
    let room = await MeetingRoom.findAll({
      attributes: ['room_id', 'room_name', 'room_color'],
      include: [
        {
          model: MeetingRoomGallery,
          attributes: ['img_path']
        }
      ]
    })
    let dateNow = new Date()
    let booking = await Booking.findAll({
      where: {
        approve_status: 1,
        date: { [Op.lt]: dateNow }
      },
      attributes: ['time_start', 'time_end', 'room_id']
    })

    function timetoMinutes(a, b){
      let start = String(a).split(":").map(Number)
      let end = String(b).split(":").map(Number)
      let p1 = start[0]*60 + start[1]
      let p2 = end[0]*60 + end[1]
      return p2 - p1; 

    }
    let data = []
    room.forEach((r) => {
      let temp = {}
      temp.room_id = r.room_id
      temp.room_name = r.room_name
      temp.room_img = ROOM_IMAGE_PATH + r.room_galleries[0].img_path
      temp.time = 0
      booking.forEach((b) => {
        if (r.room_id == b.room_id) {
          temp.time += timetoMinutes(b.time_start, b.time_end)
        }
      })
      data.push(temp)
    })

    function convertMinutesToYMDH(minutes) {
      const minutesPerYear = 525600;
      const minutesPerMonth = 43200;
      const minutesPerDay = 1440;
      const minutesPerHour = 60;
    
      let years = Math.floor(minutes / minutesPerYear);
      let remainder = minutes % minutesPerYear;
      let months = Math.floor(remainder / minutesPerMonth);
      remainder = remainder % minutesPerMonth;
      let days = Math.floor(remainder / minutesPerDay);
      remainder = remainder % minutesPerDay;
      let hours = Math.floor(remainder / minutesPerHour);
      remainder = remainder % minutesPerHour
    
      return {
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: remainder
      };
    }

    data.forEach((item) => {
      item.time = convertMinutesToYMDH(item.time)
    })

    return res.send({ status: 1, data: data })
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getAffiliationChart = async(req, res) => {
  try {
    let temp = await sequelize.query(
      `
      SELECT COUNT(*) as count , user_affiliations.user_affiliation_name as user_affiliation
      FROM bookings
      INNER JOIN users ON bookings.user_id = users.user_id
      INNER JOIN user_affiliations ON users.user_affiliation_id = user_affiliations.user_affiliation_id
      WHERE bookings.approve_status = 1
      GROUP BY user_affiliation
      `
    )
    temp  = temp[0]
   
    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    let data = {
      labels: [],
      datasets: [],
      count: []
    }
    let count = []
    let backgroundColor = []
    let affiliation_count = []
    temp.forEach((t) => {
      data.labels.push(t.user_affiliation)
      count.push(t.count)
      affiliation_count.push({
        affiliation: t.user_affiliation,
        count: t.count
      })
      backgroundColor.push(getRandomColor())
    })
    
    data.datasets.push(
      {
        label: "ใช้งาน",
        data: count,
        backgroundColor: backgroundColor,
        hoverOffset: 4
      }
    )

    return res.send({ status: 1, data: data, count: affiliation_count})
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = {
  getBookingsOverview: getBookingsOverview,
  getUserOverview: getUserOverview,
  getAdminOverview: getAdminOverview,
  getRoomTime: getRoomTime,
  getAffiliationChart: getAffiliationChart
};
