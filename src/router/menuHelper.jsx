import {
    UserOutlined,
    VideoCameraOutlined,
    InfoCircleOutlined,
    FundOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Dashboard from '@/views/dashboard';
import Admin from '@/views/admin';
import About from '@/views/about';
import DataPage from '@/views/datapage';
import Main from '@/views/layout';
import DailyReport from '@/views/reports/daily/dailyReport';
import MonthlyReport from '@/views/reports/monthly/monthlyReport';

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
    DailyReport,
    MonthlyReport,
};

export function generateAntdMenu(menuList = []) {
    return menuList.map((item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        return {
            key: item.path,
            icon: iconMap[item.icon] || <UserOutlined />,
            label: item.label,
            children: hasChildren ? generateAntdMenu(item.children) : undefined,
        };
        
    });
}

export function generateRoutes(menuList) {
    const buildRoutes = (list) => {
        return list.map((item) => {
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;

            return {
                path: item.path,
                element: componentMap[item.component] 
                ? React.createElement(componentMap[item.component]) : (hasChildren?<Outlet />:<div>未定义组件</div>),
                children: hasChildren ? buildRoutes(item.children) : undefined,
            };
        });
    };

    return [
        {
            path:'/',
            element: <Main />, // 外层Layout
            children: buildRoutes(menuList),
        },
        {
            path:'*',
            element: <div>404 Not Found</div>, // 404页面
        }
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