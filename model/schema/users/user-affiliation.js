module.exports = (sequelize, Sequelize) => {
    const user_affiliation = sequelize.define(
      "user_affiliations",
      {
        user_affiliation_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_affiliation_name: {
          type: Sequelize.STRING(50),
        },
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return user_affiliation;
  };