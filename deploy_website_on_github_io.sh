#!/bin/bash
npm run-script build
cd dist/
git init
git remote add origin git@github.com:tuwarerepo/tuwarerepo.github.io.git
git add -A
git commit -m "New deployment"
git pull --rebase
git push -u origin master -f
