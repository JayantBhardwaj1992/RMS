const mongoose = require('mongoose')
const shortid = require('shortid')
const crypto = require('crypto')
const config = require('../../config')

// define the User model schema
const RestaurantMasterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    RestaurantId: {type: mongoose.Schema.Types.ObjectId},

    RoleId: {type: mongoose.Schema.Types.ObjectId , ref: 'Roles', autopopulate: true},
    FirstName: String,
    LastName: String,
    UserName: String,
    Contact: { type: String },
    Address: String,
    Password: { type: String },
    Image: String,
    IsActive: Boolean,
    CreatedBy: String,
    CreatedOn: { type: Date, default: Date.now },
    ModifiedBy: String,
    ModifiedOn: { type: Date, default: Date.now }
}, {collection: 'Restaurant Users'})

RestaurantMasterSchema.plugin(require('mongoose-autopopulate'))
RestaurantMasterSchema.statics.findOneByUserName = function (UserName) {
    return this.findOne({
        UserName: UserName
    }).exec()
}
  
// verify the password of the User documment
RestaurantMasterSchema.methods.verify = function (Password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(Password)
        .digest('base64')
    return this.Password === encrypted
}

module.exports = mongoose.model('Restaurant Users', RestaurantMasterSchema)
