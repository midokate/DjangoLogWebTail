from django.shortcuts import render
from django.views.generic import View
import os
import json
from django.http import HttpResponse;

# Create your views here.
def tag(request):
    return render(request,"main/tag.html")

def home(request):
    return render(request,"main/base.html")


class listrep(View):
    DirObject=None

    def loopDir(self,path,depth,counter,object):

        i=0
        for el in os.listdir(path):
            if (os.path.isdir(os.path.join(path,el))):
                if (os.listdir(os.path.join(path,el))):
                    object.append({"name":os.path.basename(el), "type": "folder" , "childs": [] })
                    self.loopDir(path=os.path.join(path,el),depth=depth,counter=counter,object=object[i]["childs"]) #
                else:
                    object.append({"name":os.path.basename(el), "type": "folder" , "childs": None })
            else:
                object.append({"name":os.path.basename(el), "type": "file" , "childs": None })
            #counter internal loop
            i+=1
        # Counter object depth
        counter+=1


    def post(self, request, *args, **kwargs):
        if (request.is_ajax() and request.method == "POST"):
            self.DirObject=[]
            ubody=json.loads(request.body.decode("utf-8"))
            path=ubody["path"]
            depth=ubody["depth"]

            new_path=""
            counter=0
            if (os.name == 'nt'):
                for el in path.split("/"):
                    if (counter==0):
                        pass
                    if (path[0]=="/" and counter==1):
                        new_path=el+":\\"
                    else:
                        new_path=os.path.join(new_path,el)
                    counter+=1
            else:
                new_path=path

            if ( new_path !='' and os.path.exists(new_path)  ):
                
                self.loopDir(path=new_path,depth=depth,counter=0,object=self.DirObject)
                return HttpResponse(json.dumps(self.DirObject,ensure_ascii=False))
            else:
              return HttpResponse("{ 'error': 'Path doesn't existe' }")


