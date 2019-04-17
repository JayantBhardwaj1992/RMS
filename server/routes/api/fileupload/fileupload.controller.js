
var multer = require('multer')
var path = require('path')

var Storage = multer.diskStorage({

    destination: function (req, file, callback) {
        console.log(req.body.path)
        callback(null, path.join(__dirname, '../../../../client/src/upload/items/thumbnail1'))
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
})
var upload = multer({
    storage: Storage
}).array('image', 3) // Field name and max count

exports.uploadImage = (req, res) => {
 console.log(req.body)
    upload(req, res, function (err) {

        if (err) {
            return res.end('Something went wrong!')
        }
        return res.end('File uploaded sucessfully!.')
    })
}
