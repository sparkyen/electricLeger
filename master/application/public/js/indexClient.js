/**
** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
** farma ledger supply chain network
**  Author: Brian Wu
** JS for manufacturer web appication
**/

//juery语法
$(document).ready(function () {
  //make sure change to your own machine ip or dmain url
  var urlBase = "http://192.168.233.158";
  $("#register").click(function () {
    alert("======Register Running======");
    var role = $("#cate").val(); //获取选中的项
    var userName = $('#user').val();
    var passwd = $('#passwd').val();
    var registerUrl = urlBase + ":8080/" + role + "/account/regAccount";
    alert(registerUrl);
    if (role == 'admin') {
      alert("Role admin can not be registered");
    }
    else {
      $.ajax({
        type: 'POST',
        url: registerUrl,
        data: { 
          userName: userName, 
          passwd: passwd,
          role: role 
        },
        success: function (data, status, jqXHR) {
          console.log(data);
          // if(status==='success'){
          alert("User - " + userName + " was successfully added to wallet and is ready to intreact with the fabric network");
          // }
        },
        error: function (xhr, textStatus, error) {
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
          alert("MyError: " + xhr.responseText);
        }
      });
    }

    return false;
  });
  $("#login").click(function () {
    alert("======Login Running======\n");
    // window.location.href = "https://www.baidu.com";
    var role = $("#cate").val(); //获取选中的项
    var userName = $('#user').val();
    var passwd = $('#passwd').val();
    loginUrl = urlBase + ":8080/login"
    // alert(loginUrl);
    $.ajax({
      type: 'POST',
      url: loginUrl,
      data: {
        userName: userName,
        passwd: passwd, 
        role: role
      },
      success: function (data, status, jqXHR) {
        console.log(data);
        if (status === 'success') {
          // if(option=='producer') port = '30000';
          // else port = '30001';
          // targetUrl = urlBase + ":" + port;
          alert("User - " + userName + " was successfully login");
          // alert(userName+" login as a "+option+" at "+targetUrl);
          window.location.href = urlBase + ":8080/" + role;
        }
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("MyError: " + xhr.responseText);
      }

    });
    return false;
  });
  // $("#upload").click(function () {
  //   alert("======Upload Running======\n");
  //   let uploadUrl = urlBase + ":8080/upload"
  //   alert(uploadUrl)
  //   var formData = new FormData();
  //   formData.append('file', $('#file')[0].files[0]);
  //   $.ajax({
  //     url: uploadUrl,
  //     type: 'POST',
  //     cache: false,
  //     data: formData,
  //     processData: false,
  //     contentType: false
  //   }).done(function (res) {
  //   }).fail(function (res) { });
  // });

});

