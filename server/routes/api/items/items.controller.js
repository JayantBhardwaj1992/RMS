const Items = require('../../../models/Items')
const mongoose = require('mongoose')
var path = require('path')
var multer = require('multer')
const Category = require('../../../models/Category')
const Tax = require('../../../models/Tax')
var multer = require('multer')
var path = require('path')

var Storage = multer.diskStorage({

    destination: function (req, file, callback) {
        console.log(req.body.path)
        callback(null, path.join(__dirname, '../../../../client/src/upload/items/thumbnail1'))
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})
var upload = multer({
    storage: Storage
}).array('image', 3) // Field name and max count
// Retrieve and return all notes from the database.

exports.uploadImage = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'file uploaded successfully'

        })
    })
}

exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search

    var query = ''

    // if(isNaN(name))
    // {
    //     query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {ItemName: {$regex: name, $options: 'i'}}, {Veg_NonVeg: {$regex: name, $options: 'i'}}]]}
    // }
    // else
    // {
    //    query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {ItemName: {$regex: name, $options: 'i'}}, {Veg_NonVeg: {$regex: name, $options: 'i'}} , {Price: parseInt(name)}]}]}
    // }

    if(isNaN(name))
    {
        query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {ItemName: {$regex: name, $options: 'i'}}, { Veg_NonVeg :{$regex: name, $options: 'i'}}  ]}]}
    }
    else
    {
       query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {ItemName: {$regex: name, $options: 'i'}}, {Veg_NonVeg :{$regex: name, $options: 'i'}},   {Price: parseInt(name) }]}]}
    }





    Items.count({RestaurantId: RestaurantIds}).then((count) => {
        // if (count > 0) {
        Items.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, items) {
            if (err) {
                console.log(err)
                return res.status(700).json({
                    success: false,
                    err: err,
                    message: 'err h'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Items',
                    Data: items,
                    Count: count
                })
            }
        })
    })
}

exports.addItems = (req, res) => {
    // var RestaurantId = require('mongoose').Types.ObjectId;
    console.log(req.body.formData)

    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        RestaurantId: mongoose.Types.ObjectId(req.body.formData.RestaurantId),
        ItemName: req.body.formData.ItemName,
        Availability: req.body.formData.Availability,
        Category: req.body.formData.Category,
        Tax: req.body.formData.Tax,
        Price: req.body.formData.Price,
        ItemImage: req.body.formData.ItemImage,
        Veg_NonVeg: req.body.formData.Veg_NonVeg,
        ItemDetail: req.body.formData.ItemDetail,
        Address: req.body.formData.Address,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: '',
        ModifiedOn: ''
    }
    return Items.findOne({$and: [{ RestaurantId: data.RestaurantId, ItemName: data.ItemName }]}, (err, items) => {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        }
        if (!items) {
            const newItems = new Items(data)
            return newItems.save((err, nitem) => {
                if (err) {
                    console.log(err)
                    return res.status(700).json({
                        success: false,
                        err: err,
                        message: 'err h'
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'New Items added successfully',
                        item: nitem
                    })
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                message: 'Item already exists',
                Data: Items
            })
        }
    })
}





exports.updateItems = (req, res) => {

    const data = {
        _id:  req.params._id,
        RestaurantId: mongoose.Types.ObjectId(req.body.formData.RestaurantId),
        ItemName: req.body.formData.ItemName,
        Availability: req.body.formData.Availability,
        Category: req.body.formData.Category,
        Tax: req.body.formData.Tax,
        Price: req.body.formData.Price,
        ItemImage: req.body.formData.ItemImage,
        Veg_NonVeg: req.body.formData.Veg_NonVeg,
        ItemDetail: req.body.formData.ItemDetail,
        Address: req.body.formData.Address,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: '',
        ModifiedOn: ''
    }

    var query = {_id: req.params._id}
    return Items.findOne({$and: [{ ItemName: req.body.formData.CategoryName ,  RestaurantId: req.params.RestaurantId }]}, function (err, item) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (item) {
    
            var id = item._id
    
            if(id.equals(data._id))
            {
                return Items.findOneAndUpdate(query, data, function (err, item) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Item edited successfully',
                            item:item
                        })
                    }
                })
            } 
            else
            {
                return res.status(200).json({
                    success: false,
                    item: item,
                    message: 'Item Name already exists'
                })
           
            }     
        }
        else
        {
            return Items.findOneAndUpdate(query, data,  function (err, item) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Item edited successfully',
                        item: item
                    })
                }
            })
        }
     
    })
   
}








exports.deleteItems = (req, res) => {
    console.log(req.params)
    var ObjectId = require('mongoose').Types.ObjectId
    return Items.deleteOne({ _id: new ObjectId(req.params._id), RestaurantId: req.params.RestaurantId }, (err) => {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else {
            return res.status(200).json({
                success: true,
                message: 'deleted successfully'

            })
        }
    })
}

exports.findOnebyId = (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId
    return Items.findOne({ _id: new ObjectId(req.params._id), RestaurantId: req.params.RestaurantId }, (err, Item) => {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else {
            return res.status(200).json({
                success: true,
                message: 'nhi h',
                Data: Item
            })
        }
    })
}

exports.findCategoryWithTax = (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId
    return Category.find({ RestaurantId: req.params.RestaurantId }, (err, Categories) => {
        console.log()
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else {
            return Tax.find({ RestaurantId: req.params.RestaurantId }, (err, taxs) => {
                return res.status(200).json({
                    success: true,
                    message: 'nhi h',
                    Category: Categories,
                    Tax: taxs
                })
            })
        }
    })
}
