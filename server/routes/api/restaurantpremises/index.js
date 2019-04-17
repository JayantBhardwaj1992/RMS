const router = require('express').Router()
const controller = require('./restaurantpremises.controller')


router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
 router.post('/add', controller.addRestaurantPremises)
 router.delete('/delete/:_id/:RestaurantId', controller.deleteRestaurantPremises)
 router.put('/update/:_id/:RestaurantId', controller.editRestaurantPremises)
 router.get('/list/:_id/:RestaurantId', controller.getRestaurantPremises)

module.exports = router
