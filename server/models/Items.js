const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the User model schema
const ProductSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    RestaurantId: {type: Schema.Types.ObjectId},
    ItemName: String,
    ItemDetail: String,
    Price: Number,
    Detail:String,
    ItemImage: String,
    Availability: [],
    Category: [],
    Tax: [],
    Veg_NonVeg: String,
    IsActive: Boolean,
    CreatedBy:{type: Schema.Types.ObjectId},
    CreatedOn:{type: Date, default: Date.now},
    ModifiedBy:String,
    ModifiedOn:{type: Date, default: Date.now}
}, {collection: 'Restaurant Food Items'})

module.exports = mongoose.model('Restaurant Food Items', ProductSchema)
