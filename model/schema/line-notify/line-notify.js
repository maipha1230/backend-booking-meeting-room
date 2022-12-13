module.exports = (sequelize, Sequelize) => {
    const line_notify = sequelize.define(
      "line_notify",
      {
        line_notify_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        token: {
          type: Sequelize.TEXT
        }
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return line_notify;
  };