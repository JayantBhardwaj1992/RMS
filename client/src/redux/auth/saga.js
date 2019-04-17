
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { auth } from '../../firebase'
import axios from 'axios'
import {
    LOGIN_USER,

    REGISTER_USER,
    LOGOUT_USER
} from 'Constants/actionTypes'

import {
    loginUserSuccess,
    registerUserSuccess
} from './actions'

const loginWithEmailPasswordAsync = async (email, password) =>

      await axios.post('api/auth/login', {
        UserName: email,
        Password: password
      })
        .then(authUser => authUser)
        .catch(error => error)

const loginResWithEmailPasswordAsync = async (email, password) =>
        // await auth.signInWithEmailAndPassword(email, password)
             // .then(authUser => authUser)
             // .catch(error => error)

           await axios.post('/api/auth/restaurantlogin', {
             ContactPersonEmail: email,
             Password: password
           })
             .then(authUser => authUser)
             .catch(error => error)

function * loginWithEmailPassword ({ payload }) {
  const { email, password, isRestaurant } = payload.user

  const { history } = payload
  try {
    var loginUser = ''
    if (isRestaurant) {
        loginUser = yield call(loginResWithEmailPasswordAsync, email, password)
 
        console.log(loginUser)
        if (loginUser.data.isLogin) {
          localStorage.setItem('user', JSON.stringify(loginUser.data))
          localStorage.setItem('user_id', loginUser.data.token)
          yield put(loginUserSuccess(loginUser.data))
          history.push('/app/category')
        } else {
            // catch throw
            yield put(loginUserSuccess(loginUser.data))
          console.log('login failed :', loginUser.data.message)
        }
      } else {
        loginUser = yield call(loginWithEmailPasswordAsync, email, password)

        if (loginUser.data.isLogin) {
          if (loginUser.data.IsFirstLogin) {
           // localStorage.setItem('user_id', loginUser.data.token)
             yield put(loginUserSuccess(loginUser))
             history.push('/reset-password')
            // history.push('/reset-password')
           } else {
             localStorage.setItem('user', JSON.stringify(loginUser.data))
             localStorage.setItem('user_id', loginUser.data.token)
             yield put(loginUserSuccess(loginUser.data))
             history.push('/app/restaurants')
           }
        } else {
            // catch throw
 

          yield put(loginUserSuccess(loginUser.data))
          console.log('login failed :', loginUser.data.message)
        }
      }
  } catch (error) {
        // catch throw
        // loginUser = {isLogin: 'failed' }
    yield put(loginUserSuccess(loginUser.data))
    console.log('login error : ', error)
  }
}

const registerWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error)

function * registerWithEmailPassword ({ payload }) {
  const { email, password } = payload.user
  const { history } = payload
  try {
    const registerUser = yield call(registerWithEmailPasswordAsync, email, password)
    if (!registerUser.message) {
      localStorage.setItem('user_id', registerUser.user.uid)
      yield put(registerUserSuccess(registerUser))
      history.push('/')
    } else {
            // catch throw
      console.log('register failed :', registerUser.message)
    }
  } catch (error) {
        // catch throw
    console.log('register error : ', error)
  }
}

const logoutAsync = async (history) => {
  await auth.signOut().then(authUser => authUser).catch(error => error)
}

function * logout ({payload}) {
  const { history } = payload
  try {
    var user = JSON.parse(localStorage.getItem('user'))
    if (user != undefined) {
      if (user.Role == 'SuperAdmin') {
        yield call(logoutAsync, history)
        localStorage.removeItem('user')
        history.push('/login')
      } else if (user.Role == 'RAdmin') {
        yield call(logoutAsync, history)
        localStorage.removeItem('user_id')
        localStorage.removeItem('user')
        history.push('/login/' + user.RestaurantDetail.Code)
      }
    }
  } catch (error) {
  }
}

export function * watchRegisterUser () {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword)
}

export function * watchLoginUser () {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword)
}

export function * watchLogoutUser () {
  yield takeEvery(LOGOUT_USER, logout)
}

export default function * rootSaga () {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser)
  ])
}
