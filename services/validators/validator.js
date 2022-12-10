const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/config')

const { User } = require('../../model/index.model')
 
module.exports = {
    adminVerify: async(req, res, next) => {
        // console.log(req.headers.authorization);
        const token = String(req.headers.authorization).split(' ')[1]

        if (token) {
            jwt.verify(token, JWT_SECRET, async(err, tokendata) => {
                if (err) {
                    return res.send({ status: 401, message: 'กรุณาเข้าสู่ระบบ' })
                } else {
                    const response = await User.findOne({
                    where: {
                        user_id: tokendata.user_id
                        }
                    })
                    if (response) {
                        if (response.user_status_id == 2){
                            return res.send({ status: 401, message: 'คุณถูกระงับการใช้งาน' })
                        }
                        if (response.user_role_id == 2) {
                            return res.send({ status: 401, message: 'คุณไม่มีสิทธ์เข้าถึง' })
                        }
                        res.locals.admin_id = response.user_id
                        next();
                    } else {
                        return res.send({ status: 401, message: 'ไม่พบผู้ใช้งานในระบบ' })
                    }       
                }
            })  
        } else {
            return res.send({ status: 401, message: 'กรุณาเข้าสู่ระบบ' })
        }
        
    },

    userVerify: async(req, res, next) => {
         // console.log(req.headers.authorization);
         const token = String(req.headers.authorization).split(' ')[1]

         if (token) {
             jwt.verify(token, JWT_SECRET, async(err, tokendata) => {
                 if (err) {
                     return res.send({ status: 401, message: 'กรุณาเข้าสู่ระบบ' })
                 } else {
                     const response = await User.findOne({
                     where: {
                         user_id: tokendata.user_id
                         }
                     })
                     if (response) {
                         if (response.user_status_id == 2){
                             return res.send({ status: 401, message: 'คุณถูกระงับการใช้งาน' })
                         }
                         res.locals.user_id = response.user_id
                         next();
                     } else {
                         return res.send({ status: 401, message: 'ไม่พบผู้ใช้งานในระบบ' })
                     }       
                 }
             })  
         } else {
             return res.send({ status: 401, message: 'กรุณาเข้าสู่ระบบ' })
         }
    }
}