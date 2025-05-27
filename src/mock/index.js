import Mock from 'mockjs';

Mock.mock('/api/login','post',(options) => {
    const {username,password} = JSON.parse(options.body);

    if(username === 'admin' && password === '123456') {
        return {
            code: 0,
            data:{
                token:'mock-token-123',
                userInfo:{
                    uuid:'u123456',
                    username:'admin',
                    role:'admin'
                }
            },
            msg:'登录成功'
        };
    } else {
        return {
            code:1,
            msg:'用户名或密码错误'
        }
    }
});

Mock.mock('/api/getMenuList','get',() => {
    return {
        code:0,
        data:[
            {
                path:'/about',
                label:'关于',
                icon:'InfoCircleOutlined',
                key:'2',
                component:'About'
            },
            {
                path:'/datapage',
                label:'测试数据页',
                icon:'FundOutlined',
                key:'3',
                component:'DataPage'
            },
            {
                path:"/admin",
                label:"管理员",
                icon:'VideoCameraOutlined',
                key:"4",
                component:"Admin"
            }
        ]
    }
})