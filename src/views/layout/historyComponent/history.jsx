import React, { useState,useEffect } from 'react';
import { Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './history.css';

const { TabPane } = Tabs;

const HistoryTabs = () =>{
    const [historys,setHistorys] = useState([]);
    const [activeValue, setActiveValue] = useState('');
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
    const [rightActive, setRightActive] = useState('');
    const [isCollapse] = useState(false);
    const [isMobile] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.user.userInfo);
    const defaultRouter = userInfo?.authority?.defaultRouter || '';

    useEffect(() => {
        const initHistorys = [
            {
                name:defaultRouter,
                meta: { title: "首页" },
                query:{},
                params:{},
                path:`/${defaultRouter}`
            }
        ];

        const savedHistorys = JSON.parse(sessionStorage.getItem("historys") || "[]");
        setHistorys(savedHistorys || initHistorys);

        if(!sessionStorage.getItem("aciveValue")) {
            const activeVal = `${location.pathname}${JSON.stringify(location.search)}${JSON.stringify(location.state || {})}`;
            setActiveValue(activeVal);
        } else {
            setActiveValue(sessionStorage.getItem("activeValue"));
        }

        setTab(location);

            // Event listeners for mobile/collapse (you'll need to implement your event bus equivalent)
            // window.eventBus.on('mobile', setIsMobile);
            // window.eventBus.on('collapse', setIsCollapse);
        return () => {
            // Cleanup event listeners
            // window.eventBus.off('mobile');
            // window.eventBus.off('collapse');
        };
    },[]);

    useEffect(() => {
        //Handle route changes
        setTab(location);
        sessionStorage.setItem("historys",JSON.stringify(historys));

        const activeVal = `${location.pathname}${JSON.stringify(location.search)}${JSON.stringify(location.state || {})}`;
        setActiveValue(activeVal);
        sessionStorage.setItem("activeValue",activeVal);

    },[location]);

    const isSame = (route1,route2) => {
        if(route1.path !== route2.pathname) return false;

        const query1 = route1.query || {};
        const searchParams = new URLSearchParams(route2.search);
        for(let key in query1) {
            if(query1[key] !== searchParams.get(key)) return false;
        }

        const params1 = route1.params || {};
        const params2 = route1.state || {};

        for (let key in params1) {
          if (params1[key] !== params2[key]) return false;
        }

        return true;
    };

    const setTab = (route) => {
        console.log(route);
        const routeObj = {
          name: route.pathname.split('/').pop() || defaultRouter,
          meta: { title: route.pathname === `/${defaultRouter}` ? "首页" : route.pathname },
          query: Object.fromEntries(new URLSearchParams(route.search)),
          params: route.state || {},
          path: route.pathname
        };
        
        if (!historys.some(item => isSame(item, route))) {
          setHistorys(prev => [...prev, routeObj]);
        }
    };

    const openContextMenu = (e) => {
        e.preventDefault();
        if (historys.length === 1 && location.pathname === `/${defaultRouter}`) {
          return;
        }
        
        if (e.target.id) {
          setContextMenuVisible(true);
          const width = isMobile ? 0 : (isCollapse ? 54 : 220);

          setMenuPosition({
            left:e.clientX - width,
            top:e.clientY + 10
          })

          setRightActive(e.target.id.split("-")[1]);
        }
    };

    const closeAll = () => {
        setHistorys([
          {
            name: defaultRouter,
            meta: { title: "首页" },
            query: {},
            params: {},
            path: `/${defaultRouter}`
          }
        ]);
        navigate(`/${defaultRouter}`);
        setContextMenuVisible(false);
    };

    const closeLeft = () => {
        const rightIndex = historys.findIndex(item => 
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === rightActive
        );
        
        const activeIndex = historys.findIndex(item =>
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === activeValue
        );
        
        const newHistorys = historys.slice(rightIndex);
        setHistorys(newHistorys);
        
        if (rightIndex > activeIndex) {
          const rightItem = historys[rightIndex];
          navigate(rightItem.path, { state: rightItem.params });
        }
        
        setContextMenuVisible(false);
    };

    const closeRight = () => {
        const leftIndex = historys.findIndex(item => 
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === rightActive
        );
        
        const activeIndex = historys.findIndex(item =>
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === activeValue
        );
        
        const newHistorys = historys.slice(0, leftIndex + 1);
        setHistorys(newHistorys);
        
        if (leftIndex < activeIndex) {
          const rightItem = historys[leftIndex];
          navigate(rightItem.path, { state: rightItem.params });
        }
        
        setContextMenuVisible(false);
    };

    const closeOther = () => {
        const filtered = historys.filter(item => 
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === rightActive
        );
        
        setHistorys(filtered);
        
        if (filtered.length > 0) {
          const item = filtered[0];
          navigate(item.path, { state: item.params });
        }
        
        setContextMenuVisible(false);
    };

    const changeTab = (key) => {
        const tab = historys.find(item => 
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === key
        );
        
        if (tab) {
          navigate(tab.path, { state: tab.params });
        }
    };

    const removeTab = (key, action) => {
        if (action !== 'remove') return;
        
        const index = historys.findIndex(item => 
          `${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}` === key
        );
        
        if (index === -1) return;
        
        const newHistorys = [...historys];
        newHistorys.splice(index, 1);
        setHistorys(newHistorys);
        
        if (`${location.pathname}${JSON.stringify(location.search)}${JSON.stringify(location.state || {})}` === key) {
          if (newHistorys.length === 0) {
            navigate(`/${defaultRouter}`);
          } else if (index < newHistorys.length) {
            const nextTab = newHistorys[index] || newHistorys[index - 1];
            navigate(nextTab.path, { state: nextTab.params });
          } else {
            const prevTab = newHistorys[index - 1];
            navigate(prevTab.path, { state: prevTab.params });
          }
        }
    };

    return (
        <div className="router-history">
            <Tabs
              hideAdd
              type="editable-card"
              activeKey={activeValue}
              onEdit={removeTab}
              onChange={changeTab}
              onContextMenu={openContextMenu}
            >
              {historys.map((item) => (
                <TabPane
                  key={`${item.path}${JSON.stringify(item.query)}${JSON.stringify(item.params)}`}
                  tab={item.meta.title}
                  closable={!(historys.length === 1 && location.pathname === `/${defaultRouter}`)}
                />
              ))}
            </Tabs>

            {contextMenuVisible && (
              <ul 
                className="contextmenu" 
                style={{ left: `${menuPosition.left}px`, top: `${menuPosition.top}px` }}
              >
                <li onClick={closeAll}>关闭所有</li>
                <li onClick={closeLeft}>关闭左侧</li>
                <li onClick={closeRight}>关闭右侧</li>
                <li onClick={closeOther}>关闭其他</li>
              </ul>
            )}
        </div>
    );
};


export default HistoryTabs;
