import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const authStatus = localStorage.getItem("isAuthenticated");
		if (authStatus === "true") {
			setIsAuthenticated(true);
		}
	}, []);

	const login = (username, password) => {
		if (username === "user" && password === "123456") {
			localStorage.setItem("isAuthenticated", "true");
			setIsAuthenticated(true);
			return true;
		}
		return false;
	};

	const logout = () => {
		localStorage.removeItem("isAuthenticated");
		setIsAuthenticated(false);
	};

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
