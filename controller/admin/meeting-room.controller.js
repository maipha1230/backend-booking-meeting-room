const { MeetingRoom, MeetingRoomGallery, MeetingRoomSize, MeetingRoomStatus } = require('../../model/index.model')
const fs = require("fs");
const path = require("path");
const meetingRoomGallery = require('../../model/schema/meeting-room/meeting-room-gallery');
const createMeetingRoom = async(req, res) => {
    try {
        
        const create = await MeetingRoom.create({
            room_name: req.body.room_name,
            room_size_id: req.body.room_size_id,
            room_capacity: req.body.room_capacity,
            room_status_id: req.body.room_status_id
        })

        if (req.body.gallery) {
            let room_id = await MeetingRoom.findOne({
                order: [['room_id', 'DESC']],
                attributes: ['room_id']
            })
            room_id = room_id.room_id

            let gallery = []
            for(let i = 0; i < req.body.gallery.length; i++){
                gallery.push({
                    img_path: req.body.gallery[i],
                    room_id: room_id
                })
            }

            const insertRoomGallery = await MeetingRoomGallery.bulkCreate(gallery)
        }

        return res.send({ status: 1, msg: 'เพิ่มห้องประชุมสำเร็จ' })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

const getMeetingRoom = async(req, res) => {
    try {
        const data = await MeetingRoom.findAll({
            order: [['room_id', 'asc']],
            include: [
                {
                    model: MeetingRoomGallery,
                    attributes: ['img_path']
                },
                {
                    model: MeetingRoomSize,
                    attributes: ['name']
                },
                {
                    model: MeetingRoomStatus,
                    attributes: ['name']
                },
            ]
        })

        let meeting_room = []

        data.forEach((item) => {
            let temp = {}
            temp.room_id = item.room_id
            temp.room_name = item.room_name
            temp.room_size_id = item.room_size_id,
            temp.room_size = item.room_size.name
            temp.room_capacity = item.room_capacity
            temp.room_status_id = item.room_status_id
            temp.room_status = item.room_status.name
            temp.room_gallery = []
            item.room_galleries.reverse();
            item.room_galleries.forEach((img) => {
                temp.room_gallery.push( {
                    img_path: "http://localhost:3000/api/image/meeting-room/"+img.img_path,
                    img_name: img.img_path
                } )
            })
            meeting_room.push(temp)
        })

        return res.send({ status: 1, data: meeting_room })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

const getMeetingRoomById = async(req, res) => {
    try {
        const room_id = req.params.room_id

        const room = await MeetingRoom.findOne({
            where: {
                room_id: room_id
            },
            include: [
                {
                    model: MeetingRoomSize,
                    attributes: ['room_size_id']
                },
                {
                    model: MeetingRoomStatus,
                    attributes: ['room_status_id']
                },
                {
                    model: MeetingRoomGallery,
                    attributes: ['img_path']
                }
            ]
        })

        room.room_galleries.reverse();

        let data = {}
        data.room_id = room.room_id
        data.room_name = room.room_name
        data.room_size_id = room.room_size_id
        data.room_status_id = room.room_status_id
        data.room_capacity = room.room_capacity
        data.room_gallery = []
        room.room_galleries.forEach((item) => {
            data.room_gallery.push({
                img_path: "http://localhost:3000/api/image/meeting-room/"+item.img_path,
                img_name: String(item.img_path)
            })
        })
        return res.send({ status: 1, data: data })

    } catch (err) {
        return res.status(500).send(err.message)
    }
}

const updateMeetingRoom = async(req, res) => {
    try {
        const room_id = req.params.room_id

        const update = await MeetingRoom.update({
            room_name: req.body.room_name,
            room_size_id: req.body.room_size_id,
            room_capacity: req.body.room_capacity,
            room_status_id: req.body.room_status_id
        },
        {
            where: {
                room_id: room_id
            }
        })

        if (req.body.gallery) {
            let gallery = []
            for(let i = 0; i < req.body.gallery.length; i++){
                gallery.push({
                    img_path: req.body.gallery[i],
                    room_id: room_id
                })
            }

            const insertRoomGallery = await MeetingRoomGallery.bulkCreate(gallery)
        }

        return res.send({ status: 1, msg: 'แก้ไขห้องประชุมสำเร็จ' })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

const removeMeetingRoom = async(req, res) => {
    try {
        const room_id = req.params.room_id

        const gallery = await MeetingRoomGallery.findAll({
            where: {
                room_id: room_id
            },
            attributes: ['img_path']
        })

        await gallery.forEach((item) => {
            try {
              let absolutePath = path.resolve(
                "public/image/meeting-room/" + item.img_path
              );
              if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(String(absolutePath));
                console.log("delete " + absolutePath);
              }
            } catch (error) {
              res.status(500).send(error.message);
            }
          });

          const removeMeetingRoom = await MeetingRoom.destroy({
            where: {
                room_id: room_id
            }
          })
        
        return res.send({ status: 1, msg: 'ลบห้องประชุมสำเร็จ' })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

const removeMeetingRoomImage = async(req, res) => {
    try {
        const image_name = req.body.image_name

        try {
            let absolutePath = path.resolve(
              "public/image/meeting-room/" + image_name
            );
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(String(absolutePath));
              console.log("delete " + absolutePath);
            }
          } catch (error) {
            res.status(500).send(error.message);
          }

        const remove = await MeetingRoomGallery.destroy({
            where: {
                img_path: image_name
            }
        })

        return res.send({ status: 1, msg: 'ลบรูปภาพสำเร็จ' })

    } catch (err) {
        return res.status(500).send(err.message)
    }
}


//meeting room size
const createMeetingRoomSize = async(req, res) => {
    try {
        const response = await MeetingRoomSize.create({
            name: req.body.name
        })

        return res.send({ status: 1 , msg: 'เพิ่มขนาดห้องประชุมสำเร็จ'})
    } catch (err) {
        return res.status(500).send(err.message)
    }
}
const getMeetingRoomSize = async(req, res) => {
    try {
        const data = await MeetingRoomSize.findAll();
        return res.send({ status: 1, data: data })
    } catch (err) {
        res.status(500).send(err.message)
    }
}
const updateMeetingRoomSize = async(req, res) => {
    try {
        const room_size_id = req.params.room_size_id;
        const name = req.body.name;

        const update = await MeetingRoomSize.update({
            name: name
        },
        {
            where: {
                room_size_id: room_size_id
            }
        })
        return res.send({ status: 1, msg: "แก้ไขขนาดห้องสำเร็จ" })
    } catch (err) {
        return res.status(500).send(err.message)
    }

}
const removeMeetingRoomSize = async(req, res) => {
    try {
        const room_size_id = req.params.room_size_id

        const remove = await MeetingRoomSize.destroy({
            where: {
                room_size_id: room_size_id
            }
        })
        return res.send({ status: 1, msg: "ลบขนาดห้องสำเร็จ" })
    } catch (err) {
        return res.status(500).send(err.message)
    }

}

//meeting room status
const createMeetingRoomStatus = async(req, res) => {
    try {
        const create = await MeetingRoomStatus.create({
            name: req.body.name
        })

        return res.send({ status: 1, msg: 'เพิ่มสถานะห้องประชุมสำเร็จ' })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}
const getMeetingRoomStatus = async(req, res) => {
    try {
        const data = await MeetingRoomStatus.findAll()
        return res.send({ status: 1, data: data })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}
const updateMeetingRoomStatus = async(req, res) => {
    try {
        const room_status_id = req.params.room_status_id
        
        const update = await MeetingRoomStatus.update({
            name: req.body.name
        }, {
            where: {
                room_status_id: room_status_id
            }
        }) 
        return res.send({ status: 1, msg: 'แก้ไขสถานะห้องประชุมสำเร็จ' })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}
const removeMeetingRoomStatus = async(req, res) => {
    try {
        const room_status_id = req.params.room_status_id

        const count = await MeetingRoomStatus.count();

        if (count == 2) {
            return res.send({ status: 2, msg: "ไม่สามารถลบสถานะห้องประชุมได้" })
        } else {
            const remove = await MeetingRoomStatus.destroy({
                where: {
                    room_status_id: room_status_id
                }
            })
            return res.send({ status: 1, msg: 'ลบสถานะห้องประชุมสำเร็จ' })
        }

        
    } catch (err) {
        return res.status(500).send(err.message)
    }
}




module.exports = {
    createMeetingRoom: createMeetingRoom,
    getMeetingRoom: getMeetingRoom,
    getMeetingRoomById: getMeetingRoomById,
    updateMeetingRoom: updateMeetingRoom,
    removeMeetingRoom: removeMeetingRoom,
    createMeetingRoom: createMeetingRoom,
    createMeetingRoomSize: createMeetingRoomSize,
    getMeetingRoomSize: getMeetingRoomSize,
    removeMeetingRoomSize: removeMeetingRoomSize,
    updateMeetingRoomSize: updateMeetingRoomSize,
    createMeetingRoomStatus: createMeetingRoomStatus,
    getMeetingRoomStatus: getMeetingRoomStatus,
    updateMeetingRoomStatus: updateMeetingRoomStatus,
    removeMeetingRoomStatus: removeMeetingRoomStatus,
    removeMeetingRoomImage: removeMeetingRoomImage
    
}