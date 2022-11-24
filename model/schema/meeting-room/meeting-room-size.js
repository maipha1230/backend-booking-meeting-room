module.exports = (sequelize, Sequelize) => {
    const room_size = sequelize.define(
      "room_size",
      {
        room_size_id: {
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
    return room_size;
  };