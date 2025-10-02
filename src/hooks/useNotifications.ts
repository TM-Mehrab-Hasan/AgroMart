import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  toggleNotificationPanel,
  setFilter,
} from '@/store/slices/notificationSlice';
import type { NotificationType } from '@prisma/client';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    isNotificationPanelOpen,
    filter,
  } = useAppSelector((state) => state.notifications);

  const fetchUserNotifications = (params: {
    page?: number;
    limit?: number;
    filter?: 'all' | 'unread' | NotificationType;
  } = {}) => {
    dispatch(fetchNotifications(params));
  };

  const markAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const markAllNotificationsAsRead = () => {
    dispatch(markAllAsRead());
  };

  const deleteNotificationById = (notificationId: string) => {
    dispatch(deleteNotification(notificationId));
  };

  const clearAllUserNotifications = () => {
    dispatch(clearAllNotifications());
  };

  const refreshUnreadCount = () => {
    dispatch(getUnreadCount());
  };

  const togglePanel = () => {
    dispatch(toggleNotificationPanel());
  };

  const setNotificationFilter = (filter: 'all' | 'unread' | NotificationType) => {
    dispatch(setFilter(filter));
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    isNotificationPanelOpen,
    filter,
    fetchUserNotifications,
    markAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    clearAllUserNotifications,
    refreshUnreadCount,
    togglePanel,
    setNotificationFilter,
  };
};