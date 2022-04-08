/**
** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
** farma ledger supply chain network
**  Author: Brian Wu
** JS for manufacturer web appication
**/

//juery语法
$(document).ready(function(){
    //make sure change to your own machine ip or dmain url
    var urlBase = "http://127.0.0.1:8080/admin";
    // var urlBase = "http://your-ip:30000";
     var tabs =["addToWallet", "makeEquipment", "query", "queryHistory"];
     $("#queryResult").hide();
     $("#addToWalletLink").click(function(){
       showTab("addToWallet");
     });
   $("#makeEquipmentLink").click(function(){
     showTab("makeEquipment");
   });
   $("#queryLink").click(function(){
       showTab("query");
   });
   $("#queryHistoryLink").click(function(){
       showTab("queryHistory");
   });
 $("#active").click(function(){
   alert("======activeButton Running======");
   var url = urlBase+"/account/activeAccount";
   alert(url);
   $.ajax({
     type: 'POST',
     url: url,
     data: {
         userName: $('#account-username').val(), 
         role: $('#account-role').val()
     },
     success: function(data, status, jqXHR){
    //    console.log(data);
       if(status==='success'){
         alert("active "+userName+" successfully");
       }
       showTab("makeEquipment");
     },
     error: function(xhr, textStatus, error){
         console.log(xhr.statusText);
         console.log(textStatus);
         console.log(error);
         alert("Error: "+ xhr.responseText);
     }
   });
   return false;
 });

 $("#init").click(function(){
    alert("======initButton Running======");
    var url = urlBase+"/account/initAccount";
    alert(url);
    $.ajax({
      type: 'POST',
      url: url,
      data: {
        userName: $('#account-username').val(), 
        role: $('#account-role').val()
    },
      success: function(data, status, jqXHR){
        // console.log(data);
        if(status==='success'){
          alert("init "+userName+" successfully");
        }
        showTab("makeEquipment");
      },
      error: function(xhr, textStatus, error){
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
          alert("Error: "+ xhr.responseText);
      }
    });
    return false;
  });

  $("#recharge").click(function(){
    alert("======rechargeButton Running======");
    var url = urlBase+"/account/rechargeAccount";
    alert(url);
    $.ajax({
      type: 'POST',
      url: url,
      data: {
        userName: $('#account-username').val(), 
        role: $('#account-role').val(),
        money: $('#account-money').val()
      },
      success: function(data, status, jqXHR){
        // console.log(data);
        if(status==='success'){
          alert("recharge "+userName+"with "+money+" money successfully");
        }
        showTab("makeEquipment");
      },
      error: function(xhr, textStatus, error){
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
          alert("Error: "+ xhr.responseText);
      }
    });
    return false;
  });

  $("#makeTrade").click(function(){
    alert("======makeTradeButton Running======");
    var url = urlBase+"/trade/makeTrade";
    // var formData = {}
    alert(url);
    $.ajax({
      type: 'POST',
      url: url,
      data: {
        buyer: $('#trade-buyer').val(),
        seller: $('#trade-seller').val(),
        role: $('#trade-role').val()
      },
      success: function(data, status, jqXHR){
        // console.log(data);
        if(status==='success'){
          alert("makeTrade successfully");
        }
        // showTab("makeEquipment");
      },
      error: function(xhr, textStatus, error){
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
          alert("Error: "+ xhr.responseText);
      }
    });
    return false;
  });

  $("#makePretrade").click(function(){
    alert("======makePretradeButton Running======");
    var url = urlBase+"/trade/makePretrade";
    // var formData = {};
    alert(url+" using "+$('#trade-role').val());
    $.ajax({
      type: 'POST',
      url: url,
      data: {
        buyer: $('#trade-buyer').val(),
        seller: $('#trade-seller').val(),
        price: $('#trade-price').val(),
        amount: $('#trade-amount').val(),
        role: $('#trade-role').val()
      },
      success: function(data, status, jqXHR){
        // console.log(data);
        if(status==='success'){
          alert("makePretrade successfully");
        }
        // showTab("makeEquipment");
      },
      error: function(xhr, textStatus, error){
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
          alert("Error: "+ xhr.responseText);
      }
    });
    return false;
  });
 



//  $("#makeEquipment").click(function(){
//    var makeEquipmentUrl = urlBase+"/makeEquipment";
//    var formData = {
//      manufacturer: $('#manufacturer').val(),
//      equipmentNumber: $('#equipmentNumber').val(),
//      equipmentName: $('#equipmentName').val(),
//      ownerName: $('#ownerName').val()
//    }
//    $.ajax({
//      type: 'POST',
//      url: makeEquipmentUrl,
//      data: formData,
//      success: function(data, status, jqXHR){
//        if(status==='success'){
//          alert("successfully record manufacturer equipment  in blockchain");
//       }
//        showTab("query");
//      },
//      error: function(xhr, textStatus, error){
//          console.log(xhr.statusText);
//          console.log(textStatus);
//          console.log(error);
//          alert("Error: "+ xhr.responseText);
//      }
//    });
//    return false;
//  });
$("#query").click(function(){
//   reset();
  var queryUrl = urlBase+"/query/queryByKey";
  var searchKey = $('#query-cate').val()+'-'+$('#query-username').val();

  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { 
        key: searchKey, 
        role: $('#query-role').val(),
        userName: $('#query-username').val()
    },
    success: function(data, status, jqXHR){
        if(status==='success'){
            alert("query "+$('#query-username').val()+"with "+searchKey+" key successfully");
          }
        //   showTab("makeEquipment");
    //   if(!data || !data.Record || !data.Record.equipmentNumber) {
    //     $("#queryResultEmpty").show();
    //     $("#queryResult").hide();
    //   } else {
    //     $("#queryResult").show();
    //     $("#queryResultEmpty").hide();
    //     let record = data.Record;
    //     $("#equipmentNumberOutPut").text(record.equipmentNumber);
    //     $("#equipmentNameOutPut").text(record.equipmentName);
    //     $("#manufacturerOutPut").text(record.manufacturer);
    //     $("#ownerNameOutPut").text(record.ownerName);
    //     $("#createDateTime").text(record.createDateTime);
    //     $("#lastUpdated").text(record.lastUpdated);
    //     $("#queryKeyRequest").text(data.Key);
    //     $("#previousOwnerType").text(record.previousOwnerType);
    //     $("#currentOwnerType").text(record.currentOwnerType);
    //   }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
  return false;
});
$("#queryHistory").click(function(){
  reset();
  var queryUrl = urlBase+"/query/queryHistoryByKey";
  var searchKey = $('#queryHistoryKey').val();

  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { key: searchKey, role: 'producer'},
    success: function(data, status, jqXHR){
      if(!data || data.length==0) {
        $("#queryHistoryResultEmpty").show();
        $("#queryHistoryResult").hide();
      } else {
        $("#queryHistoryResult").show();
        $("#queryHistoryResultEmpty").hide();
        console.log(data);
        $("#historyTableTboday").empty();
        var tbody = $("#historyTableTboday");
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var tr = '<tr>';
            tr = tr+'<th scope="col">'+ row.equipmentNumber + '</th>';
            tr = tr+ '<td>'+ row.manufacturer + '</td>';
            tr = tr+ '<td>'+ row.equipmentNumber + '</td>';
            tr = tr+ '<td>'+ row.equipmentName + '</td>';
            tr = tr+ '<td>'+ row.ownerName + '</td>';
            tr = tr+ '<td>'+ row.previousOwnerType + '</td>';
            tr = tr+ '<td>'+ row.currentOwnerType + '</td>';
            tr = tr+ '<td>'+ row.createDateTime + '</td>';
            tr = tr+ '<td>'+ row.lastUpdated + '</td>';
            tr = tr+ '</tr>';
            tbody.append(tr);
        }
      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
  return false;
});
function showTab(which) {
   for(let i in tabs) {
     if(tabs[i]===which) {
       $("#"+tabs[i] + "Tab").show();
     } else {
       $("#"+tabs[i] + "Tab").hide();
     }
   }
   reset();
}
function reset() {
   $("#queryResultEmpty").hide();
   $("#queryResult").hide();
   $("#queryHistoryResultEmpty").hide();
   $("#queryHistoryResult").hide();
}
});
$(document).ajaxStart(function(){
  $("#wait").css("display", "block");
});
$(document).ajaxComplete(function(){
  $("#wait").css("display", "none");
});
