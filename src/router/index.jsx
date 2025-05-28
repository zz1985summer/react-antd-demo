
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Login from '@/views/login';
//import NotFound from '@/views/notfound';
import ProtectedRoute from './protectedRoute';
import RouterConfig from './routerConfig';


export default function Router(){
    return (
        <BrowserRouter>
            <Routes>
                {/*登录页面*/}
                <Route path="/login" element={<Login />} />
                {/*受保护页面*/}
                <Route 
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <RouterConfig />
                        </ProtectedRoute>
                    }
                />
                {/*404页面*/}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}