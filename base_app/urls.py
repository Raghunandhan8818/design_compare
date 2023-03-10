from django.urls import path
from base_app.views import *

urlpatterns = [
    path('main/', main, name="main"),
    path('index/', render_index, name="index"),
    path('image_search/', image_search, name="image-search"),
]
