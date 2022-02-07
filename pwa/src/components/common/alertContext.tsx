// import * as React from 'react'
// import AlertService from "./alert";
// import {NOTIFICATION} from "./layout";
//
// interface AddNotification {
//   message: string;
//   type?: NOTIFICATION;
// }
//
// /**
//  * Custom Notifications Provider
//  */
// export function NotificationsProvider({ children }: any) {
//   // Notifications queue is managed in local useState
//   const [notifications, setNotifications] = React.useState<Notification[]>(defaultApi.notifications);
//
//   // Method to push a new notification
//   const setNotification = React.useCallback(
//     (notification: AddNotification) => {
//       const nextNotifications = notifications.concat({
//         type: NOTIFICATION.DANGER,
//         ...notification
//       } as Notification);
//       setNotifications(nextNotifications);
//     },
//     [notifications, setNotifications]
//   );
//
//   // Method to clear one or more notification(s) by id, or clear ALL notifications
//   const clearNotification = React.useCallback(
//     (id: number) => {
//       const nextNotifications = notifications.filter((n) => n.id !== id);
//       setNotifications(nextNotifications);
//     },
//     [notifications, setNotifications]
//   );
//
//   // Return Provider with full API
//   return (
//     <NotificationsContext.Provider
//       value={{
//         notifications,
//         setNotification,
//         clearNotification
//       }}
//     >
//       {children}
//     </NotificationsContext.Provider>
//   );
// }
//
// // Connvenience import hook
// export function useNotifications() {
//   return React.useContext(NotificationsContext);
// }
