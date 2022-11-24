module.exports = (sequelize, Sequelize) => {
    const room_gallery = sequelize.define(
      "room_galleries",
      {
        room_gallery_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        img_path: {
          type: Sequelize.STRING(50),
        },
        room_id: {
          type: Sequelize.INTEGER,
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return room_gallery;
  };