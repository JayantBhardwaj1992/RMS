const jwt = require('jsonwebtoken')
const User = require('../../../models/SuperAdmin')
const Restaurant = require('../../../models/Restaurant')
/*
    POST /api/auth/register
    {
        username,
        password
    }
*/

exports.register = (req, res) => {
    const { UserName, Password } = req.body
    let newUser = null

    // create a new user if does not exist
    const create = (user) => {
        if (user) {
            throw new Error('UserName exists')
        } else {
            return User.create(UserName, Password)
        }
    }

    // count the number of the user
    const count = (user) => {
        newUser = user
        return User.count({}).exec()
    }

    // respond to the client
    const respond = () => {
        res.json({
            message: 'registered successfully'
        })
    }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    // check username duplication
    User.findOneByUsername(UserName)
        .then(create)
        .then(count)
        .then(respond)
        .catch(onError)
}

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = (req, res) => {
    const {UserName, Password} = req.body
    const secret = req.app.get('jwt-secret')
    var IsFirstLogin = false
    var ContactPersonName = ''
    // check the user info & generate the jwt
    const check = (user) => {

        if (!user) {
            // user does not exist
            throw new Error('login failed')
        } else {
            ContactPersonName = user.ContactPersonName
            // user exists, check the password
            if (user.verify(Password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    IsFirstLogin = user.IsFirstLogin
                    jwt.sign(
                        {
                            _id: user._id,
                            UserName: user.UserName,
                            IsFirstLogin: user.IsFirstLogin
                        },
                        secret,
                        {
                            expiresIn: '5m',

                            subject: 'userInfo'
                        }, (err, token) => {
                         
                            if (err) reject(err)
                            resolve(token)
                        })
                })
                return p
            } else {
           
                throw new Error('login failed')
            }
        }
    }

    // respond the token
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token,
            isLogin: true,
            IsFirstLogin,
            UserName: UserName,
            Role: 'SuperAdmin',
            ContactPersonName: ContactPersonName
        })
    }

    // error occured
    const onError = (error) => {
        res.json({
            message: 'login failed',

            isLogin: false

        })
    }

    // find the user
    User.findOneByUsername(UserName)
        .then(check)
        .then(respond)
        .catch(onError)
}

/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}

// Restuarant Login
exports.restaurantlogin = (req, res) => {
    const {ContactPersonEmail, Password} = req.body
    const secret = req.app.get('jwt-secret')
    var RestaurantDetail = {}
    // check the user info & generate the jwt
    const check = (restaurant) => {
        if (!restaurant) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if (restaurant.verify(Password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
              

                    RestaurantDetail.RestaurantName = restaurant.RestaurantName,
                    RestaurantDetail.ContactPersonEmail = restaurant.ContactPersonEmail,
                    RestaurantDetail.ContactPersonName = restaurant.ContactPersonName,
                    RestaurantDetail.RestaurantLogo = restaurant.RestaurantLogo,
                    RestaurantDetail.ResId = restaurant._id,
                    RestaurantDetail.Code = restaurant.RestaurantCode
                    jwt.sign(
                        {
                            _id: restaurant._id,
                            RestaurantName: restaurant.RestaurantName,
                            ContactPersonEmail: restaurant.ContactPersonEmail,
                            ContactPersonName: restaurant.ContactPersonName,
                            RestaurantLogo: restaurant.RestaurantLogo
                        },
                        secret,
                        {
                            expiresIn: '5m',

                            subject: 'userInfo'
                        }, (err, token) => {
                     
                            if (err) reject(err)
                            resolve(token)
                        })
                })
                return p
            } else {
              
                throw new Error('login failed')
            }
        }
    }

    // respond the token
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token,
            isLogin: true,
            RestaurantDetail,
            Role: 'RAdmin'
        })
    }

    // error occured
    const onError = (error) => {
        res.json({
            message: error.message,
            isLogin: false

        })
    }

    // find the user
    Restaurant.findOneByContactPersonEmail(ContactPersonEmail)
        .then(check)
        .then(respond)
        .catch(onError)
}
