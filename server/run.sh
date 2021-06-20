#!/bin/bash

dos2unix .docker_env
source .docker_env
nohup python manage.py runserver 0.0.0.0:8000 &
cd ../client
dos2unix .docker_env
source .docker_env
npx serve -s build