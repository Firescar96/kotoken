//createClick = () -> $.post( "/accounts/new", { name: "John", time: "2pm" } );
//test = () -> console.log("hello world")

$('document').ready(function() {
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

    if(error == "") {
      $.post( "/accounts", { passcode1: $("#createcode1").val(), passcode2: $("#createcode2").val() } )
        .done(function(data) {
          data = jQuery.parseJSON(data);

          localStorage.setItem("useid",data.useid);
          localStorage.setItem("passcode",data.passcode);
          localStorage.setItem("bucket_id",data.bucket_id);

          location.href = "/accounts/"+data.useid;
        });
    }
    else {
      event.preventDefault();
      alert(error);
      console.error(error);
    }

  });

  $("#login").click(function() {
    $.get( "/accounts", { flag: "bucket_id", useid: $("#useid").val(), passcode: $("#logincode").val() } )
      .done(function(data) {
        data = jQuery.parseJSON(data);

        localStorage.setItem("useid",$("#useid").val());
        localStorage.setItem("passcode",$("#logincode").val());
        localStorage.setItem("bucket_id",data.bucket_id);

        location.href = "/accounts/"+$("#useid").val();
      });
  });
});
