import api from "@/lib/api";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post("/auth/register", payload);

  return response.data;
}
