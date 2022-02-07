// import * as React from 'react'
// import {NOTIFICATION} from "./layout";
// import {render} from "react-dom";
// import {AxiosResponse} from "axios";
//
// interface Notification {
//   message: string;
//   type: NOTIFICATION;
// }
//
// export default class AlertService {
//
//   public alertMessage = (notification: Notification): any => {
//
//
//
//     const defaultApi = {
//       notifications: [] as Notification[],
//       setNotification: (notification: AddNotification) => null,
//     };
//
//     type NotificationsContextValue = typeof defaultApi;
//
//     /**
//      * Create Context
//      */
//     const NotificationsContext = React.createContext<
//       NotificationsContextValue
//       >(defaultApi);
//
//     function NotificationsProvider({ children }: any) {
//       const [notifications, setNotifications] = React.useState<Notification[]>(
//         defaultApi.notifications
//       );
//
//       // Method to push a new notification
//       const setNotification = React.useCallback(
//         (notification: AddNotification) => {
//           const nextNotifications = notifications.concat({
//             type: NOTIFICATION.DANGER,
//             ...notification
//           } as Notification);
//           setNotifications(nextNotifications);
//         },
//         [notifications, setNotifications]
//       );
//
//       // Return Provider with full API
//       return (
//         <NotificationsContext.Provider
//           value={{
//             notifications,
//             setNotification
//           }}
//         >
//           {children}
//         </NotificationsContext.Provider>
//       );
//       // return (NotificationsProvider);
//     }
//
//   }
//
//
// }
//
// // class Mouse extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.handleMouseMove = this.handleMouseMove.bind(this);
// //     this.state = { x: 0, y: 0 };
// //   }
// //
// //   handleMouseMove(event) {
// //     this.setState({
// //       x: event.clientX,
// //       y: event.clientY
// //     });
// //   }
// //
// //   render() {
// //     return (
// //       <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
// //
// //         {/* ...but how do we render something other than a <p>? */}
// //         <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
// //       </div>
// //     );
// //   }
// // }
// //
// // class MouseTracker extends React.Component {
// //   render() {
// //     return (
// //       <>
// //         <h1>Move the mouse around!</h1>
// //         <Mouse />
// //       </>
// //     );
// //   }
// // }
