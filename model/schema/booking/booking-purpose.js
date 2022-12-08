module.exports = (sequelize, Sequelize) => {
    const booking_purpose = sequelize.define(
      "booking_purpose",
      {
        booking_purpose_id: {
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
    return booking_purpose;
  };