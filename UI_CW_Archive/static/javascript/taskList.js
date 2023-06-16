//Button elements (Before Jquery)
const listSubmit = document.getElementById('newListSave');
const taskSubmit = document.getElementById('newTaskSave');
const modify = document.getElementById('modifyList');
const modifySubmit = document.getElementById('modifyListSave');
const delList = document.getElementById('deleteListBtn');
const listName = document.getElementById('listName');
const addListBtn = document.getElementById('newListBtn');
const height=window.screen.height;
const width=window.screen.width;

//Form Validation Checks
var listNameOk=false;
var listDateOk=false;
var taskNameOk=false;
var taskDateOk=false;
var modifyNameOk=false;
var modifyDateOk=false;

//Add click Event Listeners
listSubmit.addEventListener('click', addList)
taskSubmit.addEventListener('click', addTask);
modify.addEventListener('click', modifyListForm);
modifySubmit.addEventListener('click', modifyList);
delList.addEventListener('click', deleteList);
$('#deleteListNavBtn').click(function(){deleteList()});


//Data validation checks
$('#addTaskBtn').click(function(){
    var tableId = document.getElementsByClassName('show task-table')[0].id;
    document.getElementById('taskDate').value=document.getElementById(tableId+'Deadline').innerHTML;
});

$('#listName').on('keyup', function(){
    checkEnableSubmit(listNameOk,listDateOk,listSubmit,'list','#newList');
});

$('#listDate').change(function(){
    checkEnableSubmit(listNameOk,listDateOk,listSubmit, 'list', '#newList');
});

$('#taskName').on('keyup', function(){
    checkEnableSubmit(taskNameOk, taskDateOk,taskSubmit,'task', '#newTask');
});

$('#taskDate').change(function(){
    checkEnableSubmit(taskNameOk, taskDateOk,taskSubmit,'task', '#newTask');
});

$('#modifyListName').on('keyup', function(){
    checkEnableSubmit(modifyNameOk, modifyDateOk,modifySubmit,'modifyList','#modifyList');
});

$('#modifyListDate').change(function(){
    checkEnableSubmit(modifyNameOk, modifyDateOk,modifySubmit,'modifyList','#modifyList');
});

//Check if form is filled out ok and enable submission buttons
function checkEnableSubmit(name, date, submitBtn, input, formId){
    name=validateName(input+'Name');
    date=validateDate(input+'Date');
    if(name[0] && date[0]){
        submitBtn.disabled=false;
        showSuccessMessage(formId);
    }
    else{
        submitBtn.disabled=true;
        if(!name[0]&&!date[0]){
            msg=name[1]+('<br>')+date[1];
            showErrorMessage(msg,formId)
        }
        else if(name[0] && !date[0]){
            showErrorMessage(date[1], formId);
        }
        else if(date[0] && !name[0]){
            showErrorMessage(name[1], formId);
        }
    }
}

//On modal hidden, reset form and disable buttons
$(document).on("hidden.bs.modal", function(){
    $('form').trigger('reset');
    $('.formSubmitBtn').prop('disabled',true);
    $('.formAlert').hide();
});

//Handle show and hide for collapse.  
$(document).on('show.bs.collapse hide.bs.collapse', function (e) {
    if(e.type=='show'){
        $('.collapse').collapse('hide');

        //Show correct permission table
        $('.existingPermTables').addClass('hide');
        var id='#'+ 'existingPerm' + e.target.id.split('-')[0];
        $(id).removeClass('hide');
        
        $('#emptyContainer').hide();

        //Enable buttons
        enableButtons();
    }else{
        $('.existingPermTables').addClass('hide');
        disableButtons();
        $('#emptyContainer').fadeIn();
    }
});

//Prevent enter as that could refresh page
$(document).on("submit", function (e){
    e.preventDefault();
    if(e.target.id=="newListForm"){
        submit.click();
    }
    else if(e.target.id=="newTaskForm"){
        taskSubmit.click();
    }
    else if(e.target.id=="modifyListForm"){
        modifySubmit.click();
    }

    return false;
});

//On load, reset forms and disable buttons
$(document).ready(function(e){
    disableButtons();
    $('form').trigger('reset');
    newListSave.disabled=true;
    windowSize();
});

//Handle table row selections
$(document).on('click', 'tr', function (e) {
    if(e.currentTarget.classList.contains('selected') || e.currentTarget.classList.contains('thead-row')){
        return;
    }
    //Remove selected from all rows
    $('tr').removeClass('selected')
    
    //Enable deletetask button
    document.getElementById('deleteTask').disabled=false;

    //Add selected to clicked row
    e.currentTarget.classList.add('selected');
});

//Confirm and delete task
$(document).on('click', '#deleteTask', function (e){
    var res = confirm('Are you sure you want to delete task?')
    if(res){
        document.getElementsByClassName('selected')[0].remove();
    }
});

//Enable or disable task buttons
function enableButtons(){
    $('#taskNav button:not(#deleteTask)').prop('disabled',false);
}
function disableButtons(){
    $('#taskNav button').prop('disabled',true);
}


//Add a new list
function addList(){
    //Create Button
    var newList = document.createElement("button");
    const sidebar = document.getElementById('sidebar');
    
    //Get id based on name
    var id=document.getElementById('listName').value.split(' ')[0];

    //ensure unique id
    if(document.getElementById(id)){
        var newid=id+Math.floor(Math.random() * 10).toString();
        while(document.getElementById(newid)){
            newid=id+Math.floor(Math.random() * 10).toString();
        }
        id=newid;
    }

    //Create button and append
    newList.id=id+"-btn";
    var hash="#"+id;
    newList.setAttribute('data-bs-target',hash);
    newList.setAttribute('data-bs-toggle',"collapse");
    newList.classList.add("btn") 
    newList.classList.add("btn-primary")
    newList.innerHTML=document.getElementById('listName').value;
    sidebar.appendChild(newList);

    //Create list table elements
    var newRow=document.createElement("div");
    var newTaskList=document.createElement("div");
    var newTable=document.createElement("table");
    var thTitle=document.createElement("th");
    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    var thDate=document.createElement("th");
    var tb=document.createElement("tbody");
    
    newTable.id=id+"-table"
    newRow.classList.add("row");
    newTaskList.classList.add("collapse");
    newTaskList.classList.add("task-table");
    newTaskList.id=id;
    newTable.classList.add("table");
    newTable.classList.add("table-bordered");
    tr.classList.add('thead-row')

    //Create table information
    tr.innerHTML="<th class='col-sm-1 text-center' scope='col'><input class='form-check-input' type='checkbox' value='' id='masterCheck' onclick='masterCheck(this, `tasks`)'></th>";
    thTitle.classList.add("text-center");
    thTitle.classList.add("tasks");
    thTitle.classList.add("title");
    thTitle.id=id+'Title';
    thTitle.setAttribute("scope","col");
    thDate.classList.add("text-center");
    thDate.classList.add("tasks");
    thDate.classList.add("date");
    thDate.id=id+'Deadline';
    thDate.setAttribute("scope","col");
    thTitle.innerHTML=document.getElementById('listName').value;
    thDate.innerHTML=formatDate(document.getElementById('listDate').value);

    //append all elements
    tr.appendChild(thTitle);
    tr.appendChild(thDate);
    thead.appendChild(tr);
    newTable.appendChild(thead);
    newTable.appendChild(tb);
    newTaskList.appendChild(newTable);
    newRow.appendChild(newTaskList);
    document.getElementById('task-container').appendChild(newRow);

    //Create Modal Table
    var permTab = document.createElement('table');
    var tabBody = document.createElement('tbody');
    permTab.id='existingPerm'+id;
    permTab.classList.add('table', 'table-bordered', 'hide', 'existingPermTables');
    permTab.appendChild(tabBody);
    document.getElementById('existingUsers').appendChild(permTab);

    newList.click();

}

//Add a task to the table
function addTask(event) {

    //Get task name and ID
    var taskName = document.getElementById('taskName').value;
    var taskId=taskName.split(' ')[0];
    var taskdate = formatDate(document.getElementById('taskDate').value);

    //Create structure
    var checkboxtd = document.createElement('td');
    var check = document.createElement("input");
    var id = document.getElementsByClassName('show')[0].id;

    //set table id
    id=id+'-table';
    const table=document.getElementById(id).getElementsByTagName('tbody')[0];
    var title=document.createElement('td');
    var date=document.createElement('td');

    //create table
    var tr = document.createElement("tr");
    checkboxtd.classList.add("check");
    checkboxtd.classList.add("text-center");
    check.classList.add("form-check-input");
    check.setAttribute("type","checkbox");
    check.setAttribute("value", "");
    var scratch = "scratchText(this, '" + taskId + "')";
    check.setAttribute("onclick",scratch);

    title.classList.add('text-center');
    date.classList.add('text-center');

    title.classList.add(taskId);
    date.classList.add(taskId);

    title.classList.add('tasks');
    date.classList.add('tasks');

    title.classList.add('title');
    date.classList.add('date');
    checkboxtd.appendChild(check);

    title.innerHTML=taskName;
    date.innerHTML=taskdate;

    //Append all child elements
    tr.appendChild(checkboxtd);
    tr.appendChild(title);
    tr.appendChild(date);
    table.appendChild(tr);

}

//Get current list name and date
function modifyListForm(){
    var table = document.getElementsByClassName('show task-table')[0].id;
    document.getElementById('modifyListName').value=document.getElementById(table+'Title').innerHTML;
    document.getElementById('modifyListDate').value=parseDate(document.getElementById(table+'Deadline').innerHTML);
}


//Modify List Name and/or date
function modifyList(){
    var table = document.getElementsByClassName('show task-table')[0];
    var button = document.getElementById(table.id+'-btn');
    document.getElementById(table.id+'Title').innerHTML=document.getElementById('modifyListName').value;
    document.getElementById(table.id+'Deadline').innerHTML=formatDate(document.getElementById('modifyListDate').value);
    button.innerHTML=document.getElementById('modifyListName').value;

}


//Delete the full list
function deleteList(){
    var res = confirm('Are you sure you want to delete this List?')
    if(res){
        var table = document.getElementsByClassName('show task-table')[0];
        var button = document.getElementById(table.id+'-btn');
        table.remove();
        button.remove();
        disableButtons();
        $('#modifyListModal').modal('hide');
    }
   
}

function windowSize() {
    widthPer = window.innerWidth/width;
    heightPer = window.innerHeight/height
    newW=(Math.round(200*widthPer)).toString()+'px';
    newH=(Math.round(200*widthPer)).toString()+'px';
    bs=newH+' auto'
    var image=document.getElementById('emptyImage');
        image.style.backgroundSize = bs;
        image.style.width=newW;
        image.style.height=newW;

}

window.onresize = windowSize;