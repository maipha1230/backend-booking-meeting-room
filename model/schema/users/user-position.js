module.exports = (sequelize, Sequelize) => {
    const user_position = sequelize.define(
      "user_positions",
      {
        user_position_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_position_name: {
          type: Sequelize.STRING(50),
        },
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return user_position;
  };