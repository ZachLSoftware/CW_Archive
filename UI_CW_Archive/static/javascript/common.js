/*Common funtions used by more then one page*/

//Autocomplete Function for city selection
$( function() {
    var availableTags = [
      "Leicester, UK",
      "Leeds, UK",
      "London,UK",
      "Birmingham, UK",
      "Manchester, UK",
      "Edinburgh, UK",
      "Cardiff, UK"
    ];
    $( "#citySelect" ).autocomplete({
      source: availableTags,
      autoFill: true,
      select: function( event, ui ) {
            $( "#citySelect" ).val( ui.item.value );
            document.getElementById("citySelectBtn").innerHTML=ui.item.value;
            return false;
        },
        change: function (e, ui) {
        if (!(ui.item)) {
            e.target.value = "";
            alert("Option must be selected from the list only.");
        }
        }
    });
  } );

//Used to scratch the text of a completed task
function scratchText(x, y){
    if(x.checked==true){
       $('.'+y).addClass('checked');
    }else{
        $('.'+y).removeClass('checked');
    }
}


//If the list check is checked, check or uncheck all tasks
function masterCheck(x,y){
    if(x.checked==true){
        $('.'+y).addClass('checked');
        $('.form-check-input').prop('checked', true);

    }else{
        $('.'+y).removeClass('checked');
        $('.form-check-input').prop('checked', false);
    }
}

function emptyText(){
    $('#emptyContainer').fadeIn();
}


//Convert date form option between datetime-local and date
function convertDateTime(inputId){
    if($(inputId + 'AllDay').is(":checked")){
        var date=$(inputId + 'StartTime').val().split('T')[0];
        $(inputId + 'StartTime').prop('type', 'date');
        $(inputId + 'StartTime').val(date);
        $(inputId + 'EndTime').prop('type', 'date');
        $(inputId + 'EndTime').val(date);
        $(inputId + 'EndTime').prop('disabled','true');
      }else{
        var date=$(inputId + 'StartTime').val()+'T00:00';
        $(inputId + 'StartTime').prop('type', 'datetime-local');
        $(inputId + 'StartTime').val(date);
        $(inputId + 'EndTime').prop('type', 'datetime-local');
        $(inputId + 'EndTime').val(date);
        $(inputId + 'EndTime').removeAttr("disabled");
      }
}

//Set style to the default
$('#defaultStyle').click(function(e){
    var theme = 'static/css/style.css';

    //Check if index, otherwise add relative path link
    if(!$('#homeLink').hasClass('active')){
        theme='../'+theme
    }

    //Change stylesheet
	document.getElementById('styleSheet').setAttribute('href', theme);

    //Add Bootstrap themes to tables and dropdown menu
    $('table').removeClass('table-dark');
    $('.dropdown-menu').removeClass('dropdown-menu-dark');
});

$('#darkStyle').click(function(e){
    var theme = 'static/css/darkStyle.css';

    //Check if index, otherwise add relative path link
    if(!$('#homeLink').hasClass('active')){
        theme='../'+theme
    }

     //Change stylesheet
	document.getElementById('styleSheet').setAttribute('href', theme);

    //Add Bootstrap themes to tables and dropdown menu
    $('table').addClass('table-dark');
    $('.dropdown-menu').addClass('dropdown-menu-dark');
});

$('#highContrast').click(function(e){
    var theme = 'static/css/highContrast.css';

    //Check if index, otherwise add relative path link
    if(!$('#homeLink').hasClass('active')){
        theme='../'+theme
    }

     //Change stylesheet
	document.getElementById('styleSheet').setAttribute('href', theme);

    //Add Bootstrap themes to tables and dropdown menu
    $('table').addClass('table-dark');
    $('.dropdown-menu').addClass('dropdown-menu-dark');
});

//Shrink Text
$('#shrink').click(function(){
    $('html').css('font-size', 'smaller');
});


//Normalize Text
$('#normal').click(function(){
    $('html').css('font-size', 'inherit');
});


//Enlarge Text
$('#larger').click(function(){
    $('html').css('font-size', 'larger');
});

//For Account Page
$('#updatePassword').click(function(){
    window.location="updatePassword.html"
});


//For Account Page
$('#deleteAccount').click(function(){
    var res=confirm("Delete Account? This action cannot be undone!")
    if(res){
        window.location="login.html"
    }
});


//Parse the date from a table into a form
function parseDate(date){
    var newDate;
    if(date.includes(', ')){
        var full = date.split(', ')[0];
        var time = date.split(', ')[1];
        var year = full.split('/')[2];
        var month=full.split('/')[1];
        var day = full.split('/')[0];
        newDate = ([year,month,day].join('-')+'T'+time);
        
    }
    else{     
        var year = date.split('/')[2];
        var month=date.split('/')[1];
        var day = date.split('/')[0];
        newDate = ([year,month,day].join('-'));
    }
    return newDate;
}


//Format a date from a form for a table
function formatDate(date){
    var newDate;
    if(date.includes('T')){
        var full = date.split('T')[0];
        var time = date.split('T')[1];
        var year = full.split('-')[0];
        var month=full.split('-')[1];
        var day = full.split('-')[2];
        newDate = ([day,month,year].join('/')+', '+time.split('+')[0]);
    }else{
        var year = date.split('-')[0];
        var month=date.split('-')[1];
        var day = date.split('-')[2];
        newDate = ([day,month,year].join('/'));
    }
    return newDate;
}

//Validate event form and enable submit button (Events and Calendar)
function checkEventEnableSubmit(submitBtn, input, formId){
    var name = false;
    var time;
    var checked = $('#'+input+'AllDay').is(":checked");
    time=validateEventDate(input, checked);
    name=validateName(input+'Name');
        if(name[0] && time[0] && time[2]){
        submitBtn.disabled=false;
        showSuccessMessage(formId+'ST');
        if(!checked){
          showSuccessMessage(formId+'ET');
        }
        showSuccessMessage(formId+'Name');
        showSuccessMessage(formId);
    }
    else{
        submitBtn.disabled=true;
        hideMessage(formId);
        if(!time[0]){
            showErrorMessage(time[1], formId+'ST');
        }else{
            showSuccessMessage(formId+'ST');
        }
        if(!name[0]){
            showErrorMessage(name[1], formId+'Name');
        }else{
            showSuccessMessage(formId+'Name');
        }
        if(!checked){
          if(!time[2]){
              showErrorMessage(time[3], formId+'ET');
          }else{
              if(time[1]=="None"){
                  hideMessage(formId+'ET');
              }else{
                  showSuccessMessage(formId+'ET');
              }
          }
      }else{
        hideMessage(formId+'ET');
      }
    }
}