module.exports = (sequelize, Sequelize) => {
    const booking_device = sequelize.define(
      "booking_device",
      {
        booking_device_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        booking_id: {
          type: Sequelize.INTEGER
        },
        room_device_id: {
          type: Sequelize.INTEGER,
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return booking_device;
  };