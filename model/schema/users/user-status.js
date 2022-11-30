module.exports = (sequelize, Sequelize) => {
    const user_status = sequelize.define(
      "user_statuses",
      {
        user_status_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_status_name: {
          type: Sequelize.STRING(30),
        },
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return user_status;
  };