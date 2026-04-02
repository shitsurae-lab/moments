#!/bin/bash
set -e

php-fpm &

sleep 2

php artisan config:cache
php artisan migrate:fresh --force
php artisan storage:link

nginx -g "daemon off;"
