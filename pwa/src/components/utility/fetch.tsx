//interfaces for the functions

interface getCallConfig {
  url: string;
  headers?: Record<any, string>;
  dataOffset?: string | null;
}

interface postCallConfig {
  url: string;
  headers?: Record<any, string>;
  dataOffset?: string | null;
  body: Record<any, any>;
}

interface putCallConfig {
  url: string;
  headers?: Record<any, string>;
  dataOffset?: string | null;
  body: Record<any, any>;
}

//fetch functions

export const getCall = (config: getCallConfig) => {
  fetch(config.url, {
    method: "GET",
    headers: config.headers,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      if (config.dataOffset) {
        return data[config.dataOffset];
      } else {
        return data;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

export const postCall = (config: postCallConfig) => {
  fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(config.body),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      if (config.dataOffset) {
        return data[config.dataOffset];
      } else {
        return data;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

export const putCall = (config: postCallConfig) => {
  fetch(config.url, {
    method: "PUT",
    headers: config.headers,
    body: JSON.stringify(config.body),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      if (config.dataOffset) {
        return data[config.dataOffset];
      } else {
        return data;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

//default values for the functions

getCall.defaultProps = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + sessionStorage.getItem("jwt"),
  },
  dataOffset: null,
};

postCall.defaultProps = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + sessionStorage.getItem("jwt"),
  },
  dataOffset: null,
};

putCall.defaultProps = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + sessionStorage.getItem("jwt"),
  },
  dataOffset: null,
};
