var signUpBtn = document.getElementById('sign-up-page');
var signUpArea = document.getElementById('sign-up-area');
var loginArea = document.getElementById('login-area');



//sign up set up
var signUpName = document.getElementById('Susername');
var signUpPwd = document.getElementById('sign-up-pwd');
var signUpRePwd = document.getElementById('sign-up-rePwd');
var signUpForm = document.getElementById('sign-up-form');

function checkInput (str) {
    if (str == " " || str == ""){
        return false;
    }
    return true;
}

signUpBtn.addEventListener('click', function () {
    signUpArea.hidden = false;
    loginArea.hidden = true;
}); 

signUpForm.addEventListener('submit',function(event) {
    event.preventDefault();
    var data = {
        username: signUpName.value,
        password: signUpPwd.value
    };
    console.log(data);
    if (checkInput(signUpName.value) && checkInput(signUpPwd.value) && checkInput(signUpRePwd.value)){
        if (signUpPwd.value == signUpRePwd.value){
            $.ajax ({
                method: "POST",
                url: "/signUp",
                data: data,
                statusCode: { 
                200: function () { 
                        signUpArea.hidden = true;
                        loginArea.hidden = false;
                        alert('Sign up successfully!!!');
                    }
                ,
                500: function() {
                    alert("Some thing went wrong!!! Please try again");
                    }
                },
                dataType: "json",           
            })
        
        } else {
            alert("Please type correctly!!");
        }
    }else {
        alert ("You must type something!!!");
    }
});
