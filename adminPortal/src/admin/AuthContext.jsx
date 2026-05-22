import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        api
            .me()
            .then((res) => setUser(res.user))
            .catch(() => {
                setToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const res = await api.login(email, password);
        if (res.user.role !== "admin") {
            throw new Error("This portal is for admins only.");
        }
        setToken(res.token);
        setUser(res.user);
        return res.user;
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
