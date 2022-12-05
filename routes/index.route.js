const express = require('express')
const app = express()
const validator = require('../services/validators/validator')

app.use('/users', require('./user/user.route'))

app.use('/admin', validator.adminVerify, require('./admin/admin.route'))


module.exports = app