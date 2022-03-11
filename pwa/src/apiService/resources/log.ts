import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAllIncoming = (): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", "/logs?type=in");
  };

  public getAllFromSession = (sessionId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/logs?session=${sessionId}`);
  };

  public getAllFromCall = (callId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/logs?callId=${callId}`);
  };

  public getAllFromEntity = (entityId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/logs?entity.id=${entityId}`);
  };

  public getAllFromEndpoint = (endpointId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/logs?endpoint.id=${endpointId}`);
  };

  public getAllFromSource = (sourceId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/logs?source.id=${sourceId}`);
  };

  public getAllOutgoingFromCallId = (callId: string): Promise<AxiosResponse | {}> => {
    return Send(this._instance, "GET", `/logs?type=out&callId=${callId}`);
  };
}
