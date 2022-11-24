module.exports = (sequelize, Sequelize) => {
    const user_type = sequelize.define(
      "user_types",
      {
        user_type_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_type_name: {
          type: Sequelize.STRING(30),
        },
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return user_type;
  };