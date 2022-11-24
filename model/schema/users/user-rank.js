module.exports = (sequelize, Sequelize) => {
    const user_rank = sequelize.define(
      "user_ranks",
      {
        user_rank_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_rank_name: {
          type: Sequelize.STRING(30),
        },
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return user_rank;
  };