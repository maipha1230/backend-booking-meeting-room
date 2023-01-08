const {
  User,
  UserRole,
  UserPosition,
  UserRank,
  UserType,
  UserAffiliation,
  UserStatus,
  LineNotify,
} = require("../../model/index.model");
const { USER_IMAGE_PATH, JWT_SECRET } = require("../../config/config");
const bcrypt = require("bcrypt");

const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    //console.log(req.body);
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
      where: {
        user_role_id: 2
      },
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
        temp.picture_url = USER_IMAGE_PATH + user.picture_url;
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
        user_role_id: 2
      },
    });

    data = {};
    data.user_id = user.user_id;
    data.f_name = user.f_name;
    data.l_name = user.l_name;
    data.phone = user.phone;
    data.email = user.email;
    data.password = user.password;
    data.picture_url = USER_IMAGE_PATH + user.picture_url;
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

    //console.log(req.body);

    if (req.body.gallery.length > 0) {
      let old_image = await User.findOne({
        where: {
          user_id: user_id,
          user_role_id: 2
        },
        attributes: ["picture_url"],
      });

      if (old_image.picture_url) {
        try {
          let absolutePath = path.resolve(
            "public/image/profile/" + old_image.picture_url
          );
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(String(absolutePath));
            //console.log("delete " + absolutePath);
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
          },
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
          },
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

    if (old_image.picture_url) {
      try {
        let absolutePath = path.resolve(
          "public/image/profile/" + old_image.picture_url
        );
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(String(absolutePath));
          //console.log("delete " + absolutePath);
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

const resetUserPassword = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const password = await bcrypt.hash(req.body.password, 10);

    const reset = await User.update(
      {
        password: password,
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );
    return res.send({ status: 1, msg: "รีเซ็ทรหัสผ่านสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const createAdmin = async (req, res) => {
  try {
    //console.log(req.body);
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
        user_role_id: 1,
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
        user_role_id: 1,
        user_status_id: req.body.status,
      });
    }

    return res.send({ status: 1, msg: "เพิ่มผู้ดูแลระบบสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getAdmins = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        user_role_id: 1
      },
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
        temp.picture_url = USER_IMAGE_PATH + user.picture_url;
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

const getAdminById = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findOne({
      where: {
        user_id: user_id,
        user_role_id: 1
      },
    });

    data = {};
    data.user_id = user.user_id;
    data.f_name = user.f_name;
    data.l_name = user.l_name;
    data.phone = user.phone;
    data.email = user.email;
    data.password = user.password;
    data.picture_url = USER_IMAGE_PATH + user.picture_url;
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

const updateAdmin = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    //console.log(req.body);

    if (req.body.gallery.length > 0) {
      let old_image = await User.findOne({
        where: {
          user_id: user_id,
        },
        attributes: ["picture_url"],
      });

      if (old_image.picture_url) {
        try {
          let absolutePath = path.resolve(
            "public/image/profile/" + old_image.picture_url
          );
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(String(absolutePath));
            //console.log("delete " + absolutePath);
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
          },
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
          },
        }
      );
    }

    let admin_id = res.locals.admin_id
    if (admin_id == user_id) {
      return res.send({ status: 2, msg: "แก้ไขผู้ดูแลระบบสำเร็จ" });
    }
    return res.send({ status: 1, msg: "แก้ไขผู้ดูแลระบบสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeAdmin = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const old_image = await User.findOne({
      where: {
        user_id: user_id,
      },
      attributes: ["picture_url"],
    });

    if (old_image.picture_url) {
      try {
        let absolutePath = path.resolve(
          "public/image/profile/" + old_image.picture_url
        );
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(String(absolutePath));
          //console.log("delete " + absolutePath);
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
    return res.send({ status: 1, msg: "ลบผู้ดูแลระบบสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const resetAdminPassword = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const password = await bcrypt.hash(req.body.password, 10);

    const reset = await User.update(
      {
        password: password,
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );
    return res.send({ status: 1, msg: "เปลี่ยนรหัสผ่านสำเร็จ" });
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
    const data = await UserRole.findAll({
      order: [['user_role_id', 'asc']]
    });
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
    const data = await UserPosition.findAll({
      order: [['user_position_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserPosition = async (req, res) => {
  try {
    const user_position_id = req.params.user_position_id;

    if (user_position_id == 1) {
      return res.send({ status: 2, msg: "ไม่สามารถแก้ไขตำแหน่งนี้ได้" })
    }

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

    if (user_position_id == 1) {
      return res.send({ status: 2, msg: 'ไม่สามารถลบตำแหน่งนี้ได้' })
    }

    const updateUser = await User.update({
      user_position_id: 1
    },{
      where: {
        user_position_id: user_position_id
      }
    })

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
    return res.send({ status: 1, msg: "เพิ่มแผนกผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserAffiliation = async (req, res) => {
  try {
    const data = await UserAffiliation.findAll({
      order: [['user_affiliation_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserAffiliation = async (req, res) => {
  try {
    const user_affiliation_id = req.params.user_affiliation_id;

    if (user_affiliation_id == 1) {
      return res.send({ status: 2, msg: "ไม่สามารถแก้ไขแผนกนี้ได้" })
    }

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
    return res.send({ status: 1, msg: "แก้ไขแผนกผู้ใช้งานสำเร็จ" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const removeUserAffiliation = async (req, res) => {
  try {
    const user_affiliation_id = req.params.user_affiliation_id;

    if (user_affiliation_id == 1) {
      return res.send({ status: 2, msg: 'ไม่สามารถลบแผนกนี้ได้' })
    }

    const updateUser = await User.update({
      user_affiliation_id: 1
    },{
      where: {
        user_affiliation_id: user_affiliation_id
      }
    })

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
    const data = await UserRank.findAll({
      order: [['user_rank_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserRank = async (req, res) => {
  try {
    const user_rank_id = req.params.user_rank_id;

    if (user_rank_id == 1) {
      return res.send({ status: 2, msg: "ไม่สามารถแก้ไขระดับนี้ได้" })
    }

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

    if (user_rank_id == 1) {
      return res.send({ status: 2, msg: 'ไม่สามารถลบระดับนี้ได้' })
    }

    const updateUser = await User.update({
      user_rank_id: 1
    },{
      where: {
        user_rank_id: user_rank_id
      }
    })

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
    const data = await UserType.findAll({
      order: [['user_type_id', 'asc']]
    });
    return res.send({ status: 1, data: data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateUserType = async (req, res) => {
  try {
    const user_type_id = req.params.user_type_id;

    if (user_type_id == 1) {
      return res.send({ status: 2, msg: "ไม่สามารถแก้ไขประเภทบรรจุนี้ได้" })
    }

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

    if (user_type_id == 1) {
      return res.send({ status: 2, msg: 'ไม่สามารถลบประเภทบรรจุนี้ได้' })
    }

    const updateUser = await User.update({
      user_type_id: 1
    },{
      where: {
        user_type_id: user_type_id
      }
    })

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
    const data = await UserStatus.findAll({
      order: [['user_status_id', 'asc']]
    });
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

const getAdminNav = async(req, res) => {
  try {
    const user_id = res.locals.admin_id

    let user = await User.findOne({
      where: {
        user_id: user_id
      },
      attributes: ['f_name', 'l_name', 'picture_url']
    })

    user.picture_url = USER_IMAGE_PATH + user.picture_url 

    return res.send({ status: 1, data: user })

  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const createLineNotify = async(req ,res) => {
  try {

    const count = await LineNotify.count()

    if (count >= 1) {
      return res.send({ status: 2, msg: "โทเคนการแจ้งเตือนไลน์สามารถมีได้แค่โทเคนเดียว" })
    }

    const create = await LineNotify.create({
      token: req.body.token
    })
    return res.send({ status: 1, msg: "เพิ่มโทเคนการแจ้งเตือนไลน์สำเร็จ" })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const getLineNotify = async(req, res) => {
  try {
    const line = await LineNotify.findAll({
      order: [['line_notify_id', 'asc']]
    })
    return res.send({ status: 1, data: line })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const updateLineNotify = async(req, res) => {
  try {
    const line_notify_id = req.params.line_notify_id

    const update = await LineNotify.update({
      token: req.body.token
    },
    {
      where: {
        line_notify_id: line_notify_id
      }
    })
    return res.send({ status: 1, msg: "แก้ไขโทเคนการแจ้งเตือนไลน์สำเร็จ" })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const removeLineNotify = async(req, res) => {
  try {
    const line_notify_id = req.params.line_notify_id

    const remove = await LineNotify.destroy({
      where: {
        line_notify_id: line_notify_id
      }
    })
    return res.send({ status: 1, msg: "ลบโทเคนการแจ้งเตือนไลน์สำเร็จ" })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}


module.exports = {
  createUser: createUser,
  getUsers: getUsers,
  getUserById: getUserById,
  updateUser: updateUser,
  removeUser: removeUser,
  resetUserPassword: resetUserPassword,
  createAdmin: createAdmin,
  getAdmins: getAdmins,
  getAdminById: getAdminById,
  updateAdmin: updateAdmin,
  removeAdmin: removeAdmin,
  resetAdminPassword: resetAdminPassword,
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
  getAdminNav: getAdminNav,
  createLineNotify: createLineNotify,
  getLineNotify: getLineNotify,
  updateLineNotify: updateLineNotify,
  removeLineNotify: removeLineNotify
};
