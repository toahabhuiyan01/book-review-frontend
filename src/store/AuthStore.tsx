import { create } from "zustand";
import axios, { AxiosError } from "axios";
import jwt from "jsonwebtoken";
import { IUser } from "../types";
import useAlertStore from "./AlertStore";

type UserPatchType = Partial<Pick<IUser, "username" | "avatar" | "email">>;
type JWTUser = {
    user: {
        id: string;
        email: string;
        username: string;
    };
};

type UserStoreType = {
    user?: IUser;
    accessToken?: string;
    jwtUser?: JWTUser["user"];
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: IUser) => void;
    setAccessToken: (accessToken: string | undefined) => void;
    setLoading: (loading: boolean) => void;
    patchUserState: (data: UserPatchType) => void;
    logout: () => void;
};

const useAuthState = create<UserStoreType>((set) => ({
    loading: false,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    accessToken: localStorage.getItem("accessToken") || undefined,
    jwtUser: getJwtUser(),
    user: undefined,

    setUser: (user) => set({ user }),
    setAccessToken: (accessToken) => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            set({
                isAuthenticated: true,
                accessToken,
                jwtUser: getJwtUser(accessToken),
            });
        } else {
            localStorage.removeItem("accessToken");
            set({
                isAuthenticated: false,
                accessToken: undefined,
                user: undefined,
            });
        }
    },
    setLoading: (loading) => set({ loading }),
    patchUserState: (data) =>
        set((state) => ({
            user: { ...(state.user as IUser), ...data },
        })),
    logout: () => {
        set({
            isAuthenticated: false,
            accessToken: undefined,
            user: undefined,
            jwtUser: undefined,
        });
        localStorage.removeItem("accessToken");
    },
}));

const useAuthStore = () => {
    const {
        setUser,
        patchUserState,
        setAccessToken,
        setLoading,
        logout,
        ...state
    } = useAuthState();
    const { setAlert } = useAlertStore();

    async function getUserData() {
        setLoading(true);
        try {
            const res = await axios.get("/user");
            setUser(res.data);
        } catch (error) {
            handleAxiosError(error, (mess) => setAlert(mess, "error"));
        } finally {
            setLoading(false);
        }
    }

    async function patchUserData(data: UserPatchType) {
        try {
            await axios.patch("/user", data);
            patchUserState(data);
        } catch (error) {
            handleAxiosError(error, (mess) => setAlert(mess, "error"));
        }
    }

    async function login(email: string, password: string) {
        try {
            const res = await axios.post("/login", { email, password });
            const { accessToken } = res.data;
            setAccessToken(accessToken);

            return true;
        } catch (error) {
            handleAxiosError(error, (mess) => setAlert(mess, "error"));
        }
    }

    async function register(email: string, username: string, password: string) {
        try {
            await axios.post("/register", { email, username, password });

            return true;
        } catch (error) {
            handleAxiosError(error, (mess) => setAlert(mess, "error"));
        }
    }

    return {
        ...state,
        getUserData,
        patchUserData,
        login,
        register,
        logout,
    };
};

function handleAxiosError(error: unknown, alert: (mess: string) => void) {
    if (error instanceof AxiosError) {
        alert(error.response?.data.message || "An error occurred");
    } else {
        alert("An unexpected error occurred");
    }
}

function getJwtUser(t?: string) {
    const token = t || localStorage.getItem("accessToken");
    if (!token) {
        return;
    }

    const decoded = jwt.decode(token) as JWTUser;
    return decoded?.user;
}

export default useAuthStore;
