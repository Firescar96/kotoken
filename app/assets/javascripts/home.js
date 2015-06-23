//createClick = () -> $.post( "/accounts/new", { name: "John", time: "2pm" } );
//test = () -> console.log("hello world")

$('document').ready(function() {
  $("#create").click(function() {
    $.post( "/accounts", { passcode1: $("#createcode1").val(), passcode2: $("#createcode2").val() } )
      .done(function(data) {
        data = jQuery.parseJSON(data);
        $.get("/accounts/"+data.useid,{ passcode: data.passcode})
          .done(function(data) {
            var newDoc = document.open("text/html", "replace");
            newDoc.write(data);
            newDoc.close();
          });
      });
  });
});
