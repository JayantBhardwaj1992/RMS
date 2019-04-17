const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the User model schema
const CategorySchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    RestaurantId: {type: Schema.Types.ObjectId},
    CategoryName: String,
    IsActive: Boolean,
    CreatedBy:{type: Schema.Types.ObjectId},
    CreatedOn:{type: Date, default: Date.now},
    ModifiedBy:String,
    ModifiedOn:{type: Date, default: Date.now}
}, {collection: 'Restaurant Food Category'})

module.exports = mongoose.model('Restaurant Food Category', CategorySchema)
