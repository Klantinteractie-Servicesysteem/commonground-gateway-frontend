# NL Design Skeleton Application

The NL Design Skeleton application is design for rapid application testing and prototype development on the NL Design System. It does so by providing a basic skeleton application with full NL Design system functionality that an developer can easily extend view locally and deploy to an online environment for demonstration purposes. the main benefits of this are

Development and (online) demonstration of prototypes without the need of an servers
An ready out of the box basic  application that doesn't require configuration or setup and can be extended immediately.

The application is available in two versions, a next.js version and an gatsby version. If you want to put your prototype online without setting up a server we recommend the gatsby version, since that can be deployed through gatsby pages.

## Getting started

In order to set up your own project you will need an github account and be logged in, the simply click on “use this template” button. Tell github where you want to spin up your prototype and click “create repository from template”.


## Spinning up you  local environment

For this part of the tutorial you will need and git client, node.js, and yarn on your  local machine

In order to start developing locally you need to clone your new repository to your local machine. Then open your favorite CLI and simply navigate to the folder containing your repository and start up gatsby or next.js in development mode with the following commands.

**Nextjs**

```cli
$ yarn install
$ yarn dev
```

**Gatsby**

```cli
$ npm install
$ npm run develop
```

Afther yarn is ready with setting up your dev environment you should be able to navigate to [http://localhost:3000/](http://localhost:3000/) on Next or to [http://localhost:8000/](http://localhost:8000/) for gatsby and see the same application as on
[https://conductionnl.github.io/nl-design-skeleton-gatsby/](https://conductionnl.github.io/nl-design-skeleton-gatsby/).  Feel free to open up your project code and make some changes you should see the changes in your development environment isntantainusly.

## Publishing your prototype to the internet (gatsby only)

The gatsby version of the skeleton application has build in support for github pages, meaning that you can build your application into a static website and publish it as a github page. The skeleton repository comes with a build in github action for publishing itsself as a github page, meaning that you can have your prototype automatically published to the internet on a code push.

For this to work you will need to do active github-pages on your repository, go to your repository settings and click on pages select gh-pages as a source and press on save (if you do not see a gh-pages branch yet you can create one by pushing to master).

After clicking on save you can wait for github to publish your project and provide  you with al link you can share for your demo. Keep in mind that from this point on all pushes to master will result in updates to your online demo environment.
