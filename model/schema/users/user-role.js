module.exports = (sequelize, Sequelize) => {
    const user_role = sequelize.define(
      "user_roles",
      {
        user_role_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_role_name: {
          type: Sequelize.STRING(20),
        },
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return user_role;
  };