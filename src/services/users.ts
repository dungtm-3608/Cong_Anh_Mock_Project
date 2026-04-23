import type { CheckoutProfile, User } from "../types";
import api from "./api";

export async function updateUserCheckoutProfiles(
  userId: string,
  checkoutProfiles: CheckoutProfile[],
) {
  const response = await api.patch<User>(`/users/${userId}`, {
    checkoutProfiles,
  });

  return response.data;
}
