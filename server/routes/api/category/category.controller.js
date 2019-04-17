const Category = require('../../../models/Category')





exports.list = (req, res) => {
    console.log(req.params)
    const RestaurantIds  = req.params.RestaurantId
    var sortby = req.params.orderBy
    const sortAs = req.params.orderAs === 'desc' ? -1 : 1
    var name = req.params.search

    var query = name.trim() === 'no' ? {RestaurantId : RestaurantIds} : { $and: [{RestaurantId : RestaurantIds}, {CategoryName: {$regex: name, $options: 'i'}}]}
    Category.count({RestaurantId : RestaurantIds}).then((count) => {
        // if (count > 0) {
      Category.find(query).skip(parseInt(req.params.pageSize) * (parseInt(req.params.currentPage) - 1)).limit(parseInt(req.params.pageSize)).sort({[sortby]: sortAs}).limit(parseInt(req.params.pageSize)).exec(function (err, categories) {
            if (err) {
                return res.status(700).json({
                    success: false,
                    err: err,
                    message: 'err h'
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'categories',
                    Data: categories,
                    Count: count
                })
            }
        })
       
    })
   
}



exports.addCategory = (req, res) => {
 
    const data = {
        _id: new require('mongoose').Types.ObjectId(),
        CategoryName: req.body.formData.CategoryName,
        CategoryDetail: req.body.formData.CategoryDetail,
        RestaurantId: req.body.formData.RestaurantId,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }
    
    const newCategory = new Category(data)


    return Category.findOne({  CategoryName: req.body.formData.CategoryName , RestaurantId: req.body.formData.RestaurantId }, function (err, category) {
        if (err) {
       
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (category) {
            return res.status(200).json({
                success: false,
                Restaurant: category,
                message: 'Category Name already exists'
            })
        }
        else
        {
            return newCategory.save((err) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        success: false,
                        err: err,
                        message: 'err h'
                    })
                } else {
                  
                    return res.status(200).json({
                        success: true,
                        message: 'Category added successfully'
                    })
                }
            })
        }
    })   
}


exports.deleteCategory = (req, res) => {

    var ObjectId = require('mongoose').Types.ObjectId
    return Category.deleteOne({ _id: new ObjectId(req.params._id) , RestaurantId: req.params.RestaurantId }, (err) => {
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
    return Category.findOne({ _id: req.params._id , RestaurantId:req.params.RestaurantId }, function (err, category) {
        if (err) {
            return res.status(700).json({
                success: true,
                err: err,
                message: 'err h'
            })
        } else if (category) {
            return res.status(200).json({
                success: true,
                Category: category
  
            })
        }
    })
}
  

exports.updateCategory = (req, res) => {

    const data = {
        _id: req.params._id,
        CategoryName: req.body.formData.CategoryName,
        RestaurantId: req.body.formData.RestaurantId,
        IsActive: req.body.formData.IsActive,
        CreatedBy: req.body.formData.CreatedBy,
        CreatedOn: req.body.formData.CreatedOn,
        ModifiedBy: req.body.formData.CreatedBy,
        ModifiedOn: ''
    }

    var query = {_id: req.params._id}
    return Category.findOne({$and: [{ CategoryName: req.body.formData.CategoryName ,  RestaurantId: req.params.RestaurantId }]}, function (err, category) {
        if (err) {
            return res.status(700).json({
                success: false,
                err: err,
                message: 'err h'
            })
        } else if (category) {
    
            var id = category._id
    
            if(id.equals(data._id))
            {
                return Category.findOneAndUpdate(query, data, function (err) {
                    if (err) {
                        return res.status(800).json({
                            success: false,
                            err: err
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Category edited successfully'
                        })
                    }
                })
            } 
            else
            {
                return res.status(200).json({
                    success: false,
                    Restaurant: category,
                    message: 'Category Name already exists'
                })
           
            }     
        }
        else
        {
            return Category.findOneAndUpdate(query, data,  function (err) {
                if (err) {
                    return res.status(800).json({
                        success: true,
                        err: err
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Category edited successfully'
                    })
                }
            })
        }
     
    })
   
}

