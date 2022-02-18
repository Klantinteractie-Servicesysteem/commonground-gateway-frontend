import axios, {AxiosInstance} from "axios";
import Application from "./resources/application";
import Attribute from "./resources/attribute";
import Source from "./resources/source";
import Entity from "./resources/entity";
import ObjectEntity from "./resources/ObjectEntity";
import Log from "./resources/log";
import Login from "./services/login";
import Documentation from "./services/documentation";
import Endpoint from "./resources/endpoint";
import FormIO from "./resources/formIO";
import Handler from "./resources/handler";
import ApiCalls from "./resources/apiCalls";
import { GATSBY_ADMIN_URL, GATSBY_API_URL } from "../../static/env.js";

export default class APIService {
  private _jwtToken: string;

  constructor(_jwtToken: string) {
    this._jwtToken = _jwtToken;
  }

  public get adminClient(): AxiosInstance {
    return axios.create({
      baseURL: GATSBY_ADMIN_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
      },
    });
  }

  public get apiClient(): AxiosInstance {
    return axios.create({
      baseURL: GATSBY_API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
      },
    });
  }

  public get loginClient(): AxiosInstance {
    return axios.create({
      baseURL: GATSBY_API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public get documentationClient(): AxiosInstance {
    return axios.create({
      baseURL: process.env.GATSBY_READ_THE_DOCS_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public get formIOClient(): AxiosInstance {
    return axios.create({
      baseURL: GATSBY_API_URL,
      headers: {
        "Accept": "application/form.io",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this._jwtToken,
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

  public get Log(): Log {
    return new Log(this.adminClient);
  }

  public get Endpoint(): Endpoint {
    return new Endpoint(this.adminClient);
  }

  public get Handler(): Handler {
    return new Handler(this.adminClient);
  }

  // Services
  public get Login(): Login {
    return new Login(this.loginClient);
  }

  public get Documentation(): Documentation {
    return new Documentation(this.documentationClient);
  }
  public get FormIO(): FormIO {
    return new FormIO(this.formIOClient);
  }
  public get ApiCalls(): ApiCalls {
    return new ApiCalls(this.apiClient);
  }
}
