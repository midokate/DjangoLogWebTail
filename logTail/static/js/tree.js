$(function(){
    let tree_objects=[
        { 
        name:"root", type: "folder", childs: [
            { name:"mehdi",type: "file", childs : undefined },
            { name:"home",type: "file", childs : undefined },
            { name:"bat", type: "folder" ,childs : [
                { name:"home", type: "folder", childs : undefined }
                ]
            }
        ]
        },       
        {name:"root2", type: "folder", childs: [
            { name:"home2",type: "file", childs : undefined },
            { name:"bat2", type: "folder", childs : [
                { name:"home2",type: "file", childs : undefined }
                ]
            }
        ]
        }
    ];
//tooltip
$('[data-toggle="tooltip"]').tooltip()

    function itemClicked(){
        $(".listing-container  li > div").off().on("click",function(){ 
            if ($(this).children("i:first-child").hasClass("permision_ok")){
                $(".listing-container  ul,li div.bg-primary").removeClass("bg-primary");
                $(this).addClass("bg-primary");
                $(this).siblings("ul").toggle()
            }

            //console.log(this.parentElement.find("ul"))
            //this.parent().find("ul").slideToggle()
        });
    }
    
    function createItem(item,parent,counter,depth,path){  

        if ( Array.isArray(item)  && counter <= depth  ){
            for (let i in item ){
                createItem(item[i],parent,counter,depth,path)
            }
        }
        else if ( item.childs in tree_objects &&  counter <= depth  ) {
            counter++
            if ( item.childs ){
                parent.append("<li ftype='"+item.type+"'  path="+path+"' id='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"/div></li>")
                $("[id='"+item.name+"_"+counter+"']").append("<ul id='"+item.name+"_"+counter+"_ul' ></ul>")
                createItem(item.childs,$("[id='"+item.name+"_"+counter+"_ul']"),counter,depth,path)
            }
            else {
                if(item.childs===false){
                    parent.append("<li   ftype='"+item.type+"' path='"+path+"' id='"+item.name+"_"+counter+"'><div data-toggle=\"tooltip\" data-placement=\"top\" title=\"Permission denied\" ><i class=\" permision_ko fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
                }
                else{
                     /* doesn't contain childs */
                    parent.append("<li  ftype='"+item.type+"' path='"+path+"' id='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
                }
            }
        }
        else if (  item.childs && counter <= depth ){
            counter++
            parent.append("<li ftype='"+item.type+"'  path='"+path+"' id='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
            $("[id='"+item.name+"_"+counter+"']").append("<ul id='"+item.name+"_"+counter+"_ul' ></ul>")
            createItem(item.childs,$("[id='"+item.name+"_"+counter+"_ul']"),counter,depth,path)
        }
        else {
            if (counter <= depth){
                if (item.childs === false) {
                    parent.append("<li ftype='"+item.type+"' path='"+path+"' id='"+item.name+"_"+counter+"'><div data-toggle=\"tooltip\" data-placement=\"top\" title=\"Permission denied\" ><i class=\"permision_ko fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
                }
                else {
                    parent.append("<li ftype='"+item.type+"' path='"+path+"' id='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")               
                }
            }
        }
        itemClicked()
    }

    function drawTree(object){
        let c=0
        let d=$("#depth").val()
        $("#listing").empty()
        for (var i in object){
            createItem( object[i] , $("#listing"),c,d,"")
        }
    }

b=null
    $("#go-button").on("click",function(){
        $(".loader").toggle()
        path=$("#path").val()
        depth=$("#depth").val()
        $.ajaxSetup({ 
            beforeSend: function(xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            } 
       });

        $.ajax({
            type: "POST",
            url: "listrep",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                path: path,
                depth: depth,
            }),
            success: function (response) {
                let jresult=JSON.parse(JSON.stringify(response))
                drawTree(jresult)
                $(".loader").toggle()
                console.log(jresult)
            },
            error: function(response){
                let sresult=response.responseText
                let jresult=JSON.parse(sresult)
                $(".loader").toggle()
                $('#error_modal  div.modal-body').empty()
                $('#error_modal  div.modal-body').append("<p>"+jresult.error+"</p>")
                $('#error_modal').modal('show')
                console.log(sresult)
                console.log(JSON.parse(sresult))
            }
        });
    })

})