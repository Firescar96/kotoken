$('#homes').ready(function() {
  $("#create").click(function(event) {
    var error = ""

    if($("#createcode1").val() != $("#createcode2").val())
      error = "passcodes must match"
    $.each($(".createcode"), function(index, elem) {
      console.log(elem.value);
      if(!$.isNumeric(elem.value))
        error = "Please enter seven digits as a passcode";
      else if (elem.value.length < 7)
        error = "Please use at least 7 digits";
    });

    if( $('input[name=token]:checked').val() == undefined)
      error = "choose an initial token";

    if(error == "") {
      $.post( "/accounts", { passcode: $("#createcode1").val(), asset: $('input[name=token]:checked').val()} )
        .done(function(data) {
          data = jQuery.parseJSON(data);

          localStorage.setItem("useid",data.useid);
          localStorage.setItem("passcode",data.passcode);
          localStorage.setItem("bucket_id",data.bucket_id);

          $( '#createForm' ).each(function(){
            this.reset();
          });

          $("#createerror").text("").removeClass("bg-warning");

          location.href = "/accounts/"+data.useid;
        });
    }
    else {
      event.preventDefault();
      $("#createerror").text(error).addClass("bg-warning");
      console.error(error);
    }

  });

  $("#login").click(function() {
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

  $('#token-select input[type=radio]').click(function() {
    $('#token-select label').toggleClass('checked', false);
    $("#createerror").text("").removeClass("bg-warning bg-success");
    $(this).parent().toggleClass('checked', this.checked);
  });
});
