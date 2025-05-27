import { Button, Layout, Menu, theme,Dropdown,Avatar } from 'antd';
import React, { useState } from 'react';
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

const { Header, Sider, Content } = Layout;


export default function Main() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

    const menuList = useSelector(state => state.menu.menuList);
    const menuItems = generateAntdMenu(menuList);

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
                items={menuItems}
                onClick={({key}) => navigate(key)}
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
                
                <Content
                  style={{
                    margin: '24px 16px',
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