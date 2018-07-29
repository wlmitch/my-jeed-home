#!/bin/bash

touch /tmp/dependency_mjh_in_progress
echo 0 > /tmp/dependency_mjh_in_progress

echo 'Try to NodeJS'
sudo apt-get install -y nodejs
echo 50 > /tmp/dependency_mjh_in_progress

echo 'Try to install node modules'
cd ../node/
sudo rm -rf node_modules
sudo npm install

echo 100 > /tmp/dependency_mjh_in_progress
rm /tmp/dependency_mjh_in_progress
