// src/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import API from "./api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case "LOAD_USER_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ GET /api/user/me
  const loadUser = async () => {
    try {
      const res = await API.get("/me");
      console.log("✅ LoadUser response:", res.data);

      dispatch({
        type: "LOAD_USER_SUCCESS",
        payload: res.data.user,
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data?.message || "Failed to load user",
      });
      localStorage.removeItem("token");
    }
  };

  // ✅ POST /api/user/login
  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await API.post("/login", { email, password });
      console.log("✅ Login response:", res.data);

      localStorage.setItem("token", res.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // ✅ POST /api/user/register
  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await API.post("/register", userData);
      console.log("✅ Register response:", res.data);

      localStorage.setItem("token", res.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
