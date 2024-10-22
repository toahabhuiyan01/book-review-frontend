import { create } from 'zustand'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { IUser } from '../types'

type UserPatchType = Partial<Pick<IUser, 'username' | 'avatar' | 'email'>>
type JWTUser = {
    user: {
        id: string
        email: string
        username: string
    }
}

type AuthStoreType = {
    user?: IUser,
    accessToken?: string,
    jwtUser?: JWTUser['user'],
    isAuthenticated: boolean,
    getUserData: () => Promise<void>
    patchUserData: (data: UserPatchType) => Promise<void>
    setAccessToken: (accessToken: string | undefined) => void,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void,
    register: (email: string, username: string, password: string) => Promise<void>,
}

const useAuthStore = create<AuthStoreType>((set) => ({
        isAuthenticated: !!localStorage.getItem('accessToken'),
        accessToken: localStorage.getItem('accessToken') || undefined,
        jwtUser: getJwtUser(),
        logout: () => {
            set({ isAuthenticated: false, accessToken: undefined, user: undefined, jwtUser: undefined })
            localStorage.removeItem('accessToken')
        },
        setAccessToken: (accessToken) => {
            if(accessToken) {
                localStorage.setItem('accessToken', accessToken)
                set({ isAuthenticated: true, accessToken, jwtUser: getJwtUser(accessToken) })
            } else {
                localStorage.removeItem('accessToken')
                set({ isAuthenticated: false, accessToken: undefined, user: undefined })
            }
        },  
        login: async (email, password) => {
            const res = await axios.post(
                '/login',
                { email, password }
            )

            const { accessToken } = res.data
            localStorage.setItem('accessToken', accessToken)
            set({ isAuthenticated: true, accessToken, jwtUser: getJwtUser(accessToken) })
        },
        register: async (email, username, password) => {
            await axios.post(
                '/register',
                { email, username, password }
            )
        },
        getUserData: async () => {
            const res = await axios.get('/user')
            set({ user: res.data })
        },
        patchUserData: async (data) => {
            await axios.patch('/user', data)
            set((state) => ({ user: { ...(state.user as IUser), ...data } }))
        }
    })
)


function getJwtUser(t?: string) {
    const token = t || localStorage.getItem('accessToken')
    if(!token) {
        return
    }

    const decoded = jwt.decode(token) as JWTUser
    return decoded.user
}

export default useAuthStore