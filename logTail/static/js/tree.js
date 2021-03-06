$(function(){
    /*
        This is an example of data that must be sent by the backend server
    */
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
//tooltip activation
$('[data-toggle="tooltip"]').tooltip()

//functien trigered when an item is clicked ==> add color primary to list items and toggle hide/show subfolders
    function itemClicked(){
        $(".listing-container  li > div").off().on("click",function(){ 
            if ($(this).children("i:first-child").hasClass("permision_ok") ){
                ulelment=$("[path='"+$(this).parent("li").attr("path")+"']").find("ul")   
                //ajaxGetChildren($("#"+$(this).parent("li").attr("id")+"_ul"),$(this).parent("li").attr("path"),1,0)
                if ($(this).parent("li").attr("ftype")==="file"){
                    $(".listing-container  ul,li div.bg-primary").removeClass("bg-primary");
                    $(this).addClass("bg-primary");  
                }
                else if (ulelment.is(':visible')){
                    $("[path='"+$(this).parent("li").attr("path")+"'] > ul").hide()
                }
                else {
                    $(".listing-container  ul,li div.bg-primary").removeClass("bg-primary");
                    $(this).addClass("bg-primary");
                    $(this).parent("li").find("ul").remove()
                    $(".loader").show()
                    $(this).parent("li").append("<ul level='"+$(this).parent("li").attr("level")+"_ul' ></ul>")
                    ajaxGetChildren($("[path='"+$(this).parent("li").attr("path")+"'] > ul"),$(this).parent("li").attr("path"),parseInt($(this).parent("li").attr("level").match(/(\d+)$/)[0])+1,parseInt($(this).parent("li").attr("level").match(/(\d+)$/)[0]))
                    $("[path='"+$(this).parent("li").attr("path")+"'] > ul").show() 
                }
                itemClicked()
            
            }

            //console.log(this.parentElement.find("ul"))
            //this.parent().find("ul").slideToggle()
        });
    }
    
// function to create list item , recursive function called by th function bellow : drawTree()
    function createItem(item,parent,counter,depth,path){
        // when childs true the parent object is an empty array : loop throught its elements
        //counter++
        console.log(counter)
        if ( Array.isArray(item)  && counter <= depth  ){
            for (let i in item ){
                createItem(item[i],parent,counter,depth,path)
            }
        }

        // else if ( item.childs in tree_objects &&  counter <= depth  ) {
        //     counter++
        //     if ( item.childs ){
        //         parent.append("<li ftype='"+item.type+"'  path="+path+"' id='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"/div></li>")
        //         $("[id='"+item.name+"_"+counter+"']").append("<ul id='"+item.name+"_"+counter+"_ul' ></ul>")
        //         createItem(item.childs,$("[id='"+item.name+"_"+counter+"_ul']"),counter,depth,path)
        //     }
        //     else {
        //         if(item.childs===false){
        //             parent.append("<li   ftype='"+item.type+"' path='"+path+"' id='"+item.name+"_"+counter+"'><div data-toggle=\"tooltip\" data-placement=\"top\" title=\"Permission denied\" ><i class=\" permision_ko fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
        //         }
        //         else{
        //              /* doesn't contain childs */
        //             parent.append("<li  ftype='"+item.type+"' path='"+path+"' id='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
        //         }
        //     }
        // }
        else if (  item.childs && counter <= depth ){
            lpath=path+"/"+item.name
            counter++
            parent.append("<li ftype='"+item.type+"'  path='"+lpath+"' level='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
            $("[path='"+lpath+"']").append("<ul level='"+item.name+"_"+counter+"_ul' ></ul>")
            createItem(item.childs,$("[path='"+lpath+"'] > ul"),counter,depth,lpath)
        }
        else {
            if (counter <= depth){
                if (item.childs === false) {
                    counter++
                    lpath=path+"/"+item.name
                    parent.append("<li ftype='"+item.type+"' path='"+lpath+"' level='"+item.name+"_"+counter+"'><div data-toggle=\"tooltip\" data-placement=\"top\" title=\"Permission denied\" ><i class=\"permision_ko fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")
                }
                else {
                    counter++
                    lpath=path+"/"+item.name
                    parent.append("<li ftype='"+item.type+"' path='"+lpath+"' level='"+item.name+"_"+counter+"'><div><i class=\"permision_ok fas fa-"+item.type +"\"></i>"+item.name+"</div></li>")               
                }
            }
        }
        itemClicked()
    }

    function drawTree(object,parent,path,depth,counter){
        parent.empty()
        for (var i in object){
            //createItem( object[i] , $("#listing"),c,d,"")
            createItem( object[i] , parent ,counter,depth,path)
            //$("#path").val()
        }
    }

    function ajaxGetChildren(parent,path,depth,counter){
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
            timeout: 60000, //30 secondes
            data: JSON.stringify({
                path: path,
                depth: depth,
            }),
            success: function (response) {
                let jresult=JSON.parse(JSON.stringify(response))
                drawTree(jresult,parent,path,depth,counter)

                $(".loader").hide()
                console.log(jresult)
            },
            error: function(response,textstatus){
                console.log(textstatus)
                console.log(response)
                if (["timeout","abort","parsererror","errorThrown"].includes(textstatus)){
                    $(".loader").hide()
                    $('#error_modal  div.modal-body').empty()
                    $('#error_modal  div.modal-body').append("<p> An error occured <br> please check your connection or try later </p>")
                    $('#error_modal').modal('show')
                }
                else {
                    try {
                    itemClicked()
                    let sresult=response.responseText
                    let jresult=JSON.parse(sresult)
                    $(".loader").hide()
                    $('#error_modal  div.modal-body').empty()
                    $('#error_modal  div.modal-body').append("<p>"+jresult.error+"</p>")
                    $('#error_modal').modal('show')
                    console.log(sresult)
                    console.log(JSON.parse(sresult))
                    } catch (e) {
                        $(".loader").hide()
                        $('#error_modal  div.modal-body').empty()
                        $('#error_modal  div.modal-body').append("<p> Unknown error ! </p>")
                        $('#error_modal').modal('show')
                    }
                }
            }
        });
    }

    $("#go-button").on("click",function(){
        $(".loader").show()
        path=$("#path").val()
        depth=$("#depth").val()
        ajaxGetChildren($("#listing"),path,depth,0)
    })

})