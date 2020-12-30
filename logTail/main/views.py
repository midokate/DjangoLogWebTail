from django.shortcuts import render
from django.views.generic import View
import os
from logTail import settings
import json
from django.http import HttpResponse, JsonResponse
import traceback
import datetime

# Create your views here.
def tag(request):
    return render(request,"main/tag.html")

def home(request):
    return render(request,"main/base.html")


class listrep(View):
    DirObject=None

    def loopDir(self,path,depth,counter,object,elcounter):        
        with_childs=[]
        if (elcounter <= settings.logTail_limit and counter <= depth):
            i=0
            for el in os.listdir(path):
                if (os.path.isdir(os.path.join(path,el))):
                    if (counter < depth):
                        try:
                            if ( os.listdir(os.path.join(path,el))):
                                object.append({"name":os.path.basename(el), "type": "folder" , "childs": [] })
                                elcounter+=1
                                with_childs.append({"path":os.path.join(path,el) ,"index": i})
                                
                                #self.loopDir(path=os.path.join(path,el),depth=depth,counter=counter,object=object[i]["childs"]) #
                            else:
                                object.append({"name":os.path.basename(el), "type": "folder" , "childs": None })
                                elcounter+=1

                        except PermissionError as e:
                            print("error"+str(e))
                            object.append({"name":os.path.basename(el), "type": "folder" , "childs": False })
                            elcounter+=1

                        except Exception as e:
                            resp={ "error" : str(e) }
                            return HttpResponse(json.dumps(resp),status=500)
                        
                    else:
                        object.append({"name":os.path.basename(el), "type": "folder" , "childs": None })
                        elcounter+=1
                else:
                    object.append({"name":os.path.basename(el), "type": "file" , "childs": None })
                    elcounter+=1       
                #counter internal loop
                i+=1
            # Counter object depth
            counter+=1
            if (elcounter <= settings.logTail_limit ):
                for elment in with_childs:
                    self.loopDir(path=elment["path"],depth=depth,counter=counter,object=object[elment["index"]]["childs"],elcounter=elcounter)
        


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
                    try: 
                        os.listdir(new_path)
                    except Exception as e:
                        resp={ "error" : str(e) }
                        return HttpResponse(json.dumps(resp),status=500)
                    finally:
                        self.loopDir(path=new_path,depth=depth,counter=1,object=self.DirObject,elcounter=0)
                        return HttpResponse(json.dumps(self.DirObject,ensure_ascii=False))
            
                else:
                    resp={ "error" : "Path doesn't existe"}
                    return HttpResponse(json.dumps(resp),status=500)

            except Exception as e : 
                resp={ "error" : str(e) + "\n"+ traceback.format_exc() }
                return HttpResponse(json.dumps(resp),status=500)




