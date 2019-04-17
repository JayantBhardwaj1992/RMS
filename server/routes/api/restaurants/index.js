const router = require('express').Router()
const controller = require('./restaurant.controller')

router.get('/list/:pageSize/:currentPage/:orderBy/:orderAs/:search', controller.list)
//router.get('/search/:pageSize/:currentPage/:orderBy/:search', controller.search)
router.post('/add', controller.addRestaurant)
router.post('/uploadlogo', controller.uploadImage)
router.delete('/delete/:_id', controller.deleteRestaurant)
router.put('/update/:_id', controller.updateRestaurant)
router.get('/list/:_id', controller.findOnebyId)
router.put('/forgotpassword/:UserName', controller.forgotpassword)
router.put('/resetpassword/:UserName', controller.resetPassword)
module.exports = router
