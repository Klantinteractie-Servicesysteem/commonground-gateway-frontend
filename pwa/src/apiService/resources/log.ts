import { AxiosInstance, AxiosResponse } from "axios";

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAllIncoming = (): Promise<AxiosResponse> => {
    return this._instance.get("/logs?type=in");
  };

  public getAllFromSession = (sessionId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/logs?session=${sessionId}`);
  };

  public getAllFromCall = (callId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/logs?callId=${callId}`);
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse> => {
    return this._instance.get("/logs?entity.id=" + entityId);
  };

  public getAllFromEndpoint = (endpointId: string): Promise<AxiosResponse> => {
    return this._instance.get("/logs?endpoint.id=" + endpointId);
  };

  public getAllFromSource = (sourceId: string): Promise<AxiosResponse> => {
    return this._instance.get("/logs?source.id=" + sourceId);
  };

  public getAllOutgoingFromCallId = (callId: string): Promise<AxiosResponse> => {
    return this._instance.get(`/logs?type=out&callId=${callId}`);
  };
}
