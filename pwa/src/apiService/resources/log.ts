import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAllIncoming = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/logs?type=in");
    return data;
  };

  public getAllFromSession = async (sessionId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/logs?session=${sessionId}`);
    return data;
  };

  public getAllFromCall = async (callId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/logs?callId=${callId}`);
    return data;
  };

  public getAllFromEntity = async (entityId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/logs?entity.id=${entityId}`);
    return data;
  };

  public getAllFromEndpoint = async (endpointId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/logs?endpoint.id=${endpointId}`);
    return data;
  };

  public getAllFromSource = async (sourceId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/logs?source.id=${sourceId}`);
    return data;
  };

  public getAllOutgoingFromCallId = async (callId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/logs?type=out&callId=${callId}`);
    return data;
  };
}
