#!/bin/sh
python manage.py collectstatic --noinput&&python manage.py migrate --noinput&&/usr/local/bin/gunicorn design_compare.wsgi:application --reload -w 2 -b :8000 --timeout 600
