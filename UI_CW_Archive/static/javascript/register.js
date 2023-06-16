//Disable buttons
$(document).ready(function(){
    $('#registerBtn').prop('disabled',true);
    $('#registerForm').trigger('reset');
});

//Validation Checks
$('#password').on('keyup', function(e){
    checkRegister();
});

$('#password2').on('keyup', function(e){
    checkRegister();
});

$('#loginEmail').on('keyup',function(e){
    checkRegister();
});

$(document).on('keyup', function(e){
    if(e.key==="Enter"){
        if(!$('#registerBtn').is(":disabled")){
            $('#registerBtn').click();
        }
    }
});

//Check if email and password are valid
function checkRegister(){
    if($('#password').val().length<8){
        pass=false;
    }else{
        pass=true;
    }
    if($('#password2').val()==$('#password').val()){
        pass2=true;
    }else{
        pass2=false;
    }
    email = validateEmail('loginEmail');

    if(pass&&pass2&&email[0]){
        showSuccessMessage('#password');
        showSuccessMessage('#password2');
        showSuccessMessage('#registerEmail');
        $('#registerBtn').prop('disabled', false);
    }if(!pass){
        showErrorMessage('Password must be 8 characters or more', '#password');
        $('#registerBtn').prop('disabled',true);
    }else{
        showSuccessMessage('#password');
    }if(!pass2&&$('#password2').val().length>=1){
        showErrorMessage('Passwords do not match.', '#password2');
        $('#registerBtn').prop('disabled',true);
    }else if($('#password2').val().length<1){
        hideMessage('#password2')
    }
    else{
        showSuccessMessage('#password2');
    }
    if(!email[0]){
        showErrorMessage(email[1], '#loginEmail');
        $('#registerBtn').prop('disabled',true);
    }else{
        showSuccessMessage('#loginEmail');
    }
}

//Can only click if email and password are valid.  Proceed to home.
$('#registerBtn').click(function(){
    alert('Registration Complete');
   window.location="../index.html";
});

