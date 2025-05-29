const initialState = {
    tabs: [
        {key:'/',label:'仪表盘',path:'/',closable:false}
    ],
    activeKey:'/'
};

export default function tabReducer(state = initialState, action) {
    switch(action.type) {
        case 'tab/add':
            if(state.tabs.find(tab => tab.key === action.payload.key)) {
                return {...state,activeKey:action.payload.key}; // 如果已存在，则激活
            }
            return {
                ...state,
                tabs: [...state.tabs, action.payload],
                activeKey: action.payload.key // 设置新标签为激活状态
            };
        case 'tab/setActive':
            return {
                ...state,
                activeKey: action.payload // 设置激活的标签
            };
        case 'tab/remove':
            {
                const newTabs = state.tabs.filter(tab => tab.key !== action.payload);
                const nextActive = state.activeKey === action.payload 
                ? newTabs[newTabs.length - 1]?.key || '/' 
                : state.activeKey;

                // 如果关闭后没有标签页，补上默认仪表盘
                if(newTabs.length === 0) {
                    return {
                        tabs:[{key:'/',label:'仪表盘',path:'/'}],
                        activeKey:'/',
                    };
                }

                return {...state,tabs: newTabs,activeKey: nextActive};
            }
        case 'tab/closeOthers':
            return {
                tabs:state.tabs.filter(tab => tab.key === action.payload || tab.key === '/'),
                activeKey:action.payload,
            };
        case 'tab/closeAll':{
            return {
                tabs:[{key:'/', label:'仪表盘',path:'/'}],
                activeKey:'/',
            };
        }
        default:
            return state;
    }
}