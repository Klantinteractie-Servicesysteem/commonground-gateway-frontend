import axios, { AxiosInstance } from 'axios';
import Application from './resources/application';
import Attribute from './resources/attribute';
import Source from './resources/source';
import Entity from './resources/entity';

export default class APIService {
  private _jwtToken: string;

  constructor (_jwtToken: string) {
    this._jwtToken = _jwtToken
  }

  public get axiosClient (): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_ADMIN_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: "Bearer " + this._jwtToken,
      }
    });
  }

  public get Application (): Application { return new Application(this.axiosClient) }
  public get Attribute (): Attribute { return new Attribute(this.axiosClient) }
  public get Source (): Source { return new Source(this.axiosClient) }
  public get Entity (): Entity { return new Entity(this.axiosClient) }
}
