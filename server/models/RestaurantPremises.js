const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the User model schema
const RestaurantPremisesSchema = new Schema({
  _id: {type: Schema.Types.ObjectId},
  PremisiveTypeId: {type: Schema.Types.ObjectId, ref: 'PremisesTypes', autopopulate: true},
  RestaurantId: {type: Schema.Types.ObjectId},
  RestaurantPremisesName: String,
  Floor: {type: Number},
  Capacity: {type: Number},
  Tables: {type: Number},
  TableDetails: [],
  IsActive: Boolean,
  CreatedBy: {type: Schema.Types.ObjectId},
  CreatedOn: {type: Date, default: Date.now},
  ModifiedBy: {type: Schema.Types.ObjectId},
  ModifiedOn: {type: Date, default: Date.now}
}, {collection: 'Restaurant Premises'})
RestaurantPremisesSchema.plugin(require('mongoose-autopopulate'))
module.exports = mongoose.model('Restaurant Premises', RestaurantPremisesSchema)
