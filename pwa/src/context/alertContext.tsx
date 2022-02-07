import {createContext, Provider, useContext, useState} from 'react';
import * as React from "react";

export enum NOTIFICATION {
  PRIMARY= 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark'
}

export interface AddNotification {
  message: string | React.ReactNode;
  type?: NOTIFICATION;
}

export interface Notification {
  message: string | React.ReactNode;
  type: NOTIFICATION;
}
//
const defaultApi = {
  notification: Notification,
  setNotification: NOTIFICATION
};
//
export type NotificationsContextValue = typeof defaultApi;
//
// /**
//  * Create Context
//  * const MyContext = React.createContext(defaultValue);
//  */
// export const NotificationsContext = React.createContext<NotificationsContextValue>(defaultApi);


const NotificationsContext = createContext<NotificationsContextValue>(defaultApi);

export function AlertContextWrapper({ children }) {

  const [notification, setNotification] = React.useState<Notification>();


  const setNotifications = React.useCallback(
    (notification: AddNotification) => {
      setNotification
    },
    [notification, setNotification]
  );

  return (
    <NotificationsContext.Provider  value={{
      notification,
      setNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Connvenience import hook
export function useNotifications() {
  return useContext<any>(NotificationsContext);
}

