const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../../config')

const User = new Schema({
  UserName: String,
  Password: String,
  IsFirstLogin: Boolean,
  ContactPersonName: String
}, {collection: 'Super Admin'})

User.statics.create = function (username, password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                      .update(password)
                      .digest('base64')

  const user = new this({
      UserName: username,
      Password: encrypted
    })
    // return the Promise
  return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function (username) {
  return this.findOne({
      UserName: username
    }).exec()
}

// verify the password of the User documment
User.methods.verify = function (Password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                      .update(Password)
                      .digest('base64')
  return this.Password === encrypted
}

module.exports = mongoose.model('Super Admin', User)
