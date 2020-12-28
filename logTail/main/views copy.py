from django.shortcuts import render
from django.views.generic import View
import os
import time
import json
from django.http import HttpResponse, JsonResponse
import traceback

# Create your views here.
def tag(request):
    return render(request,"main/tag.html")

def home(request):
    return render(request,"main/base.html")


class listrep(View):
    DirObject=None

    def loopDir(self,path,depth,counter,object):
        print("depth" + str(depth))
        print("counter" + str(counter))
        i=0
        if (counter <= depth):
            for el in os.listdir(path):
                if (os.path.isdir(os.path.join(path,el))):
                    if (counter < depth):
                        try:
                            if ( os.listdir(os.path.join(path,el))):
                                object.append({"name":os.path.basename(el), "type": "folder" , "childs": [] })
                                self.loopDir(path=os.path.join(path,el),depth=depth,counter=counter,object=object[i]["childs"]) #
                            else:
                                object.append({"name":os.path.basename(el), "type": "folder" , "childs": None })
                        
                        except PermissionError as e:
                            print("error"+str(e))
                            pass
                        except Exception as e:
                            resp={ "error" : str(e) }
                            return HttpResponse(json.dumps(resp),status=500)
                    else:
                        object.append({"name":os.path.basename(el), "type": "folder" , "childs": None })
                else:
                    object.append({"name":os.path.basename(el), "type": "file" , "childs": None })
                #counter internal loop
                i+=1
            counter+=1
            # Counter object depth
        


    def post(self, request, *args, **kwargs):
        if (request.is_ajax() and request.method == "POST"):
            try:         
                self.DirObject=[]
                ubody=json.loads(request.body.decode("utf-8"))
                path=ubody["path"]
                depth=int(ubody["depth"])

                new_path=""
                counter=0

                if (path == ""):
                    resp={ "error" : "No path entered"}
                    return HttpResponse (json.dumps(resp),status=500)
                if (os.name == 'nt' and path !=''):
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

                if ( new_path !='' and  os.path.exists(new_path)  ):
                    
                    self.loopDir(path=new_path,depth=depth,counter=1,object=self.DirObject)
                    return HttpResponse(json.dumps(self.DirObject,ensure_ascii=False))
                else:
                    resp={ "error" : "Path doesn't existe"}
                    return HttpResponse(json.dumps(resp),status=500)

            except Exception as e : 
                resp={ "error" : str(e) + "\n" }
                return HttpResponse(json.dumps(resp),status=500)



a=PermissionError()
a.errno
