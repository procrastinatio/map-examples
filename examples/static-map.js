function init() {

    $('#submit').click(function() {
        var url = $('input[name=url]');
        var data = 'url=' + encodeURIComponent(url.val()) + '&h=350&w=550';
        $.ajax({
            url: "http://radiant-taiga-3006.herokuapp.com/print",
            dataType: 'jsonp',
            jsonp: 'cb',
            timeout: 10000,
            type: "GET",
            data: data,
            cache: false,
            success: function(response, textStatus, jqXHR) {
                $("#printout>img").attr("src", response.image);
                $("#printout>img").attr("width", response.width);
                $("#printout>img").attr("height", response.height);
                $("#printout_url").html($("<div />").text('<img src="http://radiant-taiga-3006.herokuapp.com/print?' + data + '" >').html());
            },
            beforeSend: function() {
                $("#printout").addClass("loading");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + textStatus, errorThrown);
            },
            complete: function() {
                $("#printout").removeClass("loading");
            }
        });
        return false;
    });
}