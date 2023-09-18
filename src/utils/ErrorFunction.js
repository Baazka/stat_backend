const CustomError = require('./CustomError')
const jwt = require('jsonwebtoken')

module.exports = {
  async saveErrorAndSend(req, res, err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({
        errorCode: 401,
        error: 'Токены хугацаа дууссан байна. Дахин нэвтэрнэ үү.',
        type: 'warning',
        isLogout: true
      })
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({
        errorCode: 401,
        error: 'Буруу токен байна. Дахин нэвтэрнэ үү.',
        type: 'warning',
        isLogout: true
      })
    } else if (err instanceof CustomError) {
      return res.status(err.status).send({
        error: err.message,
        type: err.type,
        isLogout: err.isLogout,
        isSave: err.isSave
      })
    } else {
      const statusCode = err.statusCode || 500
      res.status(statusCode)
      res.json({ error: 'Системийн алдаа гарлаа.', success: false })
    }
  }
}
