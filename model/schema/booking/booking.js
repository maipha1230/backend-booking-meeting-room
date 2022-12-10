module.exports = (sequelize, Sequelize) => {
    const booking = sequelize.define(
      "booking",
      {
        booking_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER
        },
        room_id: {
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING(100)
        },
        booking_purpose_id: {
          type: Sequelize.INTEGER
        },
        quantity: {
          type: Sequelize.INTEGER(4)
        },
        date: {
          type: Sequelize.DATEONLY
        },
        time_start: {
          type: Sequelize.STRING(10)
        },
        time_end: {
          type: Sequelize.STRING(10)
        },
        approve_status: {
          type: Sequelize.INTEGER(1)
        }
        /*status 0 is for no check yet
          status 1 is for approve
          status 2 is for no approve
        */
      },
      {
        createdAt: true,
        updatedAt: true,
      }
    );
    return booking;
  };