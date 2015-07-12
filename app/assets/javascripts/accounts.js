$("#accounts").ready(function() {
  var brickAsset = "AaLWdxW4mCB4Z7i2nW5ocgM6cT7jWEybcD"
  var steakAsset = "AVBLsxjac7LCYxiXcMnUAricYxVq1YgbkZ"
  var bitcoinAsset = "AL9VwZMgDQ2bqLXorU2bJoiMu3MjamZQFm"
  var phoneAsset = "AcPeTwYT5s2xJmXpDCuMr3JWGvJ9vEMkNF"

  $("#send-token").click(function(event) {
    $("#status-page").toggleClass("hidden",true)
    $("#token-page").toggleClass("hidden",false)
  })

  $('#useid').text(localStorage.getItem("useid"))

  var updateBalance = function(){
    $.get( "/accounts", {flag: "balance", bucket_id: localStorage.getItem("bucket_id")})
      .done(function(data) {
        data = JSON.parse(data);
        $.each(data, function( index, asset) {
          switch(asset.asset_id) {
            case brickAsset:
              $("#brickAmt").text(asset.confirmed)
              break;
            case steakAsset:
              $("#steakAmt").text(asset.confirmed)
              break;
            case bitcoinAsset:
              $("#bitcoinAmt").text(asset.confirmed)
              break;
            case phoneAsset:
              $("#phoneAmt").text(asset.confirmed)
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

  $("#make-transaction2").click(function() {
    var error = "";
    if(!$.isNumeric($("#toid2").val()))
      error = "recieving address must be numeric";

    if( $('input[name=token]:checked').val() == undefined)
      error = "select a token to send";

    if(error != "") {
      $("#transaction-result2").text(error).removeClass("bg-success").addClass("bg-warning");
      console.error(error);
      return;
    }
    $.post('/accounts', {
      flag: "transaction",
      bucket_id: localStorage.getItem("bucket_id"),
      asset: $('input[name=token]:checked').val(),
      toid: $("#toid2").val()
    })
    .done(function(data) {
      data = JSON.parse(data);
      console.log(data.message);
      if(data.success) {
        $("#transaction-result2").text("Success").removeClass("bg-warning").addClass("bg-success");
        $('#token-select label2').toggleClass('checked', false);
        $("#toid2").val("");

        $("#token-page").toggleClass("hidden",true)
        $("#status-page").toggleClass("hidden",false)
      }
      else
        $("#transaction-result2").html(data.message).removeClass("bg-success").addClass("bg-warning");
    });

  })
});
