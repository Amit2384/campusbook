"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Optional: verify with backend if token is still valid
                setUser(decoded);
            } catch (err) {
                Cookies.remove("token");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            Cookies.set("token", res.data.token, { expires: 1 });
            setUser(res.data.user);
            return { success: true, role: res.data.user.role };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Login failed" };
        }
    };

    const register = async (userData) => {
        try {
            await api.post("/auth/register", userData);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/login");
    };

    const updateUserData = (newData) => {
        setUser(prev => prev ? { ...prev, ...newData } : null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
