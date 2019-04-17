const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the User model schema
const TaxSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    RestaurantId: {type: Schema.Types.ObjectId},
    TaxName: String,
    TaxPercentage: Number,
    IsActive: Boolean,
    CreatedBy: {type: Schema.Types.ObjectId},
    CreatedOn: {type: Date, default: Date.now},
    ModifiedBy: String,
    ModifiedOn: {type: Date, default: Date.now}
}, {collection: 'Restaurant Tax'})

module.exports = mongoose.model('Restaurant Tax', TaxSchema)
