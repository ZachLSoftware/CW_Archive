//Disable and reset forms on page refresh
$(document).ready(function(){
    $('.loginLockout').prop('disabled', false);
    $('.formSubmitBtn').prop('disabled',true);
    $('.loginForm').trigger('reset');
});

//Validation checks
$('#password').on('keyup', function(e){
    checkPasswordUpdate();
});
$('#password2').on('keyup', function(e){
    checkPasswordUpdate();
});

$('#oldPassword').on('keyup', function(){
    hideMessage('#currentPassword');
});

//Handle update
$('#updatePasswordBtn').click(function(){
    if($('#oldPassword').val()==='password'){
        alert('Password has been updated');
        window.location='account.html';
    }else{
        showErrorMessage('Password is incorrect.', '#currentPassword');
    }
});

$(document).on('keyup', function(e){
    if(e.key==="Enter"){
        if(!$('#updatePasswordBtn').is(":disabled")){
            $('#updatePasswordBtn').click();
        }
    }
});

//Check if valid form and enable submit
function checkPasswordUpdate(){
    var cpass;
    var pass;
    var pass2;
    if($('#password').val().length<8 || $('#password').val()=="password"){
        pass=false;
    }else{
        pass=true;
    }
    if($('#password2').val()==$('#password').val()){
        pass2=true;
    }else{
        pass2=false;
    }
    if($('#oldPassword').length<1){
        cpass=false;
    }else{
        cpass=true;
    }
    if(pass&&pass2&&cpass){
        showSuccessMessage('#password');
        showSuccessMessage('#password2');
        $('#updatePasswordBtn').prop('disabled', false);
    }if(!pass){
        if($('#password').val()=="password"){
            showErrorMessage('You cannot re-use your current password.', '#password');
            $('#updatePasswordBtn').prop('disabled',true);
        }else{
            showErrorMessage('Password must be 8 characters or more', '#password');
            $('#updatePasswordBtn').prop('disabled',true);
        }
    }else{
        showSuccessMessage('#password');
    }if(!pass2&&$('#password2').val().length>=1){
        showErrorMessage('Passwords do not match.', '#password2');
        $('#updatePasswordBtn').prop('disabled',true);
    }else if($('#password2').val().length<1){
        hideMessage('#password2')
    }
    else{
        showSuccessMessage('#password2');
    }
    
}