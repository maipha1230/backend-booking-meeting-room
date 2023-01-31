const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path')
const { PORT} = require('./config/config')
app.use(cors())
app.use(express.json({ extended: false, limit: '500mb' }))
app.use(express.urlencoded({ extended: true, limit: '500mb' }))


//use express static folder
app.use('/api', express.static(path.join(__dirname, '/public')))

// Set the path to the dist folder
const distPath = path.join(__dirname, '/dist/booking-meeting-room');
app.use(express.static(distPath));

//database
const db = require("./model/index.model");
// db.sequelize.sync({ force: true, alter: true });
db.sequelize.sync();

app.use('/api', require('./routes/index.route'))

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

app.listen(PORT || 3000, () => {
    console.log('server is running on port: '+ PORT);
})
