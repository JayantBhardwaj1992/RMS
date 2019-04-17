const router = require('express').Router()
const controller = require('./category.controller')

router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
router.post('/add', controller.addCategory)
router.delete('/delete/:_id/:RestaurantId', controller.deleteCategory)
router.put('/update/:_id/:RestaurantId', controller.updateCategory)
router.get('/list/:_id/:RestaurantId', controller.findOnebyId)




module.exports = router
