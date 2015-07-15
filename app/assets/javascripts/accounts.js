$("#accounts").ready(function() {
  var brickAsset = "AaLWdxW4mCB4Z7i2nW5ocgM6cT7jWEybcD"
  var steakAsset = "AVBLsxjac7LCYxiXcMnUAricYxVq1YgbkZ"
  var bitcoinAsset = "AL9VwZMgDQ2bqLXorU2bJoiMu3MjamZQFm"
  var phoneAsset = "AcPeTwYT5s2xJmXpDCuMr3JWGvJ9vEMkNF"

  $("#send-token").click(function(event) {
    $("#status-page").toggleClass("hidden",true)
    $("#token-page").toggleClass("hidden",false)
  })

  $('#uid').text(localStorage.getItem("uid"))

  var updatePage = function(){
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

    $.get( "/accounts", {flag: "transactions", bucket_id: localStorage.getItem("bucket_id") })
      .done(function(data) {
        data = JSON.parse(data);
        $.each(data, function(index, transaction) {
          console.log(transaction);
          $("#transaction-history tbody").html(
            "<tr> \
              <td>"+transaction["from"]+"</td> \
              <td>"+transaction["to"]+"</td> \
              <td>"+transaction["asset"]+"</td> \
            </tr>"
          )
        })
      })
  }
  updatePage();
  setInterval(updatePage, 1000);

  $('input[type=radio]').click(function() {
    $('#token-select label').toggleClass('checked', false);
    $("#transaction-result").text("").removeClass("bg-warning bg-success");
    $(this).parent().toggleClass('checked', this.checked);
  });

  $("#make-transaction").click(function() {
    var error = "";
    if(!$.isNumeric($("#toid").val()))
      error = "receiving address must be numeric";

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
      if(data.success) {
        $("#transaction-result").text("Success").removeClass("bg-warning").addClass("bg-success");
        $('#token-select label').toggleClass('checked', false);
        $("#toid").val("");

        $("#token-page").toggleClass("hidden",true)
        $("#status-page").toggleClass("hidden",false)
      }
      else
        $("#transaction-result").html(data.message).removeClass("bg-success").addClass("bg-warning");
    });

  })
});
