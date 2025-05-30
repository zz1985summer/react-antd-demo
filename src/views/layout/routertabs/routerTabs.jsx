import { Dropdown,Tabs,Menu } from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';


export default function RouterTabs() {
  const { tabs, activeKey } = useSelector(state => state.tab);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredKey, setHoveredKey] = useState(null);


  useEffect(() => {
    if(activeKey) {
      navigate(activeKey);
    }
  },[activeKey]);

  const onChange = (key) => {
    dispatch({ type: 'tab/setActive', payload: key });
  };

  const onRemove = (targetKey) => {
    dispatch({type:'tab/remove',payload:targetKey});
  };


  return (
    <Tabs
      type="card"
      hideAdd
      activeKey={activeKey}
      onChange={onChange}
      items={tabs.map(tab => ({
        key: tab.key,
        label: (
          <Dropdown
            trigger={['contextMenu']}
            overlay={
              <Menu
                onClick={({key:menuKey}) => {
                  if(menuKey === 'closeOthers') {
                    dispatch({type:'tab/closeOthers',payload:tab.key});
                  } else if (menuKey === 'closeAll') {
                    dispatch({type:'tab/closeAll'});
                  }

                }}
              >
                <Menu.Item key="closeOthers">关闭其他</Menu.Item>
                <Menu.Item key="closeAll">关闭所有</Menu.Item>
              </Menu>
            }
            >
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onMouseEnter={() => setHoveredKey(tab.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <span>{tab.label}</span>
            {(hoveredKey === tab.key || activeKey === tab.key) && tab.key !== '/' && (
              <CloseOutlined
                style={{ marginLeft:8,fontSize:12}}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(tab.key);
                }}
                />
            )}
          </div>
          </Dropdown>
        ),
      }))}
      style={{background:'#fff',marginBottom:0}} />
  );
} 
