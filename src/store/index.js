import { configureStore } from '@reduxjs/toolkit'
import user from './user';
import menu from './menu';
import tab from './tab';

export const store = configureStore({
  reducer: {
    // 添加你的reducers here
    user,
    menu,
    tab
  }
});