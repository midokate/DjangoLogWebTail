/*<div class="tag">
<p>java</p> 
 <i class="fas fa-times"></i>
</div>
<input class="bg-light tag-input" type="text">
*/
$(function () { 
    const container=$(".tag-container")
    function createTag(name){
        let div=document.createElement("div")
        div.className="bg-secondary tag"
        let p=document.createElement("p")
        p.innerHTML=name
        let i=document.createElement("i")
        i.setAttribute("class","fas fa-times")
        div.appendChild(p)
        div.appendChild(i)
        tag=$(".tag")
        if (tag.length ==1 ){
            tag.after(div);
        }
        else if (tag.length >1){
            tag[tag.length-1].after(div);
        }
        else{
            container[0].prepend(div)
        }
    }
    
    $(".tag-input").on("keypress", function(e){
        if (e.key === " "){
            return false;
        }
        if (e.key === "Enter" && $(".tag-input").val().trim() !=""){
            createTag($(".tag-input").val().trim())
            $(".tag-input").val("")
        };
    });

});