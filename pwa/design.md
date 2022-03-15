# Design Decisions

## Introduction:

The following document contains all design decisions. Any and all included packages **must be** _highly adopted_ and _well documented_.

## Decision Log:

-   All forms are built upon [React Hook Form](https://react-hook-form.com/) because of its small bundle size, performance and, most important, its automatic validation of form-data. Combined, React Hook Form, removes complexity from our code base and creates a more robust, secure and efficient solution.
-   All asynchronous calls are realized upon [React Query](https://react-query.tanstack.com/) because of its automatic request caching, automatic re-trying mechanisms, automatic request validations and the ability to invalidate requests. Combined, React Query creates a more robust and efficient solution _and_ removes the need of a "global state" manager.
