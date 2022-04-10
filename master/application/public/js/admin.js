/**
 ** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 ** farma ledger supply chain network
 **  Author: Brian Wu
 ** JS for manufacturer web appication
 **/

//juery语法
$(document).ready(function () {
  //make sure change to your own machine ip or dmain url
  var urlBase = "http://127.0.0.1:8080/admin";
  var tabs = ["accountTest", "tradeTest", "query"];
  var resultTables = ["account", "sell", "purchase", "trade"];
  $("#queryResult").hide();
  $("#accountTestLink").click(function () {
    showTab("accountTest");
  });
  $("#tradeTestLink").click(function () {
    showTab("tradeTest");
  });
  $("#queryLink").click(function () {
    showTab("query");
  });
  $("#active").click(function () {
    alert("======activeButton Running======");
    var accountUrl = urlBase + "/account/activeAccount";
    const userName = $('#account-username').val();
    const role = $('#account-role').val()
    // alert(accountUrl);
    $.ajax({
      type: 'POST',
      url: accountUrl,
      data: {
        userName: userName,
        role: role
      },
      success: function (data, status, jqXHR) {
        // console.log(status);
        // alert(status);
        if (status == 'success') {
          alert("active " + userName + " successfully");
        }
        // showTab("query");
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

  $("#init").click(function () {
    alert("======initButton Running======");
    var accountUrl = urlBase + "/account/initAccount";
    const userName = $('#account-username').val();
    const role = $('#account-role').val();
    // alert(accountUrl);
    $.ajax({
      type: 'POST',
      url: accountUrl,
      data: {
        userName: userName,
        role: role
      },
      success: function (data, status, jqXHR) {
        // console.log(data);
        if (status == 'success') {
          alert("init " + userName + " successfully");
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

  $("#recharge").click(function () {
    alert("======rechargeButton Running======");
    var accountUrl = urlBase + "/account/rechargeAccount";
    const userName = $('#account-username').val();
    const role = $('#account-role').val();
    const money = $('#account-money').val();
    // alert(accountUrl);
    $.ajax({
      type: 'POST',
      url: accountUrl,
      data: {
        userName: userName,
        role: role,
        money: money
      },
      success: function (data, status, jqXHR) {
        // console.log(data);
        if (status == 'success') {
          alert("recharge " + userName + " with " + money + " money successfully");
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

  $("#makeTrade").click(function () {
    alert("======makeTradeButton Running======");
    var tradeUrl = urlBase + "/trade/makeTrade";
    // var formData = {}
    // alert(tradeUrl);
    $.ajax({
      type: 'POST',
      url: tradeUrl,
      data: {
        buyer: $('#trade-buyer').val(),
        seller: $('#trade-seller').val(),
        role: $('#trade-role').val()
      },
      success: function (data, status, jqXHR) {
        // console.log(data);
        if (status == 'success') {
          alert("makeTrade successfully");
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

  $("#makePretrade").click(function () {
    alert("======makePretradeButton Running======");
    var tradeUrl = urlBase + "/trade/makePretrade";
    // var formData = {};
    // alert(tradeUrl + " using " + $('#trade-role').val());
    $.ajax({
      type: 'POST',
      url: tradeUrl,
      data: {
        buyer: $('#trade-buyer').val(),
        seller: $('#trade-seller').val(),
        price: $('#trade-price').val(),
        amount: $('#trade-amount').val(),
        role: $('#trade-role').val()
      },
      success: function (data, status, jqXHR) {
        // console.log(data);
        if (status == 'success') {
          alert("makePretrade successfully");
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

  $("#single-query").click(function () {
    reset();
    var queryUrl = urlBase + "/query/queryByKey";
    var searchKey = $('#query-cate').val() + '-' + $('#query-username').val();
    var cate = $('#query-cate').val();

    $.ajax({
      type: 'GET',
      url: queryUrl,
      data: {
        key: searchKey,
        role: $('#query-role').val(),
        userName: $('#query-username').val()
      },
      success: function (data, status, jqXHR) {
        alert("single query " + $('#query-username').val() + "with " + searchKey + " key successfully");
        if(!data || !data.Record) {
          $("#queryResultEmpty").show();
          $("#queryResult").hide();
        } else {
          $("#queryResult").show();
          $("#queryResultEmpty").hide();
          showResults(cate);
          let tableCate = "#"+cate+"TableTboday";
          $(tableCate).empty();
          var tbody = $(tableCate);
          var tr = showData(cate, data.Record);
          // for (var i = 0; i < data.length; i++) {
          tbody.append(tr);
          // }
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

  $("#history-query").click(function () {
    reset();
    var queryUrl = urlBase + "/query/queryHistoryByKey";
    var searchKey = $('#query-cate').val() + '-' + $('#query-username').val();
    var cate = $('#query-cate').val();

    $.ajax({
      type: 'GET',
      url: queryUrl,
      data: {
        key: searchKey,
        role: $('#query-role').val(),
        userName: $('#query-username').val()
      },
      success: function (data, status, jqXHR) {
        alert("history query " + $('#query-username').val() + "with " + searchKey + " key successfully");
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


  $("#partial-query").click(function () {
    reset();
    var queryUrl = urlBase + "/query/queryPartialKey";
    var searchKey = $('#query-cate').val();
    var cate = $('#query-cate').val();

    $.ajax({
      type: 'GET',
      url: queryUrl,
      data: {
        key: searchKey,
        role: $('#query-role').val(),
        userName: $('#query-username').val()
      },
      success: function (data, status, jqXHR) {
        alert("partial query " + $('#query-username').val() + "with " + searchKey + " key successfully");
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
      tr = tr+ '<td>'+ data.price + '</td>';
      tr = tr+ '<td>'+ data.amount + '</td>';
      tr = tr+ '<td>'+ data.available + '</td>';
      tr = tr+ '<td>'+ data.createDateTime + '</td>';
    }
    else if(id=='purchase'){
      tr = tr+ '<td>'+ data.buyer + '</td>';
      tr = tr+ '<td>'+ data.price + '</td>';
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
