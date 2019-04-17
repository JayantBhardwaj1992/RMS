const router = require('express').Router()
const controller = require('./Roles.controller')

router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
router.post('/add', controller.addRoles)
router.delete('/delete/:_id/:RestaurantId', controller.deleteRoles)
router.put('/update/:_id/:RestaurantId', controller.updateRoles)
router.get('/list/:_id/:RestaurantId', controller.findOnebyId)

router.get('/list/:RestaurantId', controller.findAll)

module.exports = router
