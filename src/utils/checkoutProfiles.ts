import type { CheckoutProfile, User } from "../types";

export function getUserCheckoutProfiles(user: User | null) {
  if (!user) {
    return [];
  }

  const addressProfiles: CheckoutProfile[] = user.addresses.map((address) => ({
    id: `address-${address.id}`,
    label: address.isDefault ? "Địa chỉ mặc định" : "Địa chỉ đã lưu",
    name: address.name,
    phone: address.phone,
    address: address.street,
    city: address.city,
    note: "",
    isDefault: address.isDefault,
  }));

  const storedProfiles = user.checkoutProfiles ?? [];
  const storedIds = new Set(storedProfiles.map((profile) => profile.id));

  return [
    ...storedProfiles,
    ...addressProfiles.filter((profile) => !storedIds.has(profile.id)),
  ];
}

export function createCheckoutProfile(
  data: Omit<CheckoutProfile, "id">,
): CheckoutProfile {
  return {
    ...data,
    id: `profile-${Date.now()}`,
  };
}

export function applyDefaultCheckoutProfile(
  profiles: CheckoutProfile[],
  defaultProfileId: string,
) {
  return profiles.map((profile) => ({
    ...profile,
    isDefault: profile.id === defaultProfileId,
  }));
}
