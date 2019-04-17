const router = require('express').Router()
const controller = require('./restauranrusers.controller')

router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
// router.get('/listAll/:RestaurantId', controller.listAll)
 router.post('/add', controller.addRestaurantUsers)
 router.post('/uploaduserimage', controller.uploadImage)
 router.delete('/delete/:_id/:RestaurantId', controller.deleteRestaurantUsers)
 router.put('/update/:_id/:RestaurantId', controller.updaterestaurantUser)
 router.get('/list/:_id/:RestaurantId', controller.findOnebyId)

module.exports = router
