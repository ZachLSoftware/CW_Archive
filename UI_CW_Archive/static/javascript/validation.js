//Validate Email inputs
function validateEmail(inputId){
    //Regex String
    const re =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    //Get email
    const email = document.getElementById(inputId).value;
  
    //Regex Test and return value
  if(!re.test(email)){
      return [false, 'Not a valid email address'];
  }
  else{
      return [true, 'input ok'];
  }
}

//Validates name length
function validateName(inputId){
    var newName = document.getElementById(inputId).value;
    if(newName.length>20){
        return [false, 'List name must be less then 20 characters.'];
    }
    else if (newName.length<1){
        return [false, 'List name must have at least 1 character.'];
    }else{

        return [true, 'OK'];
    }
}

//Validates event date inputs
function validateEventDate(inputId, checked){

    //Get start and end time
    var sd = document.getElementById(inputId+'StartTime').value;
    var ed = document.getElementById(inputId+'EndTime').value;

    //Split time off of date
    var sDate=sd.split('T')[0];
    var eDate=ed.split('T')[0];

    //If not all day get time, else set time to midnight
    if(!checked){
        var sTime=sd.split('T')[1];
        var eTime=ed.split('T')[1];
    }else{
        var sTime='00:00';
        var eTime='00:00';
    }
    

    //Validate the start and end dates are ok
    var sOk=validateDate(new Date(sDate));
    var eOk=validateDate(new Date(eDate));

    //If both dates are ok check if start and end are set ok
    if(sOk[0] && eOk[0]){
        if(sDate>eDate){
            return [false, 'Start date cannot be after end date', false, 'End date cannot be before start date']
        }else if(sDate==eDate){
            if(sTime>eTime){
                return [false, 'Start time cannot be after end time', false, 'End time cannot be before start time']
            }else{
                return [true, 'OK', true, 'OK'];
            }
        }else{
            return [true, 'OK', true, 'OK'];
        }
    }
    else{
        return [sOk[0], sOk[1], eOk[0], eOk[1]];
    }
}


//Validates a date to avoid errors
function validateDate(inputId){

    //Check if input is of type date, else get the date
    if(!(inputId instanceof Date)){
        var newDate = new Date(document.getElementById(inputId).value);
    }else{
        var newDate = inputId;
    }

    //If not a number, is empty
    if(isNaN(newDate)){
        return [false, 'Date cannot be empty'];
    }

    //If date is for a task
    if(inputId=='taskDate'){

        //Get list date
        var parentDate = new Date(parseDate(document.getElementById(document.getElementsByClassName('show task-table')[0].id+'Deadline').innerHTML));
        
        //Compare list date to task date
        if(parentDate < newDate){
            return [false, 'Date cannot be after List Deadline.'];
        }

    }
    //Get the current date
    var cDate=new Date();
    cDate.setHours(0,0,0,0);
    
    //Ensure that new date is not set in the past
    if(cDate > newDate){
        return [false, 'Date cannot be in the Past'];
    }
    else{

        return [true, 'OK'];
    }
    
}


//Show error messages
function showErrorMessage(msg, id){
    var error= $(id+'Error');
    var success= $(id+'Success');
    success.hide();
    error.html(msg);
    error.show();
}

//Show success Messages
function showSuccessMessage(id, msg="OK"){
    
    var error= $(id+'Error');
    var success= $(id+'Success');
    error.hide();
    success.html(msg);
    success.show();
}

//Hide messages
function hideMessage(id){
    var error= $(id+'Error');
    var success= $(id+'Success');
    error.hide();
   success.hide();
}