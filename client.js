var passwordMIN = 3;

var initlocalstorage = function(){
    if(localStorage.getItem("token")==null){
        localStorage.setItem("token","[]");
    }
}

displayView = function(id){
   // the code required to display a view
    document.getElementById(id+"Page").innerHTML = document.getElementById(id+"View").innerHTML;
};

var validatePwd = function(password_id, repeatpassword_id){

    var password = document.getElementById(password_id);
    var repeatpassword = document.getElementById(repeatpassword_id);

    if(password.value.length >= passwordMIN) {
        password.setCustomValidity("");
        if (repeatpassword.value == password.value) {
            repeatpassword.setCustomValidity("");
        }else {
            repeatpassword.setCustomValidity("The password is not same!");
        }
    }else{
        password.setCustomValidity("Password length should longer than " + passwordMIN);
    }

}

var signup = function(){

    initlocalstorage();

    var email = document.getElementById("signupemail").value;
    var password = document.getElementById("signuppassword").value;
    var firstname = document.getElementById("firstname").value;
    var familyname = document.getElementById("familyname").value;
    var gender = document.getElementById("gender").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;

    var newUser = {email,password,firstname,familyname,gender,city,country};
    var submitResult = serverstub.signUp(newUser);
    document.getElementById("signupalert").innerText = submitResult.message;
    if(submitResult.success){
        document.getElementById("signupalert").style.color = "black";

        var token = "";
        var loginresult = serverstub.signIn(email, password);
        if(loginresult.success) {
            token = loginresult.data;
            localStorage.setItem("token", JSON.stringify(token));
            displayView("profile");
        }
    }
};

var login = function(){
    var email = document.getElementById("loginemail").value;
    var password = document.getElementById("loginpassword").value;

    var loginResult = serverstub.signIn(email, password);
    document.getElementById("loginalert").innerHTML = loginResult.message;
    var token = "";
    if(loginResult.success){
        document.getElementById("loginalert").style.color = "black";
        token = loginResult.data;
        localStorage.setItem("token", JSON.stringify(token));
        displayView("profile");
    }
}

var changePwd = function(){
    var oldpassword = document.getElementById("oldpwd");
    var newpassword = document.getElementById("newpwd");
    var token = JSON.parse(localStorage.getItem("token"));

    var result = serverstub.changePassword(token,oldpassword,newpassword);
    document.getElementById("changepwdAlert").innerText = result.message;
}

window.onload = function() {
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    displayView("welcome");
    initlocalstorage();
};
