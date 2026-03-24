# Peace Observatory Frontend
Frontend project for the Peace Observatory website.

## Tags
TODO: create release tags

## Documentation
Documentation stored at [Google Drive](https://drive.google.com/drive/folders/1xWZbJeOEBoa0WPOPdf6tIjtc4Jo8HVg-?usp=drive_link).

## Development
Make sure to have ```node@v19.0.1``` installed.
- ```node```: how to install using
    - [brew](https://formulae.brew.sh/formula/node)
    - [linux](https://linuxconfig.org/how-to-install-node-js-on-linux)
    - 
    - 

### Environment Setup
Create .env.local file in the root of the project and add the following:

REACT_APP_BASE_URL=https://your-api-base-url.com

Replace https://your-api-base-url.com with the actual base URL for your API.

### Production (Live Server):
Make sure the same REACT_APP_BASE_URL environment variable is configured on the live server (e.g., in your hosting platform's environment settings .env file).

### Manual Start up

Navigate into the folder ```peace-observatory-frontend``` in your terminal or shell. \
If you start the project for the first time, install all necessary packages:
```
npm install
```
To start the app in development mode, run:
```
npm run start
```
You can view it in your browser at [http://localhost:3000](http://localhost:3000).



If you want to run your frontend against the locally hosted backend, you also need to start **the fastAPI backend project**: see [here](https://github.com/stedi22/peace-observatory-backend) and change the two ```BASE_URL```s in files ```peace-observatory-frontend/src/backend/queryBackend.js``` and ```peace-observatory-frontend/src/components/ConflictExplorer/utils/queryBackend.js``` to ```DEV_URL```. Remember to not push those changes to the main branch, as the live application needs to query the hosted backend at ```PROD_URL```.

## Deployment

The application is hosted at [digitalOcean](https://cloud.digitalocean.com/apps/19389e58-0bb0-4e40-9cb8-0b698e32299d/overview).

To deploy your changes, push your updates to GitHub and merge them into the main branch.
Any changes on the main branch trigger a new build and deploy on digitalOcean.