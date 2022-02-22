import { AxiosInstance, AxiosResponse } from "axios";

export default class Login {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public login = (data: any): Promise<AxiosResponse> => {
    return this._instance.post("/users/login", JSON.stringify(data));
  };
}
