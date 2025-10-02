'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/hooks/useNotifications';

export default function ReduxTestComponent() {
  const { user, isAuthenticated, sessionStatus } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const { unreadCount } = useNotifications();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Redux Store Status</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Auth Status:</strong> {sessionStatus}
        </div>
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>User:</strong> {user?.name || 'Not logged in'}
        </div>
        <div>
          <strong>Cart Items:</strong> {totalItems}
        </div>
        <div>
          <strong>Cart Total:</strong> ${totalPrice.toFixed(2)}
        </div>
        <div>
          <strong>Unread Notifications:</strong> {unreadCount}
        </div>
      </div>
    </div>
  );
}