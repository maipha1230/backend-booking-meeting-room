module.exports = (sequelize, Sequelize) => {
    const room = sequelize.define(
      "rooms",
      {
        room_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        room_name: {
          type: Sequelize.STRING(20),
        },
        room_size_id: {
          type: Sequelize.INTEGER,
        },
        room_capacity: {
            type: Sequelize.INTEGER(3)
        },
        room_status_id: {
          type: Sequelize.INTEGER
        }
      },
      {
        createdAt: true,
        updatedAt: true,
      }
    );
    return room;
  };