$(function() {
    let outputItem=$("#tail-ouput");
    stopAjaxGetLine=false;
    console.log("clicked");
    scrolDown=true;
    tailRunning=false
    cancel=false;
    function error(msg){
        $('#error_modal  div.modal-body').empty()
        $('#error_modal  div.modal-body').append("<p>"+msg+"</p>")
        $('#error_modal').modal('show')
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      

    async function ajaxGetLine(path,position){

        console.log(path)
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
                if (scrolDown) {$('.tail-container').animate({scrollTop: $('.tail-container').prop("scrollHeight") },'50')}
            },
            error: function(response,textstatus){
                stopAjaxGetLine=true
                $('#stop-button').hide()
                $('#cancel-button').hide()
                $('#continue-button').show();
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
        if ( cancel ) {
            error("tail canceled")
            tailRunning=false
            cancel=false
            console.log("canceld end")
        }
        else {
            console.log("no canceld loop")
            if (!stopAjaxGetLine ) { await sleep(2000)} ;

            while (stopAjaxGetLine  ){
                await sleep(2000);
            }

            if (! stopAjaxGetLine && path===$("div.bg-primary").parent("li")[0].getAttribute("path")  ){
                ajaxGetLine(path,position);
                }
        }
    }
    if ($('#stop-button').length === 0 ) { $('#tail-button').before(`<button  style='display: none;' display=none id="stop-button" type="button" class="ml-auto mr-0 col-3 btn btn-primary text-white">Stop </button>`) }
    if ($('#continue-button').length === 0 ) { $('#tail-button').before(`<button style='display: none;' id="continue-button" type="button" class="ml-auto mr-0 col-3 btn btn-success text-white">continue </button>`)}
    if ($('#cancel-button').length === 0 ) { $('#tail-button').before(`<button  style='display: none;' display=none id="cancel-button" type="button" class="ml-auto mr-0 col-3 btn btn-danger text-white">cancel </button>`) }
    $('#tail-button').on("click",function () {
        if ( ! tailRunning )
            {
                tailRunning=true
                outputItem.empty()
                if ($(".listing-container  ul,li div.bg-primary").parent("li").length !=0 ){
                console.log("clicked")
                $('#stop-button').show();
                $('#cancel-button').show();
                if ($('#continue-button').is(":visible")){ $('#continue-button').toggle();}
                stopAjaxGetLine=false
                $('#stop-button').off().on("click",function () { 
                        stopAjaxGetLine=true ;
                        //$('#continue-button').toggle()
                        $('#continue-button').toggle();
                        $('#cancel-button').toggle();
                        $('#stop-button').toggle();
                        });
                $('#cancel-button').off().on("click",function () { 
                        error("canceling ...")
                        cancel=true ;
                        console.log("canceld clicked")
                        //$('#continue-button').toggle()
                        $('#cancel-button').hide();
                        $('#continue-button').hide();
                        $('#stop-button').hide();
                        });
                $('#continue-button').off().on("click",function(){
                        stopAjaxGetLine=false ;
                        //$('#continue-button').toggle()
                        $('#continue-button').toggle();
                        $('#cancel-button').toggle();
                        $('#stop-button').toggle();
                });
                
                let selectedItem=$("div.bg-primary").parent("li")[0]
                console.log(selectedItem.getAttribute('path'))
                ajaxGetLine(selectedItem.getAttribute('path'),-1)
                $(".do-tail.fa-arrow-down").addClass("fa-ban")
                $(".do-tail.fa-arrow-down").removeClass("fa-arrow-down")
                scrolDown=true
                }
                else {
                    error("No field selected")
                }
            }

        else { error("Youre tailing a file , please click on stop <br> and click on tail again") }
    })

    $('.do-tail').on("click",function (){
        $(this).toggleClass("fa-arrow-down");
        $(this).toggleClass("fa-ban");
        scrolDown=scrolDown ? false:true;
        if (scrolDown) {
            $('.tail-container').animate({scrollTop: $('.tail-container').prop("scrollHeight") },'50')
        }
    });
}
)