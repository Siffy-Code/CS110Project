import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        async function restoreSession() {
            try {
                const authRes = await api.me();

                if (authRes.user.role !== "merchant") {
                    throw new Error("This portal is for merchants only.");
                }

                setUser(authRes.user);

                try {
                    const merchantRes = await api.merchantMe();
                    setMerchant(merchantRes.merchant);
                } catch {
                    setMerchant(null);
                }
            } catch {
                setToken(null);
                setUser(null);
                setMerchant(null);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    async function login(email, password) {
        const res = await api.login(email, password);

        if (res.user.role !== "merchant") {
            throw new Error("This portal is for merchants only.");
        }

        setToken(res.token);
        setUser(res.user);

        try {
            const merchantRes = await api.merchantMe();
            setMerchant(merchantRes.merchant);
        } catch {
            setMerchant(null);
        }

        return res.user;
    }

    async function register(name, email, password) {
        const res = await api.register(name, email, password);

        if (res.user.role !== "merchant") {
            throw new Error("This portal is for merchants only.");
        }

        setToken(res.token);
        setUser(res.user);
        setMerchant(null);

        return res.user;
    }

    function logout() {
        setToken(null);
        setUser(null);
        setMerchant(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                merchant,
                loading,
                login,
                register,
                logout,
                setMerchant,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}