/**
** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
** farma ledger supply chain network
**  Author: Brian Wu
** JS for manufacturer web appication
**/

//juery语法
$(document).ready(function(){
    //make sure change to your own machine ip or dmain url
    var urlBase = "http://127.0.0.1";
    $("#register").click(function(){
      alert("======Register Running======");
      var registerUrl = urlBase+":8080/addUser";
      var option=$("#cate").val(); //获取选中的项
      var userName = $('#user').val();
      // alert(registerUrl);
      $.ajax({
          type: 'POST',
          url: registerUrl,
          data: { userName: userName , option: option},
          success: function(data, status, jqXHR){
            console.log(data);
            if(status==='success'){
              alert("User - "+ userName+ " was successfully added to wallet and is ready to intreact with the fabric network");
            }
          },
          error: function(xhr, textStatus, error){
              console.log(xhr.statusText);
              console.log(textStatus);
              console.log(error);
              alert("MyError: "+ xhr.responseText);
          }
          
      });
      return false;
     });
    $("#login").click(function(){
      alert("======Login Running======\n");
      // window.location.href = "https://www.baidu.com";
      var option=$("#cate").val(); //获取选中的项
      var userName = $('#user').val();
      loginUrl = urlBase+":8080/login"
      // alert(loginUrl);
      $.ajax({
          type: 'POST',
          url: loginUrl,
          data: { userName: userName, option: option},
          success: function(data, status, jqXHR){
            console.log(data);
            if(status==='success'){
              // if(option=='producer') port = '30000';
              // else port = '30001';
              // targetUrl = urlBase + ":" + port;
              alert("User - "+ userName+ " was successfully login");
              // alert(userName+" login as a "+option+" at "+targetUrl);
              window.location.href = urlBase+":8080/"+option;
              
            }
          },
          error: function(xhr, textStatus, error){
              console.log(xhr.statusText);
              console.log(textStatus);
              console.log(error);
              alert("MyError: "+ xhr.responseText);
          }
          
      });
      return false;
     });

});

