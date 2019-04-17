const Roles = require('../../../models/Roles')

exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search

    var query = name.trim() === 'no' ? {RestaurantId: RestaurantIds} : { $and: [{RestaurantId: RestaurantIds}, {RoleName: {$regex: name, $options: 'i'}}]}
    Roles.count({RestaurantId: RestaurantIds}).then((count) => {
        // if (count > 0) {
        Roles.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, roles) {
            if (err) {
                return res.status(700).json({
                    success: false,
                    err: err,
                    message: 'err h'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Roles',
                    Data: roles,
                    Count: count
                })
            }
        })
    })
}

exports.addRoles = (req, res) => {
    console.log('vinay')

    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        RestaurantId: req.body.formData.RestaurantId,
        RoleName: req.body.formData.RoleName,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }

    const newroles = new Roles(data)

    return Roles.findOne({ RoleName: req.body.formData.RoleName, RestaurantId: req.body.formData.RestaurantId }, function (err, roles) {
        if (err) {
            console.log(err)
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (roles) {
            return res.status(200).json({
                success: false,
                Roles: roles,
                message: 'Role already exists'
            })
        } else {
            return newroles.save((err) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        success: false,
                        err: err,
                        message: 'error occure'
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Role added successfully'
                    })
                }
            })
        }
    })
}

exports.deleteRoles = (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId
    return Roles.deleteOne({ _id: new ObjectId(req.params._id), RestaurantId: req.params.RestaurantId }, (err, roles) => {
        console.log(err)
        console.log('Rao')
        console.log(res)
        console.log('vinay')
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
    return Roles.findOne({ _id: req.params._id, RestaurantId: req.params.RestaurantId }, function (err, roles) {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (roles) {
            return res.status(200).json({
                success: true,
                Roles: roles

            })
        }
    })
}

exports.findAll = (req, res) => {
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
                Roles: roles

            })
        }
    })
}

exports.updateRoles = (req, res) => {
    const data = {
        _id: req.params._id,
        RestaurantId: req.body.formData.RestaurantId,
        RoleName: req.body.formData.RoleName,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }

    var query = {_id: req.params._id}
    return Roles.findOne({$and: [{ RoleName: req.body.formData.RoleName, RestaurantId: req.params.RestaurantId }]}, function (err, role) {
        console.log(err)
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (role) {
            console.log(role)
            var id = role._id
            console.log(role._id)
            console.log(data)
            if (id.equals(data._id)) {
                return Roles.findOneAndUpdate(query, data, function (err) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: ' Role Name edited successfully'
                        })
                    }
                })
            }            else {
                return res.status(200).json({
                    success: false,
                    Restaurant: role,
                    message: 'Role Name already exists'
                })
            }
        } else {
            return Roles.findOneAndUpdate(query, data, function (err) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Role Name edited successfully'
                    })
                }
            })
        }
    })
}
