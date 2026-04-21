import api from "./api";
import type { User } from "../types/index.ts";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function signIn(payload: LoginPayload) {
  const email = normalizeEmail(payload.email);
  const response = await api.get<User[]>("/users", {
    params: { email },
  });

  const user = response.data.find(
    (item) =>
      item.email.toLowerCase() === email && item.password === payload.password,
  );

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng.");
  }

  if (!user.isActive) {
    throw new Error("Tài khoản chưa được kích hoạt.");
  }

  return user;
}

export async function signUp(payload: RegisterPayload) {
  const email = normalizeEmail(payload.email);
  const existing = await api.get<User[]>("/users", {
    params: { email },
  });

  if (existing.data.some((item) => item.email.toLowerCase() === email)) {
    throw new Error("Email này đã được sử dụng.");
  }

  const newUser: Omit<User, "id"> = {
    name: payload.name.trim(),
    email,
    password: payload.password,
    role: "user",
    isActive: true,
    phone: payload.phone?.trim() ?? "",
    addresses: [],
  };

  const response = await api.post<User>("/users", newUser);
  return response.data;
}
