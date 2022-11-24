const  {
  User,
  UserRole,
  UserPosition,
  UserRank,
  UserType,
  UserAffiliation
}  = require("../../model/index.model") ;

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

module.exports = {
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
  removeUserType: removeUserType

}
