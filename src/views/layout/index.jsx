import { Button, Layout, Menu, theme,Dropdown,Avatar } from 'antd';
import React, { useState,useEffect } from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    UserOutlined,
  } from '@ant-design/icons';
import { useSelector } from 'react-redux';
//import HistoryTabs from './historyComponent/history';
import { logoutApi } from '@/api/user';
import logImg from '@/assets/react.svg';
import './layout.css'
import { generateAntdMenu } from '../../router/menuHelper';
import { useDispatch } from 'react-redux';

import RouterTabs from './routertabs/routerTabs';


const { Header, Sider, Content } = Layout;


export default function Main() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    
    const dispatch = useDispatch();
    const menuList = useSelector(state => state.menu.menuList);
    const activeKey = useSelector(state => state.tab.activeKey);
    const menuItems = generateAntdMenu(menuList);
    const [openKeys,setOpenKeys] = useState([]);
    
    const findOpenKeys = (menuList,currentPath) => {
      let openKeys = [];

      const traverse = (items,parentPath) => {
        for(let item of items) {
          if(item.path === currentPath) {
            if(parentPath) openKeys.push(parentPath);
            return true;
          }
          if(item.children) {
            if(traverse(item.children,item.path)) {
              if(parentPath) openKeys.push(parentPath);
              else openKeys.push(item.path);
              return true;
            }
          }
        }
        return false;
      };

      traverse(menuList,null);
      return openKeys;
    }

    useEffect(() => {
      const keys = findOpenKeys(menuList,activeKey);
      setOpenKeys(keys);
    },[activeKey,menuList]);

    const flatMenuList = (menus) => {
      return menus.reduce((acc,item) => {
        if(item.children) {
          return acc.concat(item,...flatMenuList(item.children));
        }
        return acc.concat(item);
      },[]);
    }

    const onMenuClick = (key) => {
      const allMenuItems = flatMenuList(menuList);
      const clickedMenu = allMenuItems.find(item => item.path === key.key);
      if (clickedMenu) {
        dispatch({ type: 'tab/add', payload: { key: clickedMenu.path, label: clickedMenu.label, path: clickedMenu.path } });
        dispatch({ type: 'tab/setActive', payload: clickedMenu.path });
        navigate(clickedMenu.path);
      }
    }


    const handleLogout = () => {
      logoutApi();
      navigate('/login');
    };

    const menu = (
      <Menu>
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          退出登录
        </Menu.Item>
      </Menu>
    );

    

    return (
        <Layout style={{minHeight:'100vh',width:'100%'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <div className="demo-logo-vertical">
                <img src={logImg} alt="" />
                {!collapsed ? <span className={`title ${collapsed ? 'collapsed' : 'expanded'}`}>一些数管理平台</span>:null}
              </div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                selectedKeys={[activeKey]}
                items={menuItems}
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                onClick={({key}) => onMenuClick({key})}
              />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} className="header">
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: '16px',
                      width: 64,
                      height: 64,
                    }}
                  />

                  <div className="user-menu">
                    <Dropdown overlay={menu}>
                      <span style={{ cursor: 'pointer', color: '#fff' }}>
                        <Avatar icon={<UserOutlined />}/>用户
                      </span>
                    </Dropdown>
                  </div>
                  
                </Header>
                <RouterTabs />
                <Content
                  style={{
                    margin: '10px 16px 24px 16px',
                    padding: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <Outlet />    
                </Content>
            </Layout>
        </Layout>
    )
}