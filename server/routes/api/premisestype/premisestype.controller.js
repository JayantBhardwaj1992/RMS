const PremisesType = require('../../../models/PremisesType')


exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds  = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search

    var query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, {PremisesType: {$regex: name, $options: 'i'}}]}
    PremisesType.count({RestaurantId : RestaurantIds}).then((count) => {
        // if (count > 0) {
        PremisesType.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, premisestypes) {
            if (err) {
                return res.status(700).json({
                    success: false,
                    err: err,
                    message: 'err h'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'premisestypes',
                    Data: premisestypes,
                    Count: count
                })
            }
        })
       
    })
   
}



exports.listAll = (req, res) => {
    console.log(req.params)
    const RestaurantIds  = req.params.RestaurantId
  
    var query =  {RestaurantId : RestaurantIds};

    // if (count > 0) {
    PremisesType.find(query).exec(function (err, premisestypes) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else {
            return res.status(200).json({
                success: true,
                message: 'premisestypes',
                Data: premisestypes,
                   
            })
        }
    })
       

   
}


exports.addPremisesTypes = (req, res) => {
    console.log(req.body)
    
    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        PremisesType: req.body.formData.PremisesType,
        RestaurantId: req.body.formData.RestaurantId,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }
    
    const newpremisestype = new PremisesType(data)


    return PremisesType.findOne({  PremisesType: req.body.formData.PremisesType , RestaurantId: req.body.formData.RestaurantId }, function (err, premisestype) {
        if (err) {
            console.log(err)
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (premisestype) {
            return res.status(200).json({
                success: false,
                Restaurant: premisestype,
                message: 'Premises Type already exists'
            })
        }
        else
        {
            return newpremisestype.save((err) => {
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
                        message: 'Premises Type added successfully'
                    })
                }
            })
        }
    })   
}


exports.deletePremisesTypes = (req, res) => {
    console.log(req.params)
    console.log("vinay")
    var ObjectId = require('mongoose').Types.ObjectId
    return PremisesType.deleteOne({ _id: new ObjectId(req.params._id) , RestaurantId: req.params.RestaurantId }, (err) => {
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
    console.log(req.params)
    return PremisesType.findOne({ _id: req.params._id , RestaurantId:req.params.RestaurantId }, function (err, premisestype) {
        if (err) {
            console.log(err)
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (premisestype) {
            return res.status(200).json({
                success: true,
                PremisesType: premisestype
  
            })
        }
    })
}
  

exports.updatePremisesTypes = (req, res) => {
    console.log(req.params)
 
    const data = {
        _id: req.params._id,
        PremisesType: req.body.formData.PremisesType,
        RestaurantId: req.body.formData.RestaurantId,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }

    var query = {_id: req.params._id}
    return PremisesType.findOne({$and: [{ PremisesType: req.body.formData.PremisesType ,  RestaurantId: req.params.RestaurantId }]}, function (err, premisestype) {
        console.log(err)
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (premisestype) {
            console.log(premisestype)
            var id = premisestype._id
            console.log(premisestype._id)
            console.log(data)
            if(id.equals(data._id))
            {
                return PremisesType.findOneAndUpdate(query, data, function (err) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Premises type edited successfully'
                        })
                    }
                })
            } 
            else
            {
                return res.status(200).json({
                    success: false,
                    Restaurant: premisestype,
                    message: 'Premises Type Name already exists'
                })
           
            }     
        }
        else
        {
            return PremisesType.findOneAndUpdate(query, data,  function (err) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Premises Type edited successfully'
                    })
                }
            })
        }
     
    })
   
}

