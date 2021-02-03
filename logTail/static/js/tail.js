$(function() {
    let outputItem=$("#tail-ouput");
    stopAjaxGetLine=false
    console.log("clicked")
    function error(msg){
        $('#error_modal  div.modal-body').empty()
        $('#error_modal  div.modal-body').append("<p>"+msg+"</p>")
        $('#error_modal').modal('show')
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      

    async function ajaxGetLine(path,position){
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
            url: "tailfile",
            contentType: "application/json",
            dataType: "json",
            timeout: 60000, //30 secondes
            data: JSON.stringify({
                path: path,
                position: position,
            }),
            success: function (response) {
                let jresult=JSON.parse(JSON.stringify(response))
                content=jresult.content
                position=jresult.position
                outputItem.append(content);
            },
            error: function(response,textstatus){
                if (["timeout","abort","parsererror","errorThrown"].includes(textstatus)){
                    $(".loader").hide()
                    $('#error_modal  div.modal-body').empty()
                    $('#error_modal  div.modal-body').append("<p> An error occured <br> please check your connection or try later </p>")
                    $('#error_modal').modal('show')
                }
                else {
                    try {
                    itemClicked()
                    let sresult=response.responseJson;
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

        while (stopAjaxGetLine){
            await sleep(6000);
        }

        if (! stopAjaxGetLine ){
            await sleep(6000);
            ajaxGetLine(path,position);
        }
        
    }
    if ($('#stop-button').length === 0 ) { $('#tail-button').before(`<button  style='display: none;' display=none id="stop-button" type="button" class="ml-auto mr-0 col-3 btn btn-primary text-white">Stop </button>`) }
    if ($('#continue-button').length === 0 ) { $('#tail-button').before(`<button style='display: none;' id="continue-button" type="button" class="ml-auto mr-0 col-3 btn btn-success text-white">continue </button>`)}
    $('#tail-button').on("click",function () {
        outputItem.empty()
        if ($(".listing-container  ul,li div.bg-primary").parent("li").length !=0 ){
        console.log("clicked")
        $('#stop-button').toggle();
        if ($('#continue-button').is(":visible")){ $('#continue-button').toggle();}
        stopAjaxGetLine=false
        $('#stop-button').on("click",function () { 
                stopAjaxGetLine=true ;
                //$('#continue-button').toggle()
                $('#continue-button').toggle();
                $('#stop-button').toggle();
                });
        $('#continue-button').on("click",function(){
                stopAjaxGetLine=false ;
                //$('#continue-button').toggle()
                $('#continue-button').toggle();
                $('#stop-button').toggle();
        });
        
        let selectedItem=$("div.bg-primary").parent("li")[0]
        console.log(selectedItem.getAttribute('path'))
        ajaxGetLine(selectedItem.getAttribute('path'),-1)
        }
        else {
            error("No field selected")
        }
        
    })
}
)