$("#accounts").ready(function() {
  var brickAsset = "AaLWdxW4mCB4Z7i2nW5ocgM6cT7jWEybcD"
  var steakAsset = "AVBLsxjac7LCYxiXcMnUAricYxVq1YgbkZ"
  var bitcoinAsset = "AL9VwZMgDQ2bqLXorU2bJoiMu3MjamZQFm"
  var phoneAsset = "AcPeTwYT5s2xJmXpDCuMr3JWGvJ9vEMkNF"

/*  $('#brick').click(function() {
    $('label[for=brick]').css("box-shadow", "inset 3px 2px #f00")
    $('label[for=steak]').css("box-shadow", "inset 3px 2px #f00")
    $('label[for=bitcoin]').css("box-shadow", "inset 3px 2px #f00")
    $('label[for=phone]').css("box-shadow", "inset 3px 2px #f00")
  })
*/
  $('#useid').text(localStorage.getItem("useid"))

  var updateBalance = function(){
    $.get( "/accounts", {flag: "balance", bucket_id: localStorage.getItem("bucket_id")})
      .done(function(data) {
        data = JSON.parse(data);
        $.each(data, function( index, asset) {
          switch(asset.asset_id) {
            case brickAsset:
              $("#brickAmt").text(asset.total)
              break;
            case steakAsset:
              $("#steakAmt").text(asset.total)
              break;
            case bitcoinAsset:
              $("#bitcoinAmt").text(asset.total)
              break;
            case phoneAsset:
              $("#phoneAmt").text(asset.total)
              break;
            default:
              break;
          }
        });
      });
  }
  updateBalance();
  setInterval(updateBalance, 10000);

  $('input[type=radio]').click(function() {
    $('#token-select label').toggleClass('checked', false);
    $("#transaction-result").text("").removeClass("bg-warning bg-success");
    $(this).parent().toggleClass('checked', this.checked);
  });

  /*$("input[placeholder]").each(function () {
    $(this).css('min-width', $(this).attr('placeholder').length);
  });*/

  $("#make-transaction").click(function() {
    var error = "";
    if(!$.isNumeric($("#toid").val()))
      error = "recieving address must be numeric";

    if( $('input[name=token]:checked').val() == undefined)
      error = "select a token to send";

    if(error != "") {
      $("#transaction-result").text(error).removeClass("bg-success").addClass("bg-warning");
      console.error(error);
      return;
    }
    $.post('/accounts', {
      flag: "transaction",
      bucket_id: localStorage.getItem("bucket_id"),
      asset: $('input[name=token]:checked').val(),
      toid: $("#toid").val()
    })
    .done(function(data) {
      data = JSON.parse(data);
      console.log(data.message);
      if(data.success) {
        $("#transaction-result").text("Success").removeClass("bg-warning").addClass("bg-success");
        $('#token-select label').toggleClass('checked', false);
        $("#toid").val("");
      }
      else
        $("#transaction-result").html(data.message).removeClass("bg-success").addClass("bg-warning");
    });

  })
});
