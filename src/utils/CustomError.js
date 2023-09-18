class CustomError extends Error {
    constructor (message, options = {}) {
      super(message)
      this.status = options.status || 403
      this.type = options.type || 'warning'
      this.isLogout = options.isLogout
      this.errorCode = options.errorCode || '403'
      this.success = options.success
    }
  }
  module.exports = CustomError
  