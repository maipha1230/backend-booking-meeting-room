const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    'booking-meeting-room',//database
    'root',//user
    '',//password 
    {//config
  
        dialect: 'mysql',
        host: '127.0.0.1',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        operatorsAliases:0,
        timezone:"+07:00"
    }
);

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//create meeting room schema
db.MeetingRoom = require('./schema/meeting-room/meeting-room')(sequelize, Sequelize)
db.MeetingRoomGallery = require('./schema/meeting-room/meeting-room-gallery')(sequelize, Sequelize)
db.MeetingRoomStatus = require('./schema/meeting-room/meeting-room-status')(sequelize, Sequelize)
db.MeetingRoomSize = require('./schema/meeting-room/meeting-room-size')(sequelize, Sequelize)
db.MeetingRoomDevice = require('./schema/meeting-room/meeting-room-device')(sequelize, Sequelize)

//create users schema
db.User = require('./schema/users/users')(sequelize, Sequelize)
db.UserRole = require('./schema/users/user-role')(sequelize, Sequelize)
db.UserAffiliation = require('./schema/users/user-affiliation')(sequelize, Sequelize)
db.UserPosition = require('./schema/users/user-position')(sequelize, Sequelize)
db.UserRank = require('./schema/users/user-rank')(sequelize, Sequelize)
db.UserType = require('./schema/users/user-type')(sequelize, Sequelize)
db.UserStatus = require('./schema/users/user-status')(sequelize, Sequelize)

//create booking schema
db.BookingPurpose = require('./schema/booking/booking-purpose')(sequelize, Sequelize)


//meeting room relations
db.MeetingRoom.hasMany(db.MeetingRoomGallery, { foreignKey: 'room_id' })
db.MeetingRoomGallery.belongsTo(db.MeetingRoom, { foreignKey: 'room_id' })
db.MeetingRoomSize.hasOne(db.MeetingRoom, { foreignKey: 'room_size_id' })
db.MeetingRoom.belongsTo(db.MeetingRoomSize, { foreignKey: 'room_size_id' })
db.MeetingRoomStatus.hasOne(db.MeetingRoom, { foreignKey: 'room_status_id' })
db.MeetingRoom.belongsTo(db.MeetingRoomStatus, { foreignKey: 'room_status_id' })

//users realattions
db.UserAffiliation.hasOne(db.User, { foreignKey: 'user_affiliation_id' })
db.User.belongsTo(db.UserAffiliation, { foreignKey: 'user_affiliation_id' })
db.UserPosition.hasOne(db.User, { foreignKey: 'user_position_id' })
db.User.belongsTo(db.UserPosition, { foreignKey: 'user_position_id' })
db.UserRank.hasOne(db.User, { foreignKey: 'user_rank_id' })
db.User.belongsTo(db.UserRank, { foreignKey: 'user_rank_id' })
db.UserType.hasOne(db.User, { foreignKey: 'user_type_id' })
db.User.belongsTo(db.UserType, { foreignKey: 'user_type_id' })
db.UserRole.hasOne(db.User, { foreignKey: 'user_role_id' })
db.User.belongsTo(db.UserRole, { foreignKey: 'user_role_id' })
db.UserStatus.hasOne(db.User, { foreignKey:  'user_status_id'})
db.User.belongsTo(db.UserStatus, { foreignKey: 'user_status_id' })

module.exports = db