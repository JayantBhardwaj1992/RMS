const router = require('express').Router()
const controller = require('./premisestype.controller')

router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search/:RestaurantId', controller.list)
router.get('/listAll/:RestaurantId', controller.listAll)
router.post('/add', controller.addPremisesTypes)
router.delete('/delete/:_id/:RestaurantId', controller.deletePremisesTypes)
router.put('/update/:_id/:RestaurantId', controller.updatePremisesTypes)
router.get('/list/:_id/:RestaurantId', controller.findOnebyId)

module.exports = router
