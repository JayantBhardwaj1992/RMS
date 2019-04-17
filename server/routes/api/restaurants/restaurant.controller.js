const Restaurant = require('../../../models/Restaurant')
const sendmail = require('../../../sendmail.js')
var generator = require('generate-password')
const crypto = require('crypto')
const config = require('../../../../config')
const User = require('../../../models/SuperAdmin')

var multer = require('multer')
var path = require('path')
/*
    GET /api/user/list
*/


var Storage = multer.diskStorage({

    destination: function (req, file, callback) {
        console.log(req.body.path)
        callback(null, path.join(__dirname, '../../../../client/src/upload/logo'))
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})
var upload = multer({
    storage: Storage
}).array('image', 3) // Field name and max count


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
            message: 'file uploaded successfully',
          
        })
    })
}



exports.list = (req, res) => {
    console.log(req.params)
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search

    var query = name.trim() === 'no' ? {} : { $or: [{ContactPersonName: {$regex: name, $options: 'i'}}, {RestaurantName: {$regex: name, $options: 'i'}}, {ContactPersonEmail: {$regex: name, $options: 'i'} }]}
    Restaurant.count().then((count) => {
        // if (count > 0) {
        Restaurant.find(query, { RestaurantLogo: 0 }).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, restaurant) {
            if (err) {
                return res.status(700).json({
                    success: false,
                    err: err,
                    message: 'err h'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'restaurants',
                    Data: restaurant,
                    Count: count
                })
            }
        })
        // }
        // else
        // {
        //     return res.status(200).json({
        //         success: true,
        //         message: 'No record found',
        //     })
        // }
    })
    // console.log(count)
}

exports.search = (req, res) => {
    console.log(req.params)
    var name = req.params.text

    var query = name.trim() === 'all' ? {} : { $or: [{ContactPersonName: {$regex: name, $options: 'i'}}, {RestaurantName: {$regex: name, $options: 'i'}}, {ContactPersonEmail: {$regex: name, $options: 'i'} }]}
    // return Restaurant.find( { $or: [ { RestaurantName: new RegExp('^'+name+'$', "i")  }, { ContactPersonName:  new RegExp('^'+name+'$', "i")  }, { ContactPersonEmail: new RegExp('^'+name+'$', "i")  }, { IsActive: new RegExp('^'+name+'$', "i")  } ] }  ,{ RestaurantLogo: 0 }, (err, restaurant) => {
    return Restaurant.find(query, { RestaurantLogo: 0 }, (err, restaurant) => {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else {
            return res.status(200).json({
                success: true,
                message: 'restaurants',
                Data: restaurant
            })
        }
    })
}

exports.addRestaurant = (req, res) => {
    console.log(req.body.formData.ContactPersonEmail)
    // var RestaurantId = require('mongoose').Types.ObjectId;

    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(req.body.formData.Password)
        .digest('base64')
    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        RestaurantName: req.body.formData.RestaurantName,
        RestaurantLogo: req.body.formData.RestaurantLogo,
        RestaurantCode: req.body.formData.RestaurantCode,
        ContactPersonName: req.body.formData.ContactPersonName,
        ContactPersonEmail: req.body.formData.ContactPersonEmail,
        Password: encrypted,
        Address: req.body.formData.Address,
        AboutRestaurant: req.body.formData.AboutRestaurant,
        IsActive: req.body.formData.IsActive,
        CreatedBy: new require('mongoose').Types.ObjectId(),
        ModifiedBy: ''
    }
   
    const newRestaurant = new Restaurant(data)

    return Restaurant.findOne({ RestaurantName: req.body.formData.RestaurantName }, function (err, restaurant) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (restaurant) {
            return res.status(200).json({
                success: false,
                Restaurant: restaurant,
                message: 'Restaurant Name already exists'
            })
        } else {
            return newRestaurant.save((err, irestaurant) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        success: false,
                        err: err,
                        message: 'err h'
                    })
                } else {
                    var body = 'UserName :' + req.body.formData.ContactPersonEmail + '<br/> ' +
                               'Password :' + req.body.formData.Password + '<br/> ' +
                               'url :' + 'http://111.93.41.194:7071/login/' + irestaurant.RestaurantCode
                    sendmail(req.body.formData.ContactPersonEmail, req.body.formData.ContactPersonName, body)
                    return res.status(200).json({
                        success: true,
                        message: 'Restaurant added successfully',
                        restaurant : irestaurant
                    })
                }
            })
        }
    })
}

exports.deleteRestaurant = (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId
    return Restaurant.deleteOne({ _id: new ObjectId(req.params._id) }, (err) => {
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
    return Restaurant.findOne({ _id: req.params._id }, function (err, restaurant) {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (restaurant) {
            return res.status(200).json({
                success: true,
                Restaurant: restaurant

            })
        }
    })
}

exports.updateRestaurant = (req, res) => {
    const data = {
        _id: req.params._id,
        RestaurantName: req.body.formData.RestaurantName,
        RestaurantLogo: req.body.formData.RestaurantLogo,
        AboutRestaurant: req.body.formData.AboutRestaurant,
        ContactPersonName: req.body.formData.ContactPersonName,
        ContactPersonEmail: req.body.formData.ContactPersonEmail,
        Address: req.body.formData.Address,
        IsActive: req.body.formData.IsActive,
        CreatedBy: 'jayant',
        ModifiedBy: ''
    }
    console.log(data)
    var query = {_id: req.params._id}

    return Restaurant.findOne({ _id: req.params._id }, function (err, restaurant) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (restaurant) {
            var id = restaurant._id
            console.log(restaurant._id)
            console.log(data._id)
            if (id.equals(data._id)) {
                return Restaurant.findOneAndUpdate(query, data, function (err, irestaurant) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err,
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Restaurant edited successfully',
                            restaurant: irestaurant
                        })
                    }
                })
            } else {
                return res.status(200).json({
                    success: false,
                    Restaurant: restaurant,
                    message: 'Restaurant Name already exists'
                })
            }
        } else {
            return Restaurant.findOneAndUpdate(query, data, function (err) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Restaurant edited successfully',
                        restaurant:irestaurant
                    })
                }
            })
        }
    })
}

exports.forgotpassword = (req, res) => {
    console.log(req.params.UserName)
    return User.findOne({ UserName: req.params.UserName }, function (err, user) {
        console.log(err)
        console.log(user)
        if (err) {
            console.log(err)
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (user) {
            console.log(3)
            var password = generator.generate({
                length: 8,
                numbers: true
            })
            var body = 'Your temporary password is ' + password + '<br/> ' +
                       'Please reset your password.<br/> ' +
                       'url :' + '192.168.7.71/login'
            console.log(1)
            const encrypted = crypto.createHmac('sha1', config.secret)
                .update(password)
                .digest('base64')
            var query = {UserName: req.params.UserName }
            const data = {
                UserName: req.params.UserName,
                Password: encrypted,
                IsFirstLogin: true
            }
            console.log(data)
            return User.findOneAndUpdate(query, data, function (err) {
                if (err) {
                    return res.status(800).json({
                        success: false,
                        err: err
                    })
                } else {
                    console.log(2)
                    sendmail(req.params.UserName, '', body)
                    return res.status(200).json({
                        success: true,
                        message: 'Reset Password mail sent successfully'
                    })
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                message: 'Email does not exists!'
            })
        }
    })
}

exports.resetPassword = (req, res) => {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(req.body.formData.Password)
        .digest('base64')
    const data = {
        UserName: req.params.UserName,
        Password: encrypted,
        IsFirstLogin: false
    }
    var query = {UserName: req.params.UserName}
    return User.findOneAndUpdate(query, data, function (err) {
        if (err) {
            return res.status(800).json({
                success: false,
                err: err
            })
        } else {
            return res.status(200).json({
                success: true,
                message: 'New Password added successfully'
            })
        }
    })
}
