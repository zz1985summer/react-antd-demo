import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import DocumentTitle from "react-document-title";
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/api/user';

export default function Login(){
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await loginApi(values);
            if(res.code === 0) {
                message.success(res.msg || '登录成功');
                console.log("进入")
                navigate('/');
            } else {
                message.error(res.msg || '登录失败');
            }
        } catch (err) {
            message.error(err.msg || '请求失败');
        }
    };

    return (
        <DocumentTitle title={"用户登录"}>
            <div className="container">
                <div className="form_class">
                    <span className="login_text">用户登录</span>
                
                    <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
                        <Form.Item
                          name="username"
                          rules={[{ required: true, message: '请输入你的用户名!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="用户名" />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: '请输入你的密码!' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Log in
                            </Button>
                            <div className="register">
                            <span>还没有账户?</span>&nbsp;<a href="">注 册</a>
                            </div>
                            
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </DocumentTitle>
    );

    
    //function login() { 
    //    navigate("/");
    //}
}
