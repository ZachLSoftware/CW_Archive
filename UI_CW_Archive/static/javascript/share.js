const perSubmitBtn = document.getElementById('addPermissionBtn');
const modPerBtn = document.getElementById('modifyPermissionBtn');

//Disable submission buttons
$(document).ready(function(){
    perSubmitBtn.disabled=true;
    modPerBtn.disabled=true;

});

//Add a permission
$('#addPermissionBtn').click(function(e){
    var res = confirm("Send Email and Add Permissions?");
    if (!res){return;};
    //Check if for the task or events pages
    if(document.getElementsByClassName('show task-table').length>0){
        var id = document.getElementsByClassName('show task-table')[0].id.split('-')[0];
    }
    else{
        var id  = document.getElementsByClassName('show event-table')[0].id.split('-')[0];
    }

    //Set permission table id
    id='existingPerm'+id;

    //Finds the correct permission table
    var table = document.getElementById(id).getElementsByTagName('tbody')[0];

    //Get new permission values
    var email = document.getElementById('newEmail').value;
    var perm = document.getElementById('newPermission').value;

    //Create new row and and td elements
    var tr = document.createElement('tr');
    var labelTD=document.createElement('td');
    var selectTD=document.createElement('td');
    var label=document.createElement('label');
    var select=document.createElement('select');
    var buttonTD=document.createElement('td');

    //Create the select form (Change permissions)
    label.setAttribute('for',email);
    label.classList.add('form-label');
    label.innerHTML=email;
    labelTD.appendChild(label);

    
    select.setAttribute('name',email);
    select.id=email;
    select.classList.add('form-select');

    //Get the right select option displayed
    if(perm=='Modify'){
        select.innerHTML="<option value='Read'>Read Only</option><option value='Modify' selected>Modify/Delete</option><option value='Edit'>Edit</option>";
    }
    else if(perm=='Edit'){
        select.innerHTML="<option value='Read'>Read Only</option><option value='Modify'>Modify/Delete</option><option value='Edit' selected>Edit</option>";
    }
    else{
        select.innerHTML="<option value='Read'>Read Only</option><option value='Modify'>Modify/Delete</option><option value='Edit'>Edit</option>";
    }

    //Append Select
    selectTD.appendChild(select);

    //Add Remove button
    buttonTD.innerHTML='<button class="btn btn-secondary removePermission">Remove</button>';

    //Append all elements
    tr.appendChild(labelTD);
    tr.appendChild(selectTD);
    tr.appendChild(buttonTD);
    table.appendChild(tr);
    
});


//Validate email
$('#newEmail').keyup(function(e){
    var res = validateEmail('newEmail');
    if(res[0]){
        showSuccessMessage('#addPermission');
        perSubmitBtn.disabled=false;
    }
    else{
        showErrorMessage(res[1],'#addPermission')
        perSubmitBtn.disabled=true;
    }
});

//Remove permissions
$('#existingUsers').on('click','.removePermission',function(e){

    //Confirm delete
    var res = confirm("Revoke Permissions?")
    if(res){
        e.target.parentElement.parentElement.remove();
        alert("Permissions Removed");
    }
});


$('#existingUsers').on('change','table select',function(e){
    modPerBtn.disabled=false;
});

//Modifies the selected permission
modPerBtn.addEventListener('click', function(e){
    var select=document.getElementById('existingUsers').getElementsByTagName('select');
    for(var i=0; i<select.length; i++){
        if(select[i].value=='Modify'){
            select[i].innerHTML="<option value='Read'>Read Only</option><option value='Modify' selected>Modify/Delete</option><option value='Edit'>Edit</option>";
        }
        else if(select[i].value=='Edit'){
            select[i].innerHTML="<option value='Read'>Read Only</option><option value='Modify'>Modify/Delete</option><option value='Edit' selected>Edit</option>";
        }
        else{
            select[i].innerHTML="<option value='Read'>Read Only</option><option value='Modify'>Modify/Delete</option><option value='Edit'>Edit</option>";
        }
    }
    modPerBtn.disabled=true;
});
