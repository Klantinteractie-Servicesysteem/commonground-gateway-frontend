import * as React from "react";
import { useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { AlertContext } from "../context/alertContext";

export const useLog = () => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  const getAllIncoming = () =>
    useQuery<any, Error>("logs-all-incoming", () => API.Log.getAllIncoming(), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
    });

  const getAllFromSession = (sessionId: string) =>
    useQuery<any, Error>("logs-all-session", () => API.Log.getAllFromSession(sessionId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!sessionId,
    });

  const getAllFromCall = (callId: string) =>
    useQuery<any, Error>("logs-all-call", () => API.Log.getAllFromCall(callId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!callId,
    });

  const getAllFromEntity = (entityId: string) =>
    useQuery<any, Error>("logs-all-entity", () => API.Log.getAllFromEntity(entityId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!entityId,
    });

  const getAllFromEndpoint = (entpointId: string) =>
    useQuery<any, Error>("logs-all-endpoint", () => API.Log.getAllFromEndpoint(entpointId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!entpointId,
    });

  const getAllFromSource = (sourceId: string) =>
    useQuery<any, Error>("logs-all-source", () => API.Log.getAllFromSource(sourceId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!sourceId,
    });

  const getAllOutgoingFromCallId = (callId: string) =>
    useQuery<any, Error>("logs-all-outgoing-call", () => API.Log.getAllOutgoingFromCallId(callId), {
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!callId,
    });

  return {
    getAllIncoming,
    getAllFromSession,
    getAllFromCall,
    getAllFromEntity,
    getAllFromEndpoint,
    getAllFromSource,
    getAllOutgoingFromCallId,
  };
};
