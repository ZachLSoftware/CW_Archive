const addSubmit = document.getElementById('addEventSubmitBtn');

//Stores the info of a selected object to be used later
var currentInfo;

//Variable to store calendar for specific tasks
var cal;

//Create a new callendar
document.addEventListener('DOMContentLoaded', function() {

    //Get Div where calendar will be placed
    var calendarDiv = document.getElementById('eventCalendar');

    //Create Calendar
    var calendar = new FullCalendar.Calendar(calendarDiv, {
      initialView: 'dayGridMonth',
      customButtons:{
        eventAddBtn: {
          text: 'Add Event',
          click: function() {
            var today =new Date().toISOString();
            $('#addEventStartTime').val(today.split(':')[0]+':'+today.split(':')[1]);
            $('#addEventEndTime').val(today.split(':')[0]+':'+today.split(':')[1]);
            $('#addEventModal').modal('show');
            $('#addEventSubmitBtn').click(function(e){
              calendar.addEvent(addNewEvent());
              $('#addEventModal').modal('hide');
            });
          }
        }
      },

      headerToolbar: {
        start: 'prev,next today eventAddBtn',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      businessHours: true,
      dayMaxEvents: true, // allow "more" link when too many events

      //Create Events
      events: [
        {
          title: 'BBQ',
          start: '2022-05-20T16:30:00',
          end: '2022-05-20T20:30:00',
          id: '#bbq'
        },
        {
          title: 'Coursework Due',
          start: '2022-05-13T16:30:00',
          end: '2022-05-13T17:00:00',
          id: '#coursework'
        },
        {
          title: 'Hairdresser',
          start: '2022-05-16T09:00:00',
          end: '2022-05-16T11:30:00',
          id: '#hair'
        },
        {
          title: 'Dog Groom',
          start: '2022-05-17T14:30:00',
          end: '2022-05-17T16:30:00',
          id: '#dog'
      },
    ],

    //Handle Event Selection
  eventClick: function(info) {
    cal=this;
    //Checks if the selection is a full day selection or a time selection
    if(info.event.allDay){

      //Set start and end to the same time
      var start = formatDate(info.event.startStr);
      var end = formatDate(info.event.startStr);        
      
    }else{

      //Strip timezone from end and format
      var start = formatDate(info.event.startStr.split('+')[0]);
      var end = formatDate(info.event.endStr.split('+')[0]);
    }

    //Set event modal start and time (In case event has been changed via dragging)
    $(info.event.id+"ET").text(end);
    $(info.event.id+"ST").text(start);

    //Open the Modal table
    $(info.event.id+'Modal').collapse('show');
    $('#eventModal').modal('show');

    $('#modifyEventBtn').click(function(){
      updateEventForm(info.event.id.split('#')[1]);
      $('#addEventLabel').text('Modify Event');
      $('#addEventModal').modal('show');
    });

    $('#addEventSubmitBtn').click(function(e){
      $(info.event.id+'-table').remove();
      info.event.remove();
      cal.addEvent(addNewEvent());
      $('#addEventModal').modal('hide');
    });

    $('#removeEventBtn').click(function(){
      var res = confirm('Are you sure you want to delete this event?');
      if(res){
        info.event.remove();
        $(info.event.id+'Modal').remove();
        $('#eventModal').modal('hide');
      }
    });
        
  },
  //Handle Date Selection
  select: function(info){

    //Copy info into global variable (Bug if not)
    currentInfo = info;

    //Copy calendar into global variabl (Bug if not)
    cal=this;

    //Check if we are already on a day view and remove button if we are
    if(info.view.type==="timeGridDay"){
      $('#dayGoTo').removeClass('show');
    }else{
      $('#dayGoTo').addClass('show');
    }

    //show selection modal
    if(info.allDay){
      $('#daySelectLabel').text(formatDate(info.startStr));
    }else{
      $('#daySelectLabel').text(formatDate(info.startStr)+ " - " + formatDate(info.endStr));
    }
    $('#daySelectModal').modal('show');
    

    //If user selects to view the day, open the day
    $('#dayGoTo').click(function(e){
      
      cal.changeView('timeGridDay', info.start);
      });
    
    //Create a listener for adding an event (Needs to be done here to access calendar properly)
    $('#addEventSubmitBtn').click(function(e){
      cal.addEvent(addNewEvent());
      $('#addEventModal').modal('hide');
    });
  
  }
});

    calendar.render();
});


//Reset all forms on page refresh
$(document).ready(function(e){
  $('form').trigger('reset');
  $('.fc-day-today').prop('id','today')
});


//Create a new event table
function addEventTable(id=null){

  //Get the first word of the event name for an ID
    var id=document.getElementById('addEventName').value.split(' ')[0];

    var newRow=document.createElement("div");
    var newTable=document.createElement("table");
  
    //Create Table and div to store new event
    newTable.id=id+"-table"
    newRow.classList.add("row", "collapse", "eventModalTable");
    newRow.id=id+'Modal';
    newTable.classList.add("table");
    newTable.classList.add("table-bordered","table-hover");
      //Append new table to Modal View
  newRow.appendChild(newTable);
  document.getElementById('eventViewModal').appendChild(newRow);
  var loc = $('#addEventLocation').val();
  if(loc.length<1){
    var loc = "None";
  }
  var html = `<tbody><tr><td class="tdtitle">Event</td><td id="`+id+`Name" class="value">`+$('#addEventName').val() +`</td></tr>
              <tr><td class="tdtitle">Start Time</td><td id="`+id+`ST" class="value">`+formatDate($('#addEventStartTime').val())+`</td></tr>
              <tr><td class="tdtitle">End Time</td><td id="`+id+`ET" class="value">`+formatDate($('#addEventEndTime').val())+`</td></tr>
              <tr><td class="tdtitle">All Day?</td><td id="`+id+`AllDay" class=value">`+$('#addEventAllDay').is(":checked")+`</td></tr>
              <tr><td class="tdtitle">Reminder</td><td id="`+id+`Rem" class="value">`+$('#addEventReminder option:selected').text()+`</td></tr>
              <tr><td class="tdtitle">Location</td><td id="`+id+`Loc" class="value">`+loc+`</td></tr>
              <tr><td class="tdtitle">Tasklist</td><td id="`+id+`TL" class="value">`+$('#addEventList').val()+`</td></tr>
              <tr><td class="tdtitle">Forecast</td><td id="`+id+`FC" class="value">Partly Cloudy 13C.</td></tr></tbody>`
  newTable.innerHTML=html;
}


//Handle Modal opening and Closing
$(document).on('show.bs.modal hide.bs.modal', function (e) {
  if(e.type=='show'){

      //Close all event tables except for requested one.
      $('.eventModalTable').collapse('hide');
    
    }else{
      //Hide all tables on close
      $('.eventModalTable').collapse('hide');

      //Reset Time variables
      $('#addEventStartTime').prop('type', 'datetime-local');
      $('#addEventEndTime').prop('type', 'datetime-local');

      //Disable buttons and reset forms
      $('#addEventEndTime').removeAttr("disabled");
      $('#addEventForm').trigger('reset');
      $('.formSubmitBtn').prop('disabled',true);
      $('.formAlert').hide();
  }

});

//Validation checks
$('#addEventName').on('keyup', function(e){
  checkEventEnableSubmit(addSubmit, 'addEvent', '#addEvent');
});

$('#addEventStartTime').on('change', function(e){
 if($('#addEventAllDay').is(":checked")){
   $('#addEventEndTime').val($('#addEventStartTime').val());
 }
  checkEventEnableSubmit(addSubmit, 'addEvent', '#addEvent');
});
$('#addEventEndTime').on('change', function(e){
  checkEventEnableSubmit(addSubmit, 'addEvent', '#addEvent');
});

//Add the event to the calendar. Return a new event variable
function addNewEvent(){

  //Get necessary info for calendar
  var start = $('#addEventStartTime').val();
  var end = $('#addEventEndTime').val();
  var allday = $('#addEventAllDay').is(":checked");

  //create an event variable
  var event ={
    
    title: $('#addEventName').val(),
    allDay: allday,
    start: start,
    end: end,
    id: '#'+$('#addEventName').val().split(' ')[0]
  }
    //Add the event to the event tables
    addEventTable();

    //Reset Form
    $('#addEventStartTime').prop('type', 'datetime-local');
    $('#addEventEndTime').prop('type', 'datetime-local');
    $('#addEventEndTime').removeAttr("disabled");
    $('.formSubmitBtn').prop('disabled',true);
    $('.formAlert').hide();

    return event;
}

function updateEventForm(table){
      //Find the current list id

      //Get the proper date format
      $('#addEventAllDay').prop("checked", ($('#'+table+'AllDay').text()==='true'));
      convertDateTime('#addEvent');
  
      //Parse the date from the table to enter into form
      var start = parseDate($('#'+table+'ST').text());
      var end = parseDate($('#'+table+'ET').text());
  
      //Add existing values into form
      $('#addEventName').val($('#'+table+'Name').text());
      $('#addEventStartTime').val(start);
      $('#addEventEndTime').val(end);
      $('#addEventReminder').val($('#'+table+'Rem').text().split(' ')[0]);
      $('#addEventLocation').val($('#'+table+'Loc').text());
      $('#addEventList').val($('#'+table+'TL').text().split(' ')[0]);
};


//Handle New Event Click
$('#dayAddEvent').click(function(e){
  //Convert Form based on allDay preset of calendar
  if(currentInfo.allDay){
    var date=currentInfo.startStr;
    $('#addEventAllDay').prop('checked', true)
    $('#addEventStartTime').prop('type', 'date');
    $('#addEventStartTime').val(date);
    $('#addEventEndTime').prop('type', 'date');
    $('#addEventEndTime').val(date);
    $('#addEventEndTime').prop('disabled',true);
  }
  else{
    $('#addEventStartTime').val(currentInfo.startStr.split('+')[0]);
    $('#addEventEndTime').val(currentInfo.endStr.split('+')[0]);
  }

  //Open Modal
  $('#addEventLabel').text('Create New Event');
  $('#addEventModal').modal('show');
});

//
$('#addEventAllDay').on('change', function(e){
  //convert date type based on check
  convertDateTime('#addEvent')
  checkEventEnableSubmit(addSubmit, 'addEvent', '#addEvent');
});
