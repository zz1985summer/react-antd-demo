import axios from 'axios';
import { message } from 'antd';
import { store } from '../store';
import bus from '@/utils/eventBus';


const service = axios.create({
    baseURL:import.meta.env.REACT_APP_BASE_API,
    timeout:120000,
});

let activeAxios = 0;
let timer;

const showLoading = () => {
    activeAxios++;
    if(timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(()=>{
        if(activeAxios > 0) {
            bus.emit('showLoading');
        }
    },400);
};

const closeLoading = () => {
    activeAxios--;
    if(activeAxios <= 0) {
        clearTimeout(timer);
        bus.emit('closeLoading');
    }
};

//请求拦截
service.interceptors.request.use(
    (config) => {
        if(!config.donNotShowLoading) {
            showLoading();
        }
        const token = store.getState().user.token;
        const user = store.getState().user.userInfo;

        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type':'application/json',
            'x-token':token,
            'x-user-id':user.uuid,
        };

        return config;
    },
    (error) => {
        closeLoading();
        message.error(error.message);
        return Promise.reject(error);
    }
);

//响应拦截
service.interceptors.response.use(
    (response) => {
        closeLoading();

        if(response.headers['new-token']) {
            store.dispatch({
                type:'user/setToken',
                playload:response.headers['new-token'],
            });
        }

        if(response.data.code === 0 || response.headers.success === 'true' ) {
            return response.data;
        } else if(response.data.code === 9) {
            if(response.data.msg || response.headers.msg) {
                message.warning(response.data.msg || decodeURI(response.headers.msg));
            } 
            return response.data;
        } else {
            message.error(response.data.msg || decodeURI(response.headers.msg));
            if(response.data.data && response.data.data.reload) {
                //登出逻辑，清除用户信息
                store.dispatch({
                    type:'user/LoginOut',
                });
            }
            return response.data.msg ? response.data : response;
        }
    },
    (error) => {
        closeLoading();
        message.error(error.message);
        return Promise.reject(error);
    }
);

export default service;

