
const fs = require('fs')
const path = require('path')
module.exports = app => {
  fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
    require(path.join(__dirname, 'routes', file))(app)
  })
}