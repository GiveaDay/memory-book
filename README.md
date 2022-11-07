# Memory book

Open source repo for creating books for long lasting memories. Support for image, audio and video.

You can find some documentation on the [wiki](https://github.com/GiveaDay/memory-book/wiki)

## Getting started

If you want to run the code locally, execute the following steps:

### Install dependencies

Download and install [nodejs](https://nodejs.org/) on your machine. This code requires at least version 16.16. Install [yarn](https://yarnpkg.com/).

From the root directory of this repository, run:

```shell
cd src/backend
yarn install
cd ../frontend
yarn install
```

### Create configuration file

In the `data` folder, copy the `.env.example` file to `.env` and modify the configuration properties in this file

### Run migrations

Go to the `src/backend` folder and run `yarn run-database-migrations`.

### Run the site

Go to the `code/backend/src` folder and run `yarn dev`. Then open your browser and visit [http://localhost:3030](http://localhost:3030).

This project does not have automatic code reload (for now). If you modify code in the frontend you'll have to refresh the site. If you modify code in the
backend you'll have to restart the backend.

## Contributing

IMPORTANT! Limit the number of dependencies
