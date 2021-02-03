from django.urls import path
from . import views

urlpatterns = [
    path('tag',views.tag ,name='tag'),
    path('',views.home ,name='home'),
    path('listrep',views.listrep.as_view() ,name='listrep'),
    path('tailfile',views.tailfile.as_view() ,name='tailfile'),
]
