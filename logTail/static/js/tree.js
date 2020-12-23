$(function(){
    let tree_objects=[
        { 
        name:"root", childs: [
            { name:"home", childs : undefined },
            { name:"bat", childs : [
                { name:"home", childs : undefined }
                ]
            }
        ]
        },       
        {name:"root2", childs: [
            { name:"home2", childs : undefined },
            { name:"bat2", childs : [
                { name:"home2", childs : undefined }
                ]
            }
        ]
        }
    ];

    
    function createItem(item,parent,counter){
        let indent=6
        
        console.log(counter)
        if (Array.isArray(item)){
            for (var i in item ){
                createItem(item[i],parent,counter)
            }
        }
        else if ( item in tree_objects ) {
            counter++
            if ( item.childs){
                parent.append("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")
                $("#"+item.name+"_"+counter).append("<ul id='"+item.name+"_"+counter+"_ul' ></ul>")
                createItem(item.childs,$("#"+item.name+"_"+counter+"_ul"),counter)
                console.log("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")
            }
            else {
                /* doesn't contain childs */
                parent.append("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")
                console.log("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")
            }
        }
        else if ( item.childs){
            counter++

            parent.append("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")
            $("#"+item.name+"_"+counter).append("<ul id='"+item.name+"_"+counter+"_ul' ></ul>")
            createItem(item.childs,$("#"+item.name+"_"+counter+"_ul"),counter)
            console.log("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")
        }
        else {
            counter++
            parent.append("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")       
            console.log("<li id='"+item.name+"_"+counter+"'>"+item.name+"</li>")         
        }
   
    }

    let c=0
    for (var i in tree_objects){
        createItem( tree_objects[i] , $("#listing"),c)
    }
})