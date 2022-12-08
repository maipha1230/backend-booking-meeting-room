module.exports = (sequelize, Sequelize) => {
    const room_device = sequelize.define(
      "room_device",
      {
        room_device_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(50),
        },
        img_path: {
          type: Sequelize.STRING
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return room_device;
  };