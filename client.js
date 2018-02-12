
var passwordMIN = 3;
var useremail = "";
var searchemail = "";

var initlocalstorage = function(){
    if(localStorage.getItem("token")==null){
        localStorage.setItem("token","[]");
    }
}

var displayView = {
    // the code required to display a view
    show: function (id) {
        document.getElementById(id + "Page").innerHTML = document.getElementById(id + "View").innerHTML;
        if (id == "profile") {
            attachHandler();
            refreshwall(useremail);
        }
    },
    hide: function (id) {
        document.getElementById(id + "Page").innerHTML = "";
    }
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
            displayView.show("profile");
            displayView.hide("welcome");
            showProfile(email);
            refreshwall(email);
            useremail = email;
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
        //document.getElementById("loginalert").style.color = "black";
        token = loginResult.data;
        localStorage.setItem("token", JSON.stringify(token));
        displayView.show("profile");
        displayView.hide("welcome");
        showProfile(email);
        refreshwall(email);
        useremail = email;
    }
}

var changePwd = function(){
    var oldpassword = document.getElementById("oldpwd");
    var newpassword = document.getElementById("newpwd");
    var token = JSON.parse(localStorage.getItem("token"));

    var result = serverstub.changePassword(token,oldpassword.value,newpassword.value);
    document.getElementById("changepwdAlert").innerText = result.message;
}

var showProfile = function(email){
    var token = JSON.parse(localStorage.getItem("token"));
    var dataresult = serverstub.getUserDataByEmail(token, email);
    if(dataresult.success){

        document.getElementById("infoemail").innerText = dataresult.data.email;
        document.getElementById("infofirstname").innerText = dataresult.data.firstname;
        document.getElementById("infolastname").innerText = dataresult.data.familyname;
        document.getElementById("infogender").innerText = dataresult.data.gender;
        document.getElementById("infocity").innerText = dataresult.data.city;
        document.getElementById("infocountry").innerText = dataresult.data.country;
    }
    document.getElementById("infoalert").innerHTML = dataresult.message;
    document.getElementById("profileheader").innerHTML = dataresult.data.firstname + dataresult.data.familyname;
}

var refreshbutton = function(){
    if(document.getElementById("browsetab").className==="tab-cur"){
        refreshwall(searchemail);
    }else{
        refreshwall(useremail);
    }
}

var refreshwall = function (email) {
    var token = JSON.parse(localStorage.getItem("token"));
    var refreshresult = serverstub.getUserMessagesByEmail(token,email);
    var wall = document.getElementById("messagewall");
    document.getElementById("wallalert").innerText = refreshresult.message;
    if(refreshresult.success){
        var msgs = refreshresult.data;
        var msg = "";
        wall.innerHTML = "<tr><th>Author</th><th>Message</th></tr>";
        for(var i=0;i<msgs.length;i++){
            msg = "<tr><td>" + msgs[i].writer + "</td><td>" + msgs[i].content + "</td></tr>" ;
            wall.innerHTML += msg;
        }
    }
    document.getElementById("wallheader").innerHTML = email + "'s Message Wall:";
}

var postmessage = function(){
    var token = JSON.parse(localStorage.getItem("token"));
    var msg = document.getElementById("addpost").value;
    var email ="";
    if(document.getElementById("browsetab").className === "tab-cur"){
        email = searchemail;
    }else{
        email = useremail;
    }
    var postresult = serverstub.postMessage(token,msg,email);
    document.getElementById("postalert").innerText = postresult.message;
    if(postresult.success){
        refreshwall(email);
    }
}

var searchuser = function(){
    var token = JSON.parse(localStorage.getItem("token"));
    searchemail = document.getElementById("searchemail").value;
    var searchresult = serverstub.getUserDataByEmail(token,searchemail);
    document.getElementById("searchalert").innerText = searchresult.message;
    if(searchresult.success){
        showProfile(searchemail);
        refreshwall(searchemail);
        document.getElementById("homecontent").className = "content-cur";
    }
}

var attachHandler = function () {
    var homeTab = document.getElementById("hometab");
    var accountTab = document.getElementById("accounttab");
    var browseTab = document.getElementById("browsetab");
    var homeContent = document.getElementById("homecontent");
    var accountContent = document.getElementById("accountcontent");
    var browseContent = document.getElementById("browsecontent");

    homeTab.addEventListener("click",function(){
       homeTab.className = "tab-cur";
       accountTab.className = "tab";
       browseTab.className = "tab";
       homeContent.className = "content-cur";
       accountContent.className = "content";
       browseContent.className = "content";
    },false);

    accountTab.addEventListener("click",function(){
        homeTab.className = "tab";
        accountTab.className = "tab-cur";
        browseTab.className = "tab";
        homeContent.className = "content";
        accountContent.className = "content-cur";
        browseContent.className = "content";
    },false);

    browseTab.addEventListener("click",function(){
        homeTab.className = "tab";
        accountTab.className = "tab";
        browseTab.className = "tab-cur";
        homeContent.className = "content";
        accountContent.className = "content";
        browseContent.className = "content-cur";
    },false);

    document.getElementById("logout").addEventListener("click",function(){
        var token = JSON.parse(localStorage.getItem("token"));
        var signoutresult = serverstub.signOut(token);
        if(signoutresult.success){
            displayView.hide("profile");
            displayView.show("welcome");
            useremail = "";
            searchemail = "";
            document.getElementById("loginalert").innerHTML = signoutresult.message;
        }
    },false);

}

window.onload = function() {
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    displayView.show("welcome");
    initlocalstorage();
};
