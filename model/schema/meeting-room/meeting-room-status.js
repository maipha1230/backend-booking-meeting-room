module.exports = (sequelize, Sequelize) => {
    const room_status = sequelize.define(
      "room_status",
      {
        room_status_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(50),
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return room_status;
  };