//Get various buttons (Done before properly integrating Jquery)
const eventSubmit = document.getElementById('newEventSave');
const modify = document.getElementById('modifyEventBtn');
const modifySubmit = document.getElementById('eventSaveMod');
const delEvent = document.getElementById('deleteEventBtn');
const height=window.screen.height;
const width=window.screen.width;

//Add Button Click Listeners
eventSubmit.addEventListener('click', addEvent)
modify.addEventListener('click', modifyEventForm);
modifySubmit.addEventListener('click', modifyEvent);
delEvent.addEventListener('click', deleteEvent);


//Validation listeners
$('#eventName').on('keyup', function(e){
    checkEventEnableSubmit(eventSubmit, 'event', '#event');
});

$('#eventStartTime').on('change', function(e){
    if($('#eventAllDay').is(":checked")){
        $('#eventEndTime').val($('#eventStartTime').val());
      }
    checkEventEnableSubmit(eventSubmit, 'event', '#event');
})
$('#eventEndTime').on('change', function(e){
    checkEventEnableSubmit(eventSubmit, 'event', '#event');
})
$('#modEventName').on('keyup', function(e){
    checkEventEnableSubmit(modifySubmit, 'modEvent', '#modEvent');
});

$('#modEventDate').on('change', function(e){
    checkEventEnableSubmit(modifySubmit, 'modEvent', '#modEvent');
})

$('#modEventStartTime').on('change', function(e){
    checkEventEnableSubmit(modifySubmit, 'modEvent', '#modEvent');
})
$('#modEventEndTime').on('change', function(e){
    checkEventEnableSubmit(modifySubmit, 'modEvent', '#modEvent');
})


//Resets forms when modal is hidden
$(document).on("hidden.bs.modal", function(){
    $('form').trigger('reset');
    $('.formSubmitBtn').prop('disabled',true);
    $('.formAlert').hide();
});

//Shows the correct event and permission table
$(document).on('show.bs.collapse hide.bs.collapse', function (e) {
    if(e.type=='show'){
        $('.collapse').collapse('hide');
        $('.existingPermTables').addClass('hide');
        var id='#'+ 'existingPerm' + e.target.id.split('-')[0];
        $(id).removeClass('hide');
        $('#emptyContainer').hide();
        enableButtons();
    }else{
        $('.existingPermTables').addClass('hide');
        $('#emptyContainer').fadeIn();
        disableButtons();
    }
});


//Disables buttons and resets forms
$(document).ready(function(e){
    disableButtons();
    $('.formSubmitBtn').prop('disabled',true);
    $('form').trigger('reset');
    windowSize();
});


//Handle selection of a table row
$(document).on('click', 'tr', function (e) {
    if(e.currentTarget.classList.contains('selected')||e.currentTarget.classList.contains('thead-row')){
        return;
    }
    $('tr').removeClass('selected');
    e.currentTarget.classList.add('selected');

});

//Enable or disable event modifcation buttons
function enableButtons(){
    $('#eventNav button').prop('disabled', false);
}
function disableButtons(){
    $('#eventNav button').prop('disabled', true);
}


//Add an event to the page
function addEvent(){
    var newEventBtn = document.createElement("button");
    const sidebar = document.getElementById('sidebar');
    var id=document.getElementById('eventName').value.split(' ')[0];

    //Ensure unique ID
    if(document.getElementById(id)){
        var newid=id+Math.floor(Math.random() * 10).toString();
        while(document.getElementById(newid)){
            newid=id+Math.floor(Math.random() * 10).toString();
        }
        id=newid;
    }

    //Create a new sidebar button and append
    newEventBtn.id=id+"-btn";
    var hash="#"+id;
    newEventBtn.setAttribute('data-bs-target',hash);
    newEventBtn.setAttribute('data-bs-toggle',"collapse");
    newEventBtn.classList.add("btn") 
    newEventBtn.classList.add("btn-primary")
    newEventBtn.innerHTML=document.getElementById('eventName').value;
    sidebar.appendChild(newEventBtn);

    //Create structure for new event
    var newRow=document.createElement("div");
    var newEventDiv=document.createElement("div");
    var newTable=document.createElement("table");
    
    newTable.id=id+"-table"
    newRow.classList.add("row");
    newEventDiv.classList.add("collapse");
    newEventDiv.classList.add("event-table");
    newEventDiv.id=id;

    newTable.classList.add("table");
    newTable.classList.add("table-bordered","table-hover");
    
    //get start and end
    var start=formatDate($('#eventStartTime').val());
    var end=formatDate($('#eventEndTime').val());

    //Create the HTML for the table body
    var html = `<tbody><tr><td class="tdtitle">Event</td><td id="`+id+`Name" class="value">`+$('#eventName').val() +`</td></tr>
                <tr><td class="tdtitle">Start Time</td><td id="`+id+`ST" class="value">`+start+`</td></tr>
                <tr><td class="tdtitle">End Time</td><td id="`+id+`ET" class="value">`+end+`</td></tr>
                <tr><td class="tdtitle">All Day?</td><td id="`+id+`AllDay" class="value">`+$('#eventAllDay').is(":checked")+`</td></tr>
                <tr><td class="tdtitle">Reminder</td><td id="`+id+`Rem" class="value">`+$('#eventReminder option:selected').text()+`</td></tr>
                <tr><td class="tdtitle">Location</td><td id="`+id+`Loc" class="value">`+$('#eventLocation').val()+`</td></tr>
                <tr><td class="tdtitle">Tasklist</td><td id="`+id+`TL" class="value">`+$('#eventList').val()+`</td></tr>
                <tr><td class="tdtitle">Forecast</td><td id="`+id+`FC" class="value">Partly Cloudy 13C.</td></tr></tbody>`

    //Set table html
    newTable.innerHTML=html;

    //Append to parent elements
    newEventDiv.appendChild(newTable);
    newRow.appendChild(newEventDiv);
    document.getElementById('event-container').appendChild(newRow);

    //Create Modal Table
    var permTab = document.createElement('table');
    var tabBody = document.createElement('tbody');
    permTab.id='existingPerm'+id;
    permTab.classList.add('table', 'table-bordered', 'hide', 'existingPermTables', 'table-hover');
    permTab.appendChild(tabBody);
    document.getElementById('existingUsers').appendChild(permTab);

}


//Get current list name and date
function modifyEventForm(){
    //Find the current list id
    var table = document.getElementsByClassName('show event-table')[0].id;

    //Get the proper date format
    $('#modEventAllDay').prop("checked", ($('#'+table+'AllDay').text()==='true'));
    convertDateTime('#modEvent');

    //Parse the date from the table to enter into form
    var start = parseDate($('#'+table+'ST').text());
    var end = parseDate($('#'+table+'ET').text());

    //Add existing values into form
    $('#modEventName').val($('#'+table+'Name').text());
    $('#modEventStartTime').val(start);
    $('#modEventEndTime').val(end);
    $('#modEventReminder').val($('#'+table+'Rem').text().split(' ')[0]);
    $('#modEventLocation').val($('#'+table+'Loc').text());
    $('#modEventList').val($('#'+table+'TL').text().split(' ')[0]);

}


//Modify List Name and/or date
function modifyEvent(){
    var table = document.getElementsByClassName('show event-table')[0].id;
    var button = document.getElementById(table+'-btn');

    //Get new values and modify event
    $('#'+table+'Name').text($('#modEventName').val());
    $('#'+table+'ST').text(formatDate($('#modEventStartTime').val()));
    $('#'+table+'ET').text(formatDate($('#modEventEndTime').val()));
    $('#'+table+'Rem').text($('#modEventReminder option:selected').text());
    $('#'+table+'Loc').text($('#modEventLocation').val());
    $('#'+table+'AllDay').text($('#modEventAllDay').is(":checked"));
    $('#'+table+'TL').text($('#modEventList').val());
    button.innerHTML=$('#modEventName').val();

}


//Delete the event
function deleteEvent(){
    var res = confirm('Are you sure you want to delete this event?')
    if(res){
        var table = document.getElementsByClassName('show event-table')[0];
        var button = document.getElementById(table.id+'-btn');
        table.remove();
        button.remove();
        disableButtons();
        $('#modifyListModal').modal('hide');
    }
   
}

//Convert a from based on AllDay check
$('#modEventAllDay').on('change', function(e){
      convertDateTime('#modEvent');
      checkEventEnableSubmit(modifySubmit, 'modEvent', '#modEvent');
  });

$('#eventAllDay').on('change', function(e){
    convertDateTime('#event');
    checkEventEnableSubmit(eventSubmit, 'event', '#event');
  });

  //Resizes icon for screen size
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