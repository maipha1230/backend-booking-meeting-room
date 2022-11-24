const express = require('express')
const app = express()


app.use('/users', require('./user/user.route'))

app.use('/admin', require('./admin/admin.route'))


module.exports = app