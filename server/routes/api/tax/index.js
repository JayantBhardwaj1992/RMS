const router = require('express').Router()
const controller = require('./tax.controller')


router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
router.post('/add', controller.addTax)
router.delete('/delete/:_id/:RestaurantId', controller.deleteTax)
router.put('/update/:_id/:RestaurantId', controller.updateTax)
router.get('/list/:_id/:RestaurantId', controller.findOnebyId)

module.exports = router
