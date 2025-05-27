const initialState = {
    token:sessionStorage.getItem('token') || '',
    userInfo:JSON.parse(sessionStorage.getItem('userInfo')) || {}
}

export default function user(state = initialState,action) {
    switch(action.type) {
        case 'user/setToken':
            return {...state,token:action.playload};
        case 'user/setUserInfo':
            return {...state,userInfo:action.playload};
        case 'user/LoginOut':
            return initialState;
        default:
            return state;
    }
}