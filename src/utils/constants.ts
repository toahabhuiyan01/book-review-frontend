export type RouteType = {
    path: string
    key: string,
    routes?: RouteType[]
}[]

export const AUTH_ROUTES: RouteType = [
    {
        path: '/profile',
        key: 'profile'
    }
]

export const NO_AUTH_ROUTES: RouteType = [
    {
        path: '/auth/login',
        key: 'login'
    },
    {
        path: '/auth/register',
        key: 'register'
    }
]

export const PUBLIC_ROUTES: RouteType = [
    {
        path: '/public/home',
        key: 'home'
    }
]