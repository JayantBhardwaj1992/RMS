const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the User model schema
const PremisesTypeSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    RestaurantId: {type: Schema.Types.ObjectId},
    PremisesType: String,
    IsActive: Boolean,
    CreatedBy:{type: Schema.Types.ObjectId},
    CreatedOn:{type: Date, default: Date.now},
    ModifiedBy:String,
    ModifiedOn:{type: Date, default: Date.now}
}, {collection: 'PremisesTypes'})

module.exports = mongoose.model('PremisesTypes', PremisesTypeSchema)
