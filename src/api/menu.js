import request from '@/utils/request';

export const getMenuList = () => request.get('/api/getMenuList');