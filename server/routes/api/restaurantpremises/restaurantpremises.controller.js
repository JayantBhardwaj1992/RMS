const RestaurantPremises = require('../../../models/RestaurantPremises')
const mongoose = require('mongoose')
exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search
    console.log(parseInt(req.params.search))
    var query = ''
    if (isNaN(name))     {
        query = name.trim() === 'no' ? {RestaurantId: RestaurantIds} : { $and: [{RestaurantId: RestaurantIds}, { $or: [ {RestaurantPremisesName: {$regex: name, $options: 'i'}}]}]}
    }     else     {
        query = name.trim() === 'no' ? {RestaurantId: RestaurantIds} : { $and: [{RestaurantId: RestaurantIds}, { $or: [ {RestaurantPremisesName: {$regex: name, $options: 'i'}}, {Floor: parseInt(name) }, {Tables: parseInt(name) }, {Capacity: parseInt(name) }]}]}
    }

    RestaurantPremises.count({RestaurantId: RestaurantIds}).then((count) => {
        // if (count > 0) {
        RestaurantPremises.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, taxs) {
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
                    message: 'RestaurantPremises',
                    Data: taxs,
                    Count: count
                })
            }
        })
    })
}

exports.addRestaurantPremises = (req, res) => {
    // var RestaurantId = require('mongoose').Types.ObjectId;

    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        PremisiveTypeId: mongoose.Types.ObjectId(req.body.formData.PremisiveTypeId),
        RestaurantId: req.body.formData.RestaurantId,
        RestaurantPremisesName: req.body.formData.RestaurantPremisesName,
        Floor: req.body.formData.Floor,
        Capacity: req.body.formData.Capacity,
        Tables: req.body.formData.Tables,
        TableDetails: req.body.formData.TableDetails,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }
    console.log(req.body.formData.PremisiveTypeId)
    console.log(data)

    const newRestaurantPremises = new RestaurantPremises(data)

    return RestaurantPremises.findOne({$and: [{ RestaurantId: data.RestaurantId, RestaurantPremisesName: data.RestaurantPremisesName }]}, (err, RestaurantPremisess) => {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        }
        if (!RestaurantPremisess) {
            return newRestaurantPremises.save((err) => {
                console.log(err)
                if (err) {
                    return res.status(700).json({
                        success: true,
                        err: err,
                        message: 'err h'
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'New Restaurant Premises added successfully'
                    })
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                message: 'Premises Name already exists',
                Data: newRestaurantPremises
            })
        }
    })
}


exports.deleteRestaurantPremises = (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId
    return RestaurantPremises.deleteOne({ _id: new ObjectId(req.params._id), RestaurantId: req.params.RestaurantId }, (err) => {
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

exports.getRestaurantPremises = (req, res) => {
    return RestaurantPremises.findOne({ _id: req.params._id, RestaurantId: req.params.RestaurantId }, (err, RestaurantPremisess) => {
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
                Data: RestaurantPremisess
            })
        }
    })
}



exports.editRestaurantPremises = (req, res) => {
    // var RestaurantId = require('mongoose').Types.ObjectId;
    var datetime = new Date()
    console.log(req.body.formData)
    const data = {
      _id: req.params._id,
      PremisiveTypeId: mongoose.Types.ObjectId(req.body.formData.PremisiveTypeId),
      RestaurantId: req.body.formData.RestaurantId,
      RestaurantPremisesName: req.body.formData.RestaurantPremisesName,
      Floor: req.body.formData.Floor,
      Capacity: req.body.formData.Capacity,
      Tables: req.body.formData.Tables,
      TableDetails: req.body.formData.TableDetails,
      IsActive: req.body.formData.IsActive,
      CreatedBy: req.body.formData.CreatedBy,
      CreatedOn: req.body.formData.CreatedOn,
      ModifiedBy: req.body.formData.CreatedBy,
      ModifiedOn: datetime
    }
  
    var query = {_id: data._id, RestaurantId: req.body.formData.RestaurantId}
    return RestaurantPremises.findOne({ $and: [ {RestaurantId: data.RestaurantId, RestaurantPremisesName: data.RestaurantPremisesName }]}, (err, RestaurantPremisess) => {
      if (err) {
        return res.status(700).json({
          success: true,
          err: err,
          message: 'err h'
        })
      } else if (RestaurantPremisess) {
  
        var id = RestaurantPremisess._id
       
        console.log(id)
        console.log(req.params._id)
        console.log(id.equals(data._id))
        if (id.equals(data._id)) {
   
          return RestaurantPremises.findOneAndUpdate(query, data, { upsert: true }, (err, RestaurantPremisesss) => {
            if (err) {
              return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
              })
            } else {
              return res.status(200).json({
                success: true,
                message: 'updated successfully',
                Data: RestaurantPremisesss
              })
            }
          })
        } else {
          return res.status(200).json({
            success: false,
            message: 'Premises Name alreday exists',
            Data: RestaurantPremises
          })
        }
      } else {
        return RestaurantPremises.findOneAndUpdate(query, data, { upsert: true }, (err, RestaurantPremisess) => {
          if (err) {
            return res.status(700).json({
              success: true,
              err: err,
              message: 'err h'
            })
          } else {
            return res.status(200).json({
              success: true,
              message: 'updated successfully',
              Data: RestaurantPremisess
            })
          }
        })
      }
    })
  }