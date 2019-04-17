const mongoose = require('mongoose')
const shortid = require('shortid')
const crypto = require('crypto')
const config = require('../../config')

// define the User model schema
const RestaurantMasterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    RestaurantName: {
        type: String   
    },
    RestaurantCode: {type: String, 'default': shortid.generate },
    RestaurantLogo: String,
    AboutRestaurant: String,
    ContactPersonName: String,
    ContactPersonEmail: { type: String },
    Password: { type: String },
    Address: String,
    IsActive: Boolean,
    CreatedBy: String,
    CreatedOn: { type: Date, default: Date.now },
    ModifiedBy: String,
    ModifiedOn: { type: Date, default: Date.now }
}, {collection: 'Restaurant Master'})


RestaurantMasterSchema.statics.findOneByContactPersonEmail = function (ContactPersonEmail) {
    return this.findOne({
        ContactPersonEmail: ContactPersonEmail
    }).exec()
}
  
// verify the password of the User documment
RestaurantMasterSchema.methods.verify = function (Password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(Password)
        .digest('base64')
    return this.Password === encrypted
}

module.exports = mongoose.model('Restaurant Master', RestaurantMasterSchema)
