$('#homes').ready(function() {

  $("#main #register").click(function(event) {
    $("#main").toggleClass("hidden",true)
    $("#register1").toggleClass("hidden",false)
  })

  $("#register1 #confirm").click(function(event) {
    var error = ""
    if( $('input[name=token]:checked').val() == undefined)
      error = "choose an initial token";

    if(error == "") {
      $("#register1").toggleClass("hidden",true)
      $("#register2").toggleClass("hidden",false)
    }
    else
      $("#tokenerror").text(error).addClass("bg-warning");
  })

  $('#token-select input[type=radio]').click(function() {
    $('#token-select label').toggleClass('checked', false);
    $("#tokenerror").text("").removeClass("bg-warning bg-success");
    $(this).parent().toggleClass('checked', this.checked);
  });

  $("#register2 #create").click(function(event) {
    var error = ""

    if($("#register2 #passcode").val() != $("#register2 #confirmcode").val())
      error = "passcodes must match"

    if ($("#passcode").val().length < 7)
      error = "Please use at least 7 digits";

    $.each($(".digits"), function(index, elem) {
      if(!$.isNumeric(elem.value))
        error = "Please use digits only (0-9)";
      if(elem.value == "")
        error = "Make sure to fill out all fields";
    })
    if ($("#address").val().length != 5)
     error = "Check your address, it should be 5 digits";

     console.log(error);
    if(error == "") {
      $.post( "/accounts", { useid: $("#address").val(), passcode: $("#passcode").val(), asset: $('input[name=token]:checked').val()} )
        .done(function(data) {
          data = jQuery.parseJSON(data);

          if(data.success) {
            localStorage.setItem("useid",$("#address").val());
            localStorage.setItem("passcode",$("#passcode").val());
            localStorage.setItem("bucket_id",data.bucket_id);

            $( '.digits' ).val('')

            $("#createerror").text("").removeClass("bg-warning");

            location.href = "/accounts/"+localStorage.getItem("useid");
          }
          else {
            event.preventDefault();
            $("#createerror").text(data.message).addClass("bg-warning");
            console.error(data.message);
          }
        });
    }
    else {
      event.preventDefault();
      $("#createerror").text(error).addClass("bg-warning");
      console.error(error);
    }

  });

  $("#main #login").click(function(event) {
    $("#main").toggleClass("hidden",true)
    $("#login1").toggleClass("hidden",false)
  })

  $("#show").click(function() {
    $.get( "/accounts", { flag: "bucket_id", useid: $("#useid").val(), passcode: $("#logincode").val() } )
      .done(function(data) {
        data = jQuery.parseJSON(data);
        console.log(data);

        if(data.success) {
          localStorage.setItem("useid",$("#useid").val());
          localStorage.setItem("passcode",$("#logincode").val());
          localStorage.setItem("bucket_id",data.bucket_id);

          $("#loginerror").text("").removeClass("bg-warning");
          location.href = "/accounts/"+$("#useid").val();
        }else {
          event.preventDefault();
          $("#loginerror").text(data.message).addClass("bg-warning");
          console.error(data.message);
        }
      });
  });
});
