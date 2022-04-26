/**
 ** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 ** farma ledger supply chain network
 **  Author: Brian Wu
 ** JS for manufacturer web appication
 **/
// var cache = require('memory-cache');

//juery语法
$(document).ready(function () {
  //make sure change to your own machine ip or dmain url
  var ipUrl = "http://192.168.233.158"
  var urlBase = ipUrl+":8080/consumer";
  var tabs = ["trade", "query"];
  var resultTables = ["account", "sell", "purchase", "trade"];
  $("#queryResult").hide();
  showTab("trade");
  $("#tradeLink").click(function () {
    showTab("trade");
  });
  $("#queryLink").click(function () {
    showTab("query");
  });
  $("#makeSellPretrade").click(function () {
    alert("======makeSellPretrade Running======");
    var tradeUrl = urlBase + "/trade/makePretrade";
    // var formData = {};
    // alert(tradeUrl + " using " + $('#trade-role').val());
    var name = document.getElementById("username").innerText;
    $.ajax({
      type: 'POST',
      url: tradeUrl,
      data: {
        name: name,
        expectPrice: $('#trade-expectPrice').val(),
        bottomPrice: $('#trade-bottomPrice').val(),
        amount: $('#trade-amount').val(),
        cate: 'sell'
      },
      success: function (data, status, jqXHR) {
        // console.log(data);
        if (status == 'success') {
          alert("makeSellPretrade successfully");
        }
        // showTab("tradeTest");
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: " + xhr.responseText);
      }
    });
    return false;
  });

  $("#trade-query").click(function () {
    reset();
    var queryUrl = urlBase + "/query/queryHistoryByKey";
    var role = 'consumer';
    var cate = 'trade'
    var name = document.getElementById("username").innerText;
    var searchKey = cate + '-' + name;

    $.ajax({
      type: 'GET',
      url: queryUrl,
      data: {
        key: searchKey,
        role: role,
        userName: name
      },
      success: function (data, status, jqXHR) {
        alert("history query " + name + " with " + searchKey + " key successfully");
        if(!data || data.length==0) {
          $("#queryResultEmpty").show();
          $("#queryResult").hide();
        } else {
          $("#queryResult").show();
          $("#queryResultEmpty").hide();
          $("#historyTableTboday").empty();
          showTable(cate);
          let tableCate = "#"+cate+"TableTboday";
          $(tableCate).empty();
          var tbody = $(tableCate);
          for (var i = 0; i < data.length; i++) {
            var tr = showData(cate, data[i]);
            tbody.append(tr);
          }
        }
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: " + xhr.responseText);
      }
    });
    return false;
  });

  $("#sell-query").click(function () {
    reset();
    var queryUrl = urlBase + "/query/queryHistoryByKey";
    var role = 'consumer';
    var cate = 'sell'
    var name = document.getElementById("username").innerText;
    var searchKey = cate + '-' + name;

    $.ajax({
      type: 'GET',
      url: queryUrl,
      data: {
        key: searchKey,
        role: role,
        userName: name
      },
      success: function (data, status, jqXHR) {
        alert("history query " + name + " with " + searchKey + " key successfully");
        if(!data || data.length==0) {
          $("#queryResultEmpty").show();
          $("#queryResult").hide();
        } else {
          $("#queryResult").show();
          $("#queryResultEmpty").hide();
          $("#historyTableTboday").empty();
          showTable(cate);
          let tableCate = "#"+cate+"TableTboday";
          $(tableCate).empty();
          var tbody = $(tableCate);
          for (var i = 0; i < data.length; i++) {
            var tr = showData(cate, data[i]);
            tbody.append(tr);
          }
        }
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: " + xhr.responseText);
      }
    });
    return false;
  });

  $("#account-query").click(function () {
    reset();
    var queryUrl = urlBase + "/query/queryHistoryByKey";
    var role = 'consumer';
    var cate = 'account'
    var name = document.getElementById("username").innerText;
    var searchKey = cate + '-' + name;

    // var hello = $(this).data('data')
    // var name = $(cache.get(role));
    
    // alert(name);
    // var cate = $('#query-cate').val();

    $.ajax({
      type: 'GET',
      url: queryUrl,
      data: {
        key: searchKey,
        role: role,
        userName: name
      },
      success: function (data, status, jqXHR) {
        alert("history query " + name + " with " + searchKey + " key successfully");
        if(!data || data.length==0) {
          $("#queryResultEmpty").show();
          $("#queryResult").hide();
        } else {
          $("#queryResult").show();
          $("#queryResultEmpty").hide();
          $("#historyTableTboday").empty();
          showTable(cate);
          let tableCate = "#"+cate+"TableTboday";
          $(tableCate).empty();
          var tbody = $(tableCate);
          for (var i = 0; i < data.length; i++) {
            var tr = showData(cate, data[i]);
            tbody.append(tr);
          }
        }
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: " + xhr.responseText);
      }
    });
    return false;
  });

  //展示侧边栏所示的大页面
  function showTab(which) {
    for (let i in tabs) {
      if (tabs[i] === which) {
        $("#" + tabs[i] + "Tab").show();
      } else {
        $("#" + tabs[i] + "Tab").hide();
      }
    }
    reset();
  }

  //展示query结果选定的表格
  function showTable(which) {
    for (let i in resultTables) {
      // alert("#" + resultTables[i]+"Result");
      if (resultTables[i] === which) {
        $("#" + resultTables[i]+"Result").show();
      } else {
        $("#" + resultTables[i]+"Result").hide();
      }
    }
    // reset();
  }
  
  //展示表格控制函数
  function showResults(cate){
    showTable(cate);
    let tableCate = "#"+cate+"TableTboday";
    return tableCate;
  }

  //填充表格数据
  function showData(id, data){
    var tr = '<tr>';
    if(data==null) {
      tr = tr+ '</tr>';
      return tr;
    }
    if(id=='account'){
      tr = tr+ '<td>'+ data.name + '</th>';
      tr = tr+ '<td>'+ data.role + '</td>';
      tr = tr+ '<td>'+ data.balance + '</td>';
      tr = tr+ '<td>'+ data.amount + '</td>';
      tr = tr+ '<td>'+ data.permission + '</td>';
      tr = tr+ '<td>'+ data.updateTime + '</td>';
    }
    else if(id=='sell'){
      tr = tr+ '<td>'+ data.seller + '</th>';
      tr = tr+ '<td>'+ data.expectPrice + '</td>';
      tr = tr+ '<td>'+ data.bottomPrice + '</td>';
      tr = tr+ '<td>'+ data.amount + '</td>';
      tr = tr+ '<td>'+ data.available + '</td>';
      tr = tr+ '<td>'+ data.createDateTime + '</td>';
    }
    else if(id=='trade'){
      tr = tr+ '<td>'+ data.seller + '</th>';
      tr = tr+ '<td>'+ data.buyer + '</td>';
      tr = tr+ '<td>'+ data.price + '</td>';
      tr = tr+ '<td>'+ data.amount + '</td>';
      tr = tr+ '<td>'+ data.createDateTime + '</td>';
    }
    tr = tr+ '</tr>';
    return tr;
  }

  function reset() {
    $("#queryResultEmpty").hide();
    $("#queryResult").hide();
  }
});
$(document).ajaxStart(function () {
  $("#wait").css("display", "block");
});
$(document).ajaxComplete(function () {
  $("#wait").css("display", "none");
});
