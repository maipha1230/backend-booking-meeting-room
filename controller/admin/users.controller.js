const {
  User,
  UserRole,
  UserPosition,
  UserRank,
  UserType,
  UserAffiliation,
  UserStatus,
} = require("../../model/index.model");

const bcrypt = require("bcrypt");

const path = require("path");
const fs = require("fs");

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const password = await bcrypt.hash(req.body.password, 10);

    if (req.body.gallery) {
      const create = await User.create({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        password: password,
        phone: req.body.phone,
        email: req.body.email,
        picture_url: req.body.gallery[0],
        user_affiliation_id: req.body.affiliation,
        user_position_id: req.body.position,
        user_rank_id: req.body.rank,
        user_type_id: req.body.type,
        user_role_id: 2,
        user_status_id: req.body.status,
      });
    } else {
      const create = await User.create({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        password: password,
        phone: req.body.phone,
        email: req.body.email,
        user_affiliation_id: req.body.affiliation,
        user_position_id: req.body.position,
        user_rank_id: req.body.rank,
        user_type_id: req.body.type,
        user_role_id: 2,
        user_status_id: req.body.status,
      });
    }

    return res.send({ status: 1, msg: "เพิ่มผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserAffiliation,
          attributes: ["user_affiliation_name"],
        },
        {
          model: UserPosition,
          attributes: ["user_position_name"],
        },
        {
          model: UserRank,
          attributes: ["user_rank_name"],
        },
        {
          model: UserType,
          attributes: ["user_type_name"],
        },
        {
          model: UserStatus,
          attributes: ["user_status_id"],
        },
      ],
    });

    let data = [];
    users.forEach((user) => {
      let temp = {};
      temp.user_id = user.user_id;
      temp.f_name = user.f_name;
      temp.l_name = user.l_name;
      temp.phone = user.phone;
      temp.email = user.email;
      if (user.picture_url) {
        temp.picture_url =
          "http://localhost:3000/api/image/profile/" + user.picture_url;
      } else {
        temp.picture_url = "";
      }
      temp.affiliation = user.user_affiliation.user_affiliation_name;
      temp.position = user.user_position.user_position_name;
      temp.rank = user.user_rank.user_rank_name;
      temp.type = user.user_type.user_type_name;
      temp.status = user.user_status.user_status_id;

      data.push(temp);
    });

    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findOne({
      where: {
        user_id: user_id,
      },
    });

    data = {};
    data.user_id = user.user_id;
    data.f_name = user.f_name;
    data.l_name = user.l_name;
    data.phone = user.phone;
    data.email = user.email;
    data.password = user.password;
    data.picture_url =
      "http://localhost:3000/api/image/profile/" + user.picture_url;
    data.affiliation_id = user.user_affiliation_id;
    data.position_id = user.user_position_id;
    data.rank_id = user.user_rank_id;
    data.type_id = user.user_type_id;
    data.status_id = user.user_status_id;

    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    console.log(req.body);

    if (req.body.gallery) {
      let old_image = await User.findOne({
        where: {
          user_id: user_id,
        },
        attributes: ["picture_url"],
      });

      if (old_image) {
        try {
          let absolutePath = path.resolve(
            "public/image/profile" + old_image.picture_url
          );
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(String(absolutePath));
            console.log("delete " + absolutePath);
          }
        } catch (error) {
          res.status(500).send(error.message);
        }
      }

      const update = await User.update(
        {
          f_name: req.body.f_name,
          l_name: req.body.l_name,
          phone: req.body.phone,
          email: req.body.email,
          picture_url: req.body.gallery[0],
          user_affiliation_id: req.body.affiliation,
          user_position_id: req.body.position,
          user_rank_id: req.body.rank,
          user_type_id: req.body.type,
          user_status_id: req.body.status,
        },
        {
          where: {
            user_id: user_id,
          }
        }
      );
    } else {
      const update = await User.update(
        {
          f_name: req.body.f_name,
          l_name: req.body.l_name,
          phone: req.body.phone,
          email: req.body.email,
          user_affiliation_id: req.body.affiliation,
          user_position_id: req.body.position,
          user_rank_id: req.body.rank,
          user_type_id: req.body.type,
          user_status_id: req.body.status,
        },
        {
          where: {
            user_id: user_id,
          }
        }
      );
    }
    return res.send({ status: 1, msg: "แก้ไขผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const old_image = await User.findOne({
      where: {
        user_id: user_id,
      },
      attributes: ["picture_url"],
    });

    if (old_image) {
      try {
        let absolutePath = path.resolve(
          "public/image/profile" + old_image.picture_url
        );
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(String(absolutePath));
          console.log("delete " + absolutePath);
        }
      } catch (error) {
        res.status(500).send(error.message);
      }
    }

    const remove = await User.destroy({
      where: {
        user_id: user_id,
      },
    });

    return res.send({ status: 1, msg: "ลบผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const createUserRole = async (req, res) => {
  try {
    const create = await UserRole.create({
      user_role_name: req.body.name,
    });
    return res.send({ status: 1, msg: "เพิ่มบทบาทผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserRole = async (req, res) => {
  try {
    const data = await UserRole.findAll();
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user_role_id = req.params.user_role_id;

    const update = await UserRole.update(
      {
        user_role_name: req.body.name,
      },
      {
        where: {
          user_role_id: user_role_id,
        },
      }
    );
    return res.send({ status: 1, msg: "แก้ไขบทบาทผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserRole = async (req, res) => {
  try {
    const user_role_id = req.params.user_role_id;

    const count = await UserRole.count();

    if (count == 2) {
      return res.send({ status: 2, msg: "ไม่สามารถลบบทบาทผู้ใช้งานได้" });
    } else {
      const remove = await UserRole.destroy({
        where: {
          user_role_id: user_role_id,
        },
      });
    }
    return res.send({ status: 1, msg: "ลบบทบาทผู้ใช้งานสำเร็จ" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUserPosition = async (req, res) => {
  try {
    const create = await UserPosition.create({
      user_position_name: req.body.name,
    });
    return res.send({ status: 1, msg: "เพิ่มตำแหน่งผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserPosition = async (req, res) => {
  try {
    const data = await UserPosition.findAll();
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserPosition = async (req, res) => {
  try {
    const user_position_id = req.params.user_position_id;

    const update = await UserPosition.update(
      {
        user_position_name: req.body.name,
      },
      {
        where: {
          user_position_id: user_position_id,
        },
      }
    );
    return res.send({ status: 1, msg: "แก้ไขตำแหน่งผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserPosition = async (req, res) => {
  try {
    const user_position_id = req.params.user_position_id;

    const remove = await UserPosition.destroy({
      where: {
        user_position_id: user_position_id,
      },
    });
    return res.send({ status: 1, msg: "ลบตำแหน่งผู้ใช้งานสำเร็จ" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUserAffiliation = async (req, res) => {
  try {
    const create = await UserAffiliation.create({
      user_affiliation_name: req.body.name,
    });
    return res.send({ status: 1, msg: "เพิ่มสังกัดผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserAffiliation = async (req, res) => {
  try {
    const data = await UserAffiliation.findAll();
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserAffiliation = async (req, res) => {
  try {
    const user_affiliation_id = req.params.user_affiliation_id;

    const update = await UserAffiliation.update(
      {
        user_affiliation_name: req.body.name,
      },
      {
        where: {
          user_affiliation_id: user_affiliation_id,
        },
      }
    );
    return res.send({ status: 1, msg: "แก้ไขสังกัดผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserAffiliation = async (req, res) => {
  try {
    const user_affiliation_id = req.params.user_affiliation_id;

    const remove = await UserAffiliation.destroy({
      where: {
        user_affiliation_id: user_affiliation_id,
      },
    });
    return res.send({ status: 1, msg: "ลบสังกัดผู้ใช้งานสำเร็จ" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUserRank = async (req, res) => {
  try {
    const create = await UserRank.create({
      user_rank_name: req.body.name,
    });
    return res.send({ status: 1, msg: "เพิ่มระดับผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserRank = async (req, res) => {
  try {
    const data = await UserRank.findAll();
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserRank = async (req, res) => {
  try {
    const user_rank_id = req.params.user_rank_id;

    const update = await UserRank.update(
      {
        user_rank_name: req.body.name,
      },
      {
        where: {
          user_rank_id: user_rank_id,
        },
      }
    );
    return res.send({ status: 1, msg: "แก้ไขระดับผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserRank = async (req, res) => {
  try {
    const user_rank_id = req.params.user_rank_id;

    const remove = await UserRank.destroy({
      where: {
        user_rank_id: user_rank_id,
      },
    });
    return res.send({ status: 1, msg: "ลบระดับผู้ใช้งานสำเร็จ" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUserType = async (req, res) => {
  try {
    const create = await UserType.create({
      user_type_name: req.body.name,
    });
    return res.send({ status: 1, msg: "เพิ่มประเภทบรรจุผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserType = async (req, res) => {
  try {
    const data = await UserType.findAll();
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserType = async (req, res) => {
  try {
    const user_type_id = req.params.user_type_id;

    const update = await UserType.update(
      {
        user_type_name: req.body.name,
      },
      {
        where: {
          user_type_id: user_type_id,
        },
      }
    );
    return res.send({ status: 1, msg: "แก้ไขประเภทบรรจุผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserType = async (req, res) => {
  try {
    const user_type_id = req.params.user_type_id;

    const remove = await UserType.destroy({
      where: {
        user_type_id: user_type_id,
      },
    });
    return res.send({ status: 1, msg: "ลบประเภทบรรจุผู้ใช้งานสำเร็จ" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUserStatus = async (req, res) => {
  try {
    const create = await UserStatus.create({
      user_status_name: req.body.name,
    });
    return res.send({ status: 1, msg: "เพิ่มสถานะผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserStatus = async (req, res) => {
  try {
    const data = await UserStatus.findAll();
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user_status_id = req.params.user_status_id;

    const update = await UserStatus.update(
      {
        user_status_name: req.body.name,
      },
      {
        where: {
          user_status_id: user_status_id,
        },
      }
    );
    return res.send({ status: 1, msg: "แก้ไขสถานะผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserStatus = async (req, res) => {
  try {
    const user_status_id = req.params.user_status_id;

    const count = await UserStatus.count();

    if (count <= 2) {
      return res.send({ status: 2, msg: "ไม่สามารถลบสถานะผู้ใช้งานได้" });
    } else {
      const remove = await UserStatus.destroy({
        where: {
          user_status_id: user_status_id,
        },
      });
      return res.send({ status: 1, msg: "ลบสถานะผู้ใช้งานสำเร็จ" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createUser: createUser,
  getUsers: getUsers,
  getUserById: getUserById,
  updateUser: updateUser,
  removeUser: removeUser,
  createUserRole: createUserRole,
  getUserRole: getUserRole,
  updateUserRole: updateUserRole,
  removeUserRole: removeUserRole,
  createUserPosition: createUserPosition,
  getUserPosition: getUserPosition,
  updateUserPosition: updateUserPosition,
  removeUserPosition: removeUserPosition,
  createUserAffiliation: createUserAffiliation,
  getUserAffiliation: getUserAffiliation,
  updateUserAffiliation: updateUserAffiliation,
  removeUserAffiliation: removeUserAffiliation,
  createUserRank: createUserRank,
  getUserRank: getUserRank,
  updateUserRank: updateUserRank,
  removeUserRank: removeUserRank,
  createUserType: createUserType,
  getUserType: getUserType,
  updateUserType: updateUserType,
  removeUserType: removeUserType,
  createUserStatus: createUserStatus,
  getUserStatus: getUserStatus,
  updateUserStatus: updateUserStatus,
  removeUserStatus: removeUserStatus,
};
