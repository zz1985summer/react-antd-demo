const initialState = {
    menuList: JSON.parse(sessionStorage.getItem('dynamicMenu') || '[]'),
};

export default function menuReducer(state = initialState,action) {
    switch(action.type) {
        case 'menu/setMenu':
            return {...state,menuList:action.playload};
        default:
            return state;
    }
}

