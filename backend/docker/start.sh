#!/bin/bash
set -e

php-fpm &

# php-fpm の起動を少し待つ
sleep 2

php artisan config:cache
php artisan migrate --force
php artisan storage:link

nginx -g "daemon off;"
