import { Tabs } from 'antd';
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
        ),
      }))}
      style={{background:'#fff',marginBottom:0}} />
  );
} 
