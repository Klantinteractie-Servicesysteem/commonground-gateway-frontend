# Common Ground Gateway GUI

The Common Ground Gateway GUI makes spinning up a Common Ground API interface easy.

Follow the installation instructions below and make sure the backend is connected.

The application is available in two versions, a Next.js version, and a Gatsby version. We recommend the Gatsby version with deployment through Gatsby pages to deploy your prototype without setting up a server.

## Getting started

To set up your own project, you will need a GitHub account and be logged in. Simply click on the "use this template" button. Tell GitHub where you want to spin up your prototype and click "create a repository from template".

## Spinning up your environment

You will need Node.js (with NPM) or Yarn installed on your machine for this part of the tutorial.

To develop locally, clone your new repository to your local machine. Open the terminal, navigate to the folder containing your repository, and start up Gatsby or Next.js in development mode with the following commands.

**Nextjs**

"`cli
$ yarn install
$ yarn dev

```

**Gatsby**

"`cli
$ npm install
$ npm run develop
```

After Yarn has successfully set up your dev environment, navigate to [http://localhost:3000/](http://localhost:3000/) on Next.js or to [http://localhost:8000/](http://localhost:8000/) for Gatsby and see the same application as on
[https://conductionnl.github.io/nl-design-skeleton-gatsby/](https://conductionnl.github.io/nl-design-skeleton-gatsby/). Feel free to open up your project code and make some changes. You should see the changes in your development environment instantaneously due to hot-reloading.

## Publishing your prototype to the internet.

The Gatsby version of the skeleton application has build-in support for GitHub pages, meaning you can build your application into a static website and publish it as a GitHub page. The skeleton repository comes with a build-in GitHub action for publishing itself as a GitHub page. You can have your prototype automatically published to the internet on a code push this way.

You need to activate GitHub pages on your repository for this to work. Go to your repository's settings, go to pages, select `gh-pages` as a source, and save (if you do not see a gh-pages branch, you can create one by pushing to main).

After saving, wait for GitHub to publish your project and provide you with a link you can share for your demo. Keep in mind that all pushes to main will result in updates to your online demo environment from this point on.

> Nextjs does not have the same support for hosting on GitHub pages as Gatsby, but if you are looking for the option, you can find more info [here](https://github.com/gregrickaby/nextjs-github-pages. Besides GitHub pages, the easier way to deploy Nextjs is probably through [Vercel](https://nextjs.org/docs/deployment)
