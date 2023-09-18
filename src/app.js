const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT
const config = require('./config')

const app = express()
app.use(bodyParser.urlencoded(config.bodyParserOptions))
app.use(bodyParser.json(config.bodyParserOptions))
app.use(cookieParser())
app.use(morgan('combined'))
app.use(cors(config.corsOptions))

app.use('/uploads', express.static('uploads'))

const connect = async function () {
  try {
    //await mongoconnect()
    //await oracleConnect()
    require('./routes')(app)
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`)
    })
  } catch (err) {
    console.error('connection error:', err)
    await connect()
  }
}
connect()
/*
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Listening :>> ", port);
});
*/
