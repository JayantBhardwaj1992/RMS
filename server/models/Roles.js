const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the User model schema
const RolesSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    RestaurantId: {type: Schema.Types.ObjectId},
    RoleName: String,
    IsActive: Boolean,
    CreatedBy:{type: Schema.Types.ObjectId},
    CreatedOn:{type: Date, default: Date.now},
    ModifiedBy:String,
    ModifiedOn:{type: Date, default: Date.now}
}, {collection: 'Roles'})

module.exports = mongoose.model('Roles', RolesSchema)
