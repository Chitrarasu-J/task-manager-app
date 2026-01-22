import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* =======================
   REGISTER USER
======================= */
interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

/* =======================
   LOGIN USER
======================= */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // ✅ Secrets (explicit)
  const accessSecret = process.env.JWT_ACCESS_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  // ✅ Typed expirations (NO env, NO TS error)
  const ACCESS_EXPIRES_IN = "15m";
  const REFRESH_EXPIRES_IN = "7d";

  const accessToken = jwt.sign(
    { userId: user.id },
    accessSecret,
    { expiresIn: ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    refreshSecret,
    { expiresIn: REFRESH_EXPIRES_IN }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
export const refreshAccessToken = async (refreshToken: string) => {
  console.log("➡️ Incoming refresh token:", refreshToken);

  let payload: any;
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );
  } catch {
    console.log("❌ JWT verification failed");
    throw new Error("Invalid refresh token");
  }

  console.log("✅ JWT payload:", payload);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  console.log("🗄️ Token in DB:", user?.refreshToken);

  if (!user || user.refreshToken !== refreshToken) {
    console.log("❌ Token mismatch with DB");
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );

  return { accessToken: newAccessToken };
};
export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Find user with this refresh token
  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) {
    // Even if token is invalid, respond success (security best practice)
    return;
  }

  // Remove refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });
};
