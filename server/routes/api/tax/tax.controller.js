const Tax = require('../../../models/Tax')

exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds  = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search
    console.log(parseInt(req.params.search))
    var query = ""
     if(isNaN(name))
     {
         query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {TaxName: {$regex: name, $options: 'i'}}]}]}
     }
     else
     {
        query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, { $or: [ {TaxName: {$regex: name, $options: 'i'}}, {TaxPercentage: parseInt(name) }]}]}
     }

  
    Tax.count({RestaurantId : RestaurantIds}).then((count) => {
        // if (count > 0) {
            Tax.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, taxs) {
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
                    message: 'tax',
                    Data: taxs,
                    Count: count
                })
            }
        })
       
    })
   
}







exports.addTax = (req, res) => {

    // var RestaurantId = require('mongoose').Types.ObjectId;


    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        TaxName: req.body.formData.TaxName,
        TaxPercentage: req.body.formData.TaxPercentage,
        RestaurantId: req.body.formData.RestaurantId,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }
    
    const newTax = new Tax(data)


    return Tax.findOne({  TaxName: req.body.formData.TaxName , RestaurantId: req.body.formData.RestaurantId }, function (err, taxs) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (taxs) {
            return res.status(200).json({
                success: false,
                Restaurant: taxs,
                message: 'Tax Name already exists'
            })
        }
        else
        {
            return newTax.save((err) => {
                if (err) {
                 
                    return res.status(400).json({
                        success: false,
                        err: err,
                        message: 'err h'
                    })
                } else {
                  
                    return res.status(200).json({
                        success: true,
                        message: 'Tax added successfully'
                    })
                }
            })
        }
    })   
}


exports.deleteTax = (req, res) => {

    var ObjectId = require('mongoose').Types.ObjectId
    return Tax.deleteOne({ _id: new ObjectId(req.params._id) , RestaurantId: req.params.RestaurantId }, (err) => {
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
    return Tax.findOne({ _id: req.params._id , RestaurantId:req.params.RestaurantId }, function (err, taxs) {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (taxs) {
            return res.status(200).json({
                success: true,
                Tax: taxs
  
            })
        }
    })
}
  

exports.updateTax = (req, res) => {

    const data = {
        _id: req.params._id,
        TaxName: req.body.formData.TaxName,
        TaxPercentage: req.body.formData.TaxPercentage,
        RestaurantId: req.body.formData.RestaurantId,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }

    var query = {_id: req.params._id}
    return Tax.findOne({$and: [{ TaxName: req.body.formData.TaxName ,  RestaurantId: req.params.RestaurantId }]}, function (err, taxs) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (taxs) {
        
            var id = taxs._id
     
            if(id.equals(data._id))
            {
                return Tax.findOneAndUpdate(query, data, function (err) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Tax edited successfully'
                        })
                    }
                })
            } 
            else
            {
                return res.status(200).json({
                    success: false,
                    Restaurant: taxs,
                    message: 'Tax Name already exists'
                })
           
            }     
        }
        else
        {
            return Tax.findOneAndUpdate(query, data,  function (err) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Tax edited successfully'
                    })
                }
            })
        }
     
    })
   
}

