const router = require('express').Router()
const controller = require('./items.controller')

router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
router.post('/add', controller.addItems)
router.delete('/delete/:_id/:RestaurantId', controller.deleteItems)
router.put('/update/:_id/:RestaurantId', controller.updateItems)
router.get('/list/:_id/:RestaurantId', controller.findOnebyId)
router.post('/uploaditemimage', controller.uploadImage)
router.get('/categorywithtax/:RestaurantId', controller.findCategoryWithTax)

module.exports = router
