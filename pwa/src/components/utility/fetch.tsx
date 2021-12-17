//interfaces for the functions

interface getCallConfig {
  url: string;
  headers?: Record<any, string>;
  handler: any;
}

interface postCallConfig {
  url: string;
  headers?: Record<any, string>;
  body: Record<any, any>;
  handler: any;
}

interface putCallConfig {
  url: string;
  headers?: Record<any, string>;
  body: Record<any, any>;
  handler: any;
}

interface deleteCallConfig {
  url: string;
  headers?: Record<any, string>;
  handler: any;
}

//fetch functions

export const getCall = (config: getCallConfig) => {
  config = handleDefaults(config);
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
      config.handler(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

export const postCall = (config: postCallConfig) => {
  config = handleDefaults(config);
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
      config.handler(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

export const putCall = (config: putCallConfig) => {
  config = handleDefaults(config);
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
      config.handler(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

export const deleteCall = (config: deleteCallConfig) => {
  config = handleDefaults(config);
  fetch(config.url, {
    method: "DELETE",
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
      config.handler(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

//default values for the functions

function handleDefaults(config) {
  if (config.headers === undefined) {
    config.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("jwt"),
    };
  }

  return config;
}
