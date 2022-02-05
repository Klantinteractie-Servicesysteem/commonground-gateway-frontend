import axios, { AxiosInstance } from "axios";
import Application from "./resources/application";
import Attribute from "./resources/attribute";
import Source from "./resources/source";
import Entity from "./resources/entity";
import ObjectEntity from "./resources/ObjectEntity";
import Log from './resources/log';
import Login from "./services/login";
import Documentation from "./services/documentation";

export default class APIService {
  private _jwtToken: string;

  constructor(_jwtToken: string) {
    this._jwtToken = _jwtToken;
  }

  public get adminClient(): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_ADMIN_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
      },
    });
  }

  public get apiClient(): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public get documentationClient(): AxiosInstance {
    return axios.create({
      baseURL: "https://readthedocs.org/api/v3/embed",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  // Resources
  public get Application(): Application {
    return new Application(this.adminClient);
  }
  public get Attribute(): Attribute {
    return new Attribute(this.adminClient);
  }
  public get Source(): Source {
    return new Source(this.adminClient);
  }
  public get Entity(): Entity {
    return new Entity(this.adminClient);
  }
  public get ObjectEntity(): ObjectEntity {
    return new ObjectEntity(this.adminClient);
  }
  public get Log (): Log { 
    return new Log(this.adminClient);
  }

  // Services
  public get Login(): Login {
    return new Login(this.apiClient);
  }
  public get Documentation(): Documentation {
    return new Documentation(this.documentationClient);
  }
}
