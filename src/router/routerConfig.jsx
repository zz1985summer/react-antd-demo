import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { generateRoutes } from '@/router/menuHelper';
import NotFound from '@/views/notfound';
import Main from '@/views/layout';

export default function RouterConfig() {
    const menuList = useSelector((state) => state.menu.menuList);
    const routes = generateRoutes(menuList || []).map((route) => {
        if(route.path === '/') route.element = <Main />;
            return route;
    });

    routes.push({path:'*',element:<NotFound />});
    return useRoutes(routes);
}