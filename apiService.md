# API Service

## Prerequisites:

-   understanding of HTTP requests with [Axios](https://www.npmjs.com/package/axios). Axios has a lot of advantages and if you want to read more about it, check out [this](https://betterprogramming.pub/why-javascript-developers-should-prefer-axios-over-fetch-294b28a96e2c) blog post.
-   React [State](https://reactjs.org/docs/hooks-state.html) and [Context](https://reactjs.org/docs/context.html)

## Getting started

The following documentation is suited for developers with React experience with designing Progressive Web Applications. The apiService is a way to organize HTTP requests logic needed to create, read, update and delete entries in data collections.

### Key Differences

-   Axios needs to be imported

```javascript
    npm install axios
```

### apiServices

Now, there is an `apiService.ts` file that takes care of all the headers in `src/apiService`. This file imports the `Resources` like Application, Attribute, Source, etc., from `/resources/`. It needs to import `axios , { AxiosInstance } from 'axios'`, along with the resources.

It exports a class component with the tokens safely set privately and the `axiosClient` method to instantiate an HTTP request with `baseURL` set and Headers specified with tokens, content-type, and accepted returned formats.

The apiServices call upon resources to instantiate

### Resources

The resources need instances (they get this from the apiService), this instance receives one of four methods (getAll, getOne, create, update). The resources are made separately for easy-to-read, maintainable, reusable components that allow custom calling. This way improves performance as if doesn't need to go through a maze of if-else statements.

### apiContext

To avoid having to call new instances everywhere in components that need instances, React solves this state issue with a `Provider` component. This Provider Component specifies data required elsewhere in the application without going heavy on Redux or Prop Drilling your state through unnecessary components.

This component imports the `APIService`. Then [creates](https://reactjs.org/docs/context.html#reactcreatecontext) context with the APIService data we need to make globally accessible and store that in a variable.

It exports this variable as a `Provider` for other components to import and use (as [`Consumers`](https://reactjs.org/docs/context.html#contextconsumer)).

### Provider

The Provider component needs to be imported in a top component, like `<App />` or often the `<Layout />` component (another wrapper component). In this case, call upon the `APIService` like:

```javascript
const API: APIService = new APIService(sessionStorage.getItem("jwt"));
```

The wrapping is enough to make this data accessible in your application when you add `API` as value props (`value={API}`) to the `APIProvider` component. The Provider in our application is the `apiContext` exported as `<APIProvider />` component.

# How to implement the API service

First you will need to import both the `APIContext` and `APIService` in the following manner:

```javascript
import APIcontext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
```

Then in the component:

```javascript
const API: APIService = React.useContext(APIContext);
```

This `const `references the variable(context) in the wrapped, top component where we instantiated the API service. It's the `value` prop we sent along with the provider component. The difference here is that we **don't** have to make a new instance. We use the same instance everywhere in the application.

Now, if we want to use it all, invoke `API`, and you will see the available `resources`. Select a resource, and automatically, you will see the available methods (see quick list below) for you to use in your functions and use the known methods like `then()`, `catch()` and `finally()`.

```javascript
const API: APIService = React.useContext(APIContext);

API.Attribute.getAll()
    .then((res) => {
        // do something
    })
    .catch((err) => {
        throw new Error("GET attribute error: " + err);
    })
    .finally
    // confirmation log or toggling state
    ();
```

> This is an example of everything implemented
