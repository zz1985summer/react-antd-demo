
import './App.css'
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Router from "./router";
import { Provider } from 'react-redux';
import { store } from './store';



function App() {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <Router />
        </Provider>
      </ConfigProvider>
    </>
  )
}

export default App
