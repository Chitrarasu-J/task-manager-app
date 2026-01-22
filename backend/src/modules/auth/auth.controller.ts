import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken } from "./auth.service";
import { logoutUser } from "./auth.service";
/* =======================
   REGISTER
======================= */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser({ name, email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

/* =======================
   LOGIN
======================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const data = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      ...data,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};

/* =======================
   REFRESH TOKEN
======================= */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const data = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      message: "Access token refreshed",
      ...data,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Token refresh failed",
    });
  }
};

/* =======================
   LOGOUT (NEXT STEP)
======================= */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    await logoutUser(refreshToken);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Logout failed",
    });
  }
};