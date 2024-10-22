import { Suspense, ComponentType, lazy, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, NO_AUTH_ROUTES, PUBLIC_ROUTES, RouteType } from "../utils/constants";
import useAuthStore from "../store/AuthStore";
import { Grid2 as Grid } from "@mui/material";
import TopBar from "../components/TopBar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LAZY_RENDER_COMPONENTS: { [_: string]: React.LazyExoticComponent<ComponentType<any>> } = {
    'login': lazy(() => import('../Auth/Login')),
    'register': lazy(() => import('../Auth/Register')),
    'profile': lazy(() => import('../Profile')),
    'home': lazy(() => import('../Home'))
}

function RenderUnAuthRoute(renderRoutes: RouteType) {
    const routes: JSX.Element[] = []
    
    for (const route of renderRoutes) {
        const RenderPage = LAZY_RENDER_COMPONENTS[route.key]
        routes.push(
            <Route
                key={route.path}
                path={route.path} 
                element={
                    <Suspense fallback={<>...</>}>
                        <RenderPage />
                    </Suspense>
                } 
            />
        )
    }

    return routes
}

function RenderAuthRoute(renderRoutes: RouteType) {
    const routes: JSX.Element[] = []
    
    for (const route of renderRoutes) {
        const RenderPage = LAZY_RENDER_COMPONENTS[route.key]
        routes.push(
            <Route
                key={route.path}
                path={route.path} 
                element={
                    <Suspense fallback={<>...</>}>
                        <Grid
                            display='flex'
                            justifyContent='center'
                        >
                            <Grid
                                p={2}
                                display='flex'
                                flexDirection='column'
                                sx={{
                                    width: '70rem',
                                    maxWidth: '100%',
                                    height: '100vh'
                                }}
                            >
                                <TopBar />
                                <RenderPage />
                            </Grid>
                        </Grid>
                    </Suspense>
                } 
            />
        )
    }

    return routes
}

export default function RouterComponent() {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(
        () => {
            const isUnAuthRoute = NO_AUTH_ROUTES.some(route => route.path === location.pathname)
            const isPublicRoute = PUBLIC_ROUTES.some(route => route.path === location.pathname)
            if(isPublicRoute) {
                return
            }

            if((!isAuthenticated && !isUnAuthRoute) || (isAuthenticated && isUnAuthRoute)) {
                console.log('Redirecting to home page...')

                navigate('/public/home')
            }
        },
        [location.pathname, isAuthenticated]
    )

    return (
        <Routes>
            <Route path="/">
                <Route path="/">
                    {RenderAuthRoute(AUTH_ROUTES)}
                </Route>
                <Route path="/public">
                    {RenderAuthRoute(PUBLIC_ROUTES)}
                </Route>
                <Route path="/auth">
                    {RenderUnAuthRoute(NO_AUTH_ROUTES)}
                </Route>
                <Route path="*" element={"No Match!"} />
            </Route>
      </Routes>
    )
}