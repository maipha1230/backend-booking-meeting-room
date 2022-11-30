module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define(
      "users",
      {
        user_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        f_name: {
          type: Sequelize.STRING(50),
        },
        l_name: {
          type: Sequelize.STRING(50),
        },
        password: {
          type: Sequelize.STRING 
        },
        phone: {
            type: Sequelize.STRING(10)
        },
        email: {
            type: Sequelize.STRING(30)
        },
        picture_url: {
            type: Sequelize.STRING(50)
        },
        user_affiliation_id: {
            type: Sequelize.INTEGER
        },
        user_position_id: {
            type: Sequelize.INTEGER
        },
        user_position_id: {
            type: Sequelize.INTEGER
        },
        user_rank_id: {
            type: Sequelize.INTEGER
        },
        user_type_id: {
            type: Sequelize.INTEGER
        },
        user_role_id: {
            type: Sequelize.INTEGER
        },
        user_status_id: {
            type: Sequelize.INTEGER
        }
      },
      {
        createdAt: true,
        updatedAt: true
      }
    );
    return user;
  };