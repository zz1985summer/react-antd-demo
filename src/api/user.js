import {store} from '@/store'
import request from '@/utils/request';
import { getMenuList } from '@/api/menu';
import { staticMenu } from '@/router/menuMap';


export function logoutApi() {
  store.dispatch({ type: 'user/LoginOut' });
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userInfo');
}

export async function loginApi(credentials) {
  const res = await request.post('/api/login',credentials);

  if(res.code === 0) {
    const {token,userInfo} = res.data;

    store.dispatch({type:'user/setToken',playload:token});
    store.dispatch({type:'user/setUserInfo',playload:userInfo});
    sessionStorage.setItem('token',token);
    sessionStorage.setItem('userInfo',JSON.stringify(userInfo));

    const menuRes = await getMenuList();
    if(menuRes.code === 0) {
      // 获取后端菜单后合并静态菜单
      const fullMenu = [...staticMenu,...menuRes.data];
      store.dispatch({type:'menu/setMenu',playload:fullMenu});
      sessionStorage.setItem('dynamicMenu',JSON.stringify(fullMenu));
    }
  }

  return res;
}


