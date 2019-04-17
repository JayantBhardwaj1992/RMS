const router = require('express').Router()
const controller = require('./fileupload.controller')

router.post('/image', controller.uploadImage)

module.exports = router