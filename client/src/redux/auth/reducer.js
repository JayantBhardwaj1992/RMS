import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    LOGOUT_USER
} from 'Constants/actionTypes';

const INIT_STATE = {
    user: JSON.parse(localStorage.getItem('user')),
    loading: false
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true };
        case LOGIN_USER_SUCCESS:
     
            return { ...state, loading: false, user: action.payload };
        case LOGIN_USER_FAILED :
        return {... state, loading: false, user: action.payload}  
        case REGISTER_USER:
            return { ...state, loading: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload.uid };
        case LOGOUT_USER:
            return { ...state ,user:null};
        default: return { ...state };
    }
}
