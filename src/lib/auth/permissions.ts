import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageProducts: true,
    canManageOrders: true,
    canManageShops: true,
    canViewAnalytics: true,
    canManageDeliveryAreas: true,
    canManageCoupons: true,
    canModerateContent: true,
  },
  [UserRole.CUSTOMER]: {
    canPlaceOrders: true,
    canViewProducts: true,
    canManageOwnProfile: true,
    canWriteReviews: true,
    canManageOwnAddresses: true,
  },
  [UserRole.SHOP_OWNER]: {
    canManageOwnShop: true,
    canManageShopProducts: true,
    canViewShopOrders: true,
    canViewShopAnalytics: true,
    canManageOwnProfile: true,
    canSetCommissionRates: true,
  },
  [UserRole.SELLER]: {
    canManageOwnProducts: true,
    canViewOwnOrders: true,
    canManageOwnProfile: true,
    canUpdateInventory: true,
    canViewOwnAnalytics: true,
  },
  [UserRole.RIDER]: {
    canViewAssignedOrders: true,
    canUpdateDeliveryStatus: true,
    canManageOwnProfile: true,
    canUpdateLocation: true,
    canViewDeliveryAreas: true,
  },
};

export function hasPermission(
  userRole: UserRole,
  permission: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] as Record<string, boolean>;
  return rolePermissions?.[permission] || false;
}

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === UserRole.ADMIN;
}

export function isCustomer(session: Session | null): boolean {
  return session?.user?.role === UserRole.CUSTOMER;
}

export function isShopOwner(session: Session | null): boolean {
  return session?.user?.role === UserRole.SHOP_OWNER;
}

export function isSeller(session: Session | null): boolean {
  return session?.user?.role === UserRole.SELLER;
}

export function isRider(session: Session | null): boolean {
  return session?.user?.role === UserRole.RIDER;
}

export function canAccessAdminPanel(session: Session | null): boolean {
  return isAdmin(session);
}

export function canManageProducts(session: Session | null): boolean {
  if (!session) return false;
  return hasPermission(session.user.role, 'canManageProducts') ||
         hasPermission(session.user.role, 'canManageOwnProducts') ||
         hasPermission(session.user.role, 'canManageShopProducts');
}

export function canPlaceOrders(session: Session | null): boolean {
  if (!session) return false;
  return hasPermission(session.user.role, 'canPlaceOrders');
}

export function canManageDeliveries(session: Session | null): boolean {
  if (!session) return false;
  return isAdmin(session) || isRider(session);
}

export function getUserRoleDisplayName(role: UserRole): string {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.CUSTOMER]: 'Customer',
    [UserRole.SHOP_OWNER]: 'Shop Owner',
    [UserRole.SELLER]: 'Seller/Producer',
    [UserRole.RIDER]: 'Delivery Rider',
  };
  return roleNames[role];
}

export function getUserRoleColor(role: UserRole): string {
  const roleColors = {
    [UserRole.ADMIN]: 'bg-red-100 text-red-800',
    [UserRole.CUSTOMER]: 'bg-blue-100 text-blue-800',
    [UserRole.SHOP_OWNER]: 'bg-purple-100 text-purple-800',
    [UserRole.SELLER]: 'bg-green-100 text-green-800',
    [UserRole.RIDER]: 'bg-orange-100 text-orange-800',
  };
  return roleColors[role];
}

export function getUserAllowedRoutes(role: UserRole): string[] {
  const routeMap = {
    [UserRole.ADMIN]: [
      '/admin',
      '/admin/users',
      '/admin/products',
      '/admin/orders',
      '/admin/shops',
      '/admin/analytics',
      '/admin/delivery-areas',
      '/admin/coupons',
    ],
    [UserRole.CUSTOMER]: [
      '/profile',
      '/orders',
      '/cart',
      '/wishlist',
      '/addresses',
      '/reviews',
    ],
    [UserRole.SHOP_OWNER]: [
      '/shop',
      '/shop/products',
      '/shop/orders',
      '/shop/analytics',
      '/shop/settings',
      '/profile',
    ],
    [UserRole.SELLER]: [
      '/seller',
      '/seller/products',
      '/seller/orders',
      '/seller/analytics',
      '/seller/inventory',
      '/profile',
    ],
    [UserRole.RIDER]: [
      '/rider',
      '/rider/orders',
      '/rider/deliveries',
      '/rider/areas',
      '/rider/earnings',
      '/profile',
    ],
  };
  return routeMap[role] || [];
}