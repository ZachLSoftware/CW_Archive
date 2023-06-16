//Create variables
var pass= false;
var email = false;
var attempts=3;

//Disable buttons on document load
$(document).ready(function(){
    $('.loginLockout').prop('disabled', false);
    $('.formSubmitBtn').prop('disabled',true);
    $('.loginForm').trigger('reset');
});

$(document).on('keyup', function(e){
    if(e.key==="Enter"){
        if(!$('#signIn').is(":disabled")){
            $('#signIn').click();
        }
    }
});

//Validation Checks
$('#password').on('keyup', function(e){
    checkSignIn();
});

$('#loginEmail').on('keyup',function(e){
    checkSignIn();
});

$('#resetEmail').on('keyup',function(e){
    checkReset();
});

//handle reset submit (Doesn't actually send email...)
$('#resetPasswordBtn').click(function(){
    alert('A reset link has been sent to your email.') 
    $('forgotPasswordForm').trigger('reset');
});

//Check if we can enable sign in
function checkSignIn(){
    if($('#password').val().length<1){
        pass=false;
    }else{
        pass=true;
    }
    email = validateEmail('loginEmail');

    //If password and email are ok enable
    if(pass&&email[0]){
        showSuccessMessage('#password');
        showSuccessMessage('#loginEmail');
        $('#signIn').prop('disabled', false);
    }if(!pass){
        showErrorMessage('Please enter a password.', '#password');
        $('#signIn').prop('disabled',true);
    }else{
        hideMessage('#password');
    }if(!email[0]){
        showErrorMessage(email[1], '#loginEmail');
        $('#signIn').prop('disabled',true);
    }else{
        showSuccessMessage('#loginEmail');
    }
}

//Check sign in
$('#signIn').click(function(){

    //If correct go to home page
    if($('#loginEmail').val().toUpperCase()=="exampleUser@example.com".toUpperCase() && $('#password').val()=="password"){
        window.location="../index.html";
    }else{

        //Reduce attempts
        attempts--;

        //Lock out and display message
        if(attempts==0){
            $('.loginLockout').prop('disabled', true);
            showErrorMessage('Invalid Email or Password. Login has been disabled', '#signIn');
        }else{
        $('#password').val('');
            $('#signIn').prop('disabled',true);
            showErrorMessage('Invalid Email or Password. ' + attempts+ ' Remaining', '#signIn');
        }
    }
});

//Validation for reset password
function checkReset(){
    var email = validateEmail('resetEmail');
    if(email[0]){
        $('#resetPasswordBtn').prop('disabled', false);
        showSuccessMessage('#reset');
    }else{
        $('#resetPasswordBtn').prop('disabled', true);
        showErrorMessage(email[1], '#reset');
    }
}