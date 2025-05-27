import {
    UserOutlined,
    VideoCameraOutlined,
    InfoCircleOutlined,
    FundOutlined,
} from '@ant-design/icons';
import React from 'react';
import Dashboard from '@/views/dashboard';
import Admin from '@/views/admin';
import About from '@/views/about';
import DataPage from '@/views/datapage';
import Main from '@/views/layout';

const iconMap = {
    UserOutlined: <UserOutlined />,
    VideoCameralined: <VideoCameraOutlined />,
    InfoCircleOutlined: <InfoCircleOutlined />,
    FundOutlined: <FundOutlined />,
};

const componentMap = {
    Dashboard,
    Admin,
    About,
    DataPage,
    Main,
};

export function generateAntdMenu(menuList) {
    return menuList.map((item) => ({
        key:item.path,
        icon:iconMap[item.icon] || <UserOutlined />,
        label:item.label
    }));
}

export function generateRoutes(menuList) {
    return [
        {
            path:'/',
            element:<componentMap.Main />, //外层Layout
            children:menuList.map((item) => ({
                path: item.path ==='/' ? "" : item.path.replace('/',''),
                element: React.createElement(componentMap[item.component]),
                key: item.key,
            })),
        },
    ];
}

export function generateDynamicChildren(menuList = []) {
    return menuList.map((menu) => ({
      path: menu.path.replace("/", ""),
      element: componentMap[menu.path],
      label: menu.label,
      icon: iconMap[menu.icon],
      key: menu.key
    }));
  }