const RestaurantUsers = require('../../../models/RestaurantUsers')
const crypto = require('crypto')
var multer = require('multer')
const config = require('../../../../config')
var path = require('path')
const Roles = require('../../../models/Roles')

exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search


    var query = ''

    query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {FirstName: {$regex: name, $options: 'i'}} , {LastName: {$regex: name, $options: 'i'}} , {UserName: {$regex: name, $options: 'i'}},{Contact:{$regex: name, $options: 'i'}}   ]}]}
   // query = name.trim() === 'no' ? {RestaurantId: RestaurantIds} : { $and: [{RestaurantId: RestaurantIds}, {FirstName: {$regex: name, $options: 'i'}}, {LastName: {$regex: name, $options: 'i'}}, {UserName: {$regex: name, $options: 'i'}}]}
 
   

    

    
    console.log(query)
    RestaurantUsers.count({RestaurantId: RestaurantIds}).then((count) => {
        // if (count > 0) {
        RestaurantUsers.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, restaurantUsers) {
            if (err) {
                return res.status(700).json({
                    success: false,
                    err: err,
                    message: 'err h'
                })
            } else {
                console.log(restaurantUsers)
                return res.status(200).json({
                    success: true,
                    message: 'RestaurantUsers',
                    Data: restaurantUsers,
                    Count: count
                })
            }
        })
    })
}

var Storage = multer.diskStorage({

    destination: function (req, file, callback) {
        console.log(req.body.path)
        callback(null, path.join(__dirname, '../../../../client/src/upload/RestaurantUsers/thumbnail1'))
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

exports.addRestaurantUsers = (req, res) => {
    // var RestaurantId = require('mongoose').Types.ObjectId;

    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(req.body.formData.Password)
        .digest('base64')
    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        RestaurantId: require('mongoose').Types.ObjectId(req.body.formData.RestaurantId),
        FirstName: req.body.formData.FirstName,
        LastName: req.body.formData.LastName,
        UserName: req.body.formData.UserName,
        RoleId: req.body.formData.RoleId,
        Password: encrypted,
        Address: req.body.formData.Address,
        Contact: req.body.formData.Contact,
        Image: req.body.formData.Image,

        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: '',
        ModifiedOn: ''
    }
    return RestaurantUsers.findOne({$and: [{ RestaurantId: data.RestaurantId, UserName: data.UserName }]}, (err, restaurantUsers) => {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        }
        if (!restaurantUsers) {
            const newRestaurantUsers = new RestaurantUsers(data)
            return newRestaurantUsers.save((err, nuser) => {
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
                        message: 'New Restaurant User added successfully',
                        item: nuser
                    })
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                message: 'Restaurant User already exists',
                Data: restaurantUsers
            })
        }
    })
}

exports.deleteRestaurantUsers = (req, res) => {
    console.log(req.params)
    var ObjectId = require('mongoose').Types.ObjectId
    return RestaurantUsers.deleteOne({ _id: new ObjectId(req.params._id), RestaurantId: req.params.RestaurantId }, (err) => {
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
    return RestaurantUsers.findOne({ _id: req.params._id, RestaurantId: req.params.RestaurantId }, function (err, restaurantUsers) {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (restaurantUsers) {
            return Roles.find({ $and: [{ RestaurantId: req.params.RestaurantId, IsActive: true }]}, function (err, roles) {
                if (err) {
                    return res.status(700).json({
                        success: true,
                        err: err,
                        message: 'err h'
                    })
                } else if (roles) {
                    return res.status(200).json({
                        success: true,
                        Roles: roles,
                        RestaurantUsers : restaurantUsers
                    })
                }
            })
        }
    })
}


exports.updaterestaurantUser = (req, res) => {
    console.log(req.params)
 
    const data = {
        _id: req.params._id,
        RestaurantId: require('mongoose').Types.ObjectId(req.body.formData.RestaurantId),
        FirstName: req.body.formData.FirstName,
        LastName: req.body.formData.LastName,
        UserName: req.body.formData.UserName,
        RoleId: req.body.formData.RoleId,
        Address: req.body.formData.Address,
        Contact: req.body.formData.Contact,
        Image: req.body.formData.Image,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: '',
        ModifiedOn: ''
    }

    var query = {_id: req.params._id}
    return RestaurantUsers.findOne({$and: [{ UserName: req.body.formData.UserName ,  RestaurantId: req.params.RestaurantId }]}, function (err, restaurantuser) {
        console.log(err)
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (restaurantuser) {
            console.log(restaurantuser)
            var id = restaurantuser._id
            console.log(restaurantuser._id)
            console.log(data)
            if(id.equals(data._id))
            {
                return RestaurantUsers.findOneAndUpdate(query, data, function (err) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Restaurant User edited successfully',
                            RestaurantUser: restaurantuser
                        })
                    }
                })
            } 
            else
            {
                return res.status(200).json({
                    success: false,
                    Restaurant: restaurantuser,
                    message: 'User Name Name already exists'
                })
           
            }     
        }
        else
        {
            return RestaurantUsers.findOneAndUpdate(query, data,  function (err) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Restaurant User edited successfully',
                        RestaurantUser : restaurantuser
                    })
                }
            })
        }
     
    })
   
}

