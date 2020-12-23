from django.shortcuts import render

# Create your views here.
def tag(request):
    return render(request,"main/tag.html")

def home(request):
    return render(request,"main/base.html")