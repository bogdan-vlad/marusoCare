<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD033 -->

# Tuware Website

## Setup

1. `git clone https://github.com/tuwarerepo/tuware-website2.git`   or   `git clone git@github.com:tuwarerepo/tuware-website2.git`
2. `cd tuware-website2`
3. `nvm install lts/erbium` or `nvm use`
4. `npm install`
5. `git submodule init && git submodule update`
6. `npm start` (to run development environment)

### Virtual environment

1. `mkvirtualenv -p python3.7 tuware-website-2020`

Add these lines to `.virtualenvs/tuware-website-2020/bin/postactivate` and replace `[PATH_TO_YOUR_REPOSITORY]` with the path

    export FLASK_APP="main.py"
    export FLASK_ENV="development"
    export FLASK_CONFIG="development"
    export FLASK_RUN_PORT="8080"
    export CLOUDSDK_PYTHON="`which python3.7`"
    export PRIMARY_BRAND="tuware"
    export ALLOW_CONFIG_OVERRIDE="true"
    export GOOGLE_APPLICATION_CREDENTIALS="[PATH_TO_YOUR_REPOSITORY]/tuware-website-2020/tuware-google-service-account-credentials.json"
    export SECRET_KEY="8GphcNUsgkGfMKVS8876AkKypDNTbFQrfnGKzSZEZMpcArVzx2xwwzfA4RnyjCxvVdnhvt"
    export GAE_USE_SOCKETS_HTTPLIB="anyvalue"

Make sure you've downloaded Google Service Account Credentials.

2. `deactivate`
3. `workon tuware-website-2020`
4. `pip install -r requirements.txt`
5. `pip install -r requirements.txt -t lib/`

## Node setup

ONLY if cleaning is necessary:

1. `npm cache clean --force`
2. `rm -r node_modules/`
3. `rm package-lock.json`

Default installation process:

1. `nvm install lts/erbium` or `nvm use`
2. `npm install`
3. `npm audit fix`
4. `npm run-script build`

## Building for Github.io

1. `npm run-script build`

Add code changes in the **dist/** directory and push to remote

## Deploying to Google App Engine

`gcloud app deploy`
