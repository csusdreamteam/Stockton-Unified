// EXPORT SELECTORS ENGINE
var $$ = Dom7;



var selectedDate = new Date();


var event_dates = [];



$.when(loadCalendarEvents()).done(function(a1){
    // the code here will be executed when the ajax request is finished
	createCalendar();	//create calendar after we have fetched all the calendar events
	
	
});

function loadCalendarEvents() {
    // NOTE:  This function must return the value 
    //        from calling the $.ajax() method.
    return $.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/get_calendar_event_dates.php',
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			// YEE
			alert('error');
		} else {
			// display success message
			var row_count = data.length;
			
			
			for(var i = 0; i < row_count; i++){
				
				var event_date = data[i]['EVENT_DATE'];
				var newdate = new Date(+event_date);
				
			
				event_dates.push(newdate);	//populate our array that holds all our calendar events
				
				
				
			}
			
			

		}
	}).fail(function (data) {
		// for debug 
		
		alert('fail');
	});
}





// Initialize your app
var myApp = new Framework7({
	
	swipePanel: 'right',
	
	onPageInit: function (app, page) {
    if (page.name === 'main') {
			

			
			
			var Admin = 0;
			Admin = localStorage.admin;
			
			//IF USER IS AN ADMIN THEN LOAD NEWS FEED WITH ABILITY TO EDIT AND CREATE NEW POSTS
			if(Admin == 0){
				getNewsFeedReadOnly();
			}
			//IF USER IS NOT AN ADMIN THEN LOAD NEWS FEED (READ ONLY)
			else if(Admin == 1){
				getNewsFeedWithPrivileges();
				$('#addEventlistblock').append('<a href="#" id="addEventBtn" class="item-link list-button create-popup">Add Event</a>');
			}
				

			$('#new_post').on('click',function(){
				//IF USER CLICKS ON 'POST TO NEWS FEED' BUTTON
				mainView.router.loadPage('post_news_story.html');
			
			});
			
			
			//SIDEBAR
			$('#homepage').on('click',function(){
				//IF USER CLICKS ON 'HOME' BUTTON IN THE SIDEBAR
				
				window.location.href="main.html";
			});
			
			
			$('#help_and_support').on('click',function(){
				//IF USER CLICKS ON 'HELP AND SUPPORT' BUTTON IN THE SIDEBAR
				
				mainView.router.loadPage('help_and_support.html');
			});
			
			
			$('#logout').on('click',function(){
				//IF USER CLICKS ON 'LOGOUT' BUTTON IN THE SIDEBAR
				localStorage.clear();
				mainView.router.loadPage('start.html');
			
			});
			
			
			var ptrContent = $$('.pull-to-refresh-content');
			
			
			$('#res').on('click',function(){
				
				
				myApp.params.swipePanel = 'right';
				
				
				myApp.destroyPullToRefresh(page.container);	//DISABLE 'PULL TO REFRESH' IN RESOURCES PAGE
				
				
			});
			
			$('#feed').on('click',function(){

				
				myApp.params.swipePanel = 'right';
				
			
				myApp.initPullToRefresh(page.container);	//ENABLE 'PULL TO REFRESH' IN NEWS FEED
				

			});


			
			$('#calendar').on('click',function(){

				myApp.destroyPullToRefresh(page.container);	//DISABLE 'PULL TO REFRESH' IN CALENDAR PAGE
				//var myCalendar = $$('#calendar-inline-container');
				//myCalendar.close();
				
				var swipePanel = myApp.params.swipePanel;
				if(swipePanel == "right"){
					myApp.params.swipePanel = false;
				}
				
				


			});
			
			
			
			ptrContent.on('refresh', function (e) {
				myApp.params.swipePanel = true;
				setTimeout(function () {
					
					window.location.href="main.html";
					myApp.pullToRefreshDone();
				}, 1000);
					
			});
			
			
		}
	}
  
	
});



			
			
// ADD VIEW
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
	
	
});




function createCalendar(){

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];

 
var calendarInline = myApp.calendar({
	container: '#calendar-inline-container',
	value: [new Date()],
	firstDay: 0,
	events: event_dates,
	weekHeader: true,
	toolbarTemplate: 
		'<div class="toolbar calendar-custom-toolbar">' +
			'<div class="toolbar-inner">' +
				'<div class="left">' +
					'<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
				'</div>' +
				'<div class="center"></div>' +
				'<div class="right">' +
					'<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
				'</div>' +
			'</div>' +
		'</div>',
		
		
	onOpen: function (p) {
		
		
		$$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
		$$('.calendar-custom-toolbar .left .link').on('click', function () {
			calendarInline.prevMonth();
		});
		$$('.calendar-custom-toolbar .right .link').on('click', function () {
			calendarInline.nextMonth();
		});
		
	},
	onMonthYearChangeStart: function (p) {
		
		$$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
		
	},
	
	onDayClick: function(p, dayContainer, year, month, day){
		
		
		
		
		selectedDate = new Date(year,month,day);
		//alert(selectedDate);
		//alert(event_dates);
		
		if ($(dayContainer).hasClass('picker-calendar-day-has-events') ) {
 
			
			eventViewer();
			
		}
		else {
			
			clearEventViewer();
		}

		
	}
	

});


}



function clearEventViewer(){
	
	$('#event-viewer').empty();	//clear event viewer
}

var event_title; 
var event_description;
var event_start_time;


function eventViewer(){
	
	clearEventViewer();


	
	$.when(loadCalendarEventData()).done(function(a1){
    // the code here will be executed when the ajax request is finished
	// create calendar event block
	
		$('#event-viewer').append('<div class="content-block-title">'+
									'<p>Events on: '+selectedDate+'</p>'+
								'</div>'+
									'<div class="card">'+
									'<br>'+
								  '<div class="center" style="font-size:150%;color:red;" >'+event_title+'</div>'+
								  '<div class="card-content">'+
								  
									'<div class="card-content-inner">Details: '+event_description+'</div>'+
								  '</div>'+
								  '<div class="card-footer" id="footer">'+
										'<i class="fa fa-calendar" aria-hidden="true">&nbsp;'+selectedDate+'</i>'+
										'<i class="fa fa-clock-o" aria-hidden="true">&nbsp;'+event_start_time+'</i>'+
										
								  '</div>'+
								  
								'</div>');
								
								
		if(localStorage.admin == 1){
			$('#event-viewer').find('#footer').append('<div class="content-block"><a href="#" id="delete-event"  onclick="deleteEvent();" style="color:red;">delete</a></div>');
		}
	
	
	});


	
}




function deleteEvent(){
	
	
	var text = 'Delete event?';
	
	myApp.modal({
    title:  'Alert',
	bold: false,
    text: text,
    buttons: [
      {
        text: 'Cancel',
        onClick: function() {
			
        }
      },
	  	  
      {
        text: 'OK',
        bold: false,
        onClick: function() {
			
			
			var formData = {
			
				'date' : selectedDate
					
			};
			
			
			$.ajax({
				type : 'POST',
				url  : 'http://athena.ecs.csus.edu/~dteam/delete_event.php',
				data : formData,
				dataType : 'json',
				encode : true
			}).done(function (data) {
				// handle errors
				if (!data.success) {
					alert('error');
					
				} else {
					// display success message
					myApp.alert('deleted!')
					window.location.href="main.html";
					
				}
			}).fail(function (data) {
				// for debug
				console.log(data);
			});
	
	
			
			
			
          
        }
      },
    ]
  });
	

	
}



function loadCalendarEventData(){
	
	
	selectedDate = selectedDate.toISOString().substring(0, 10);
	
	
	var formData = {
			'date' : selectedDate
            
	};

	// process the form
	return $.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/get_calendar_event.php',
		data : formData,
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			alert('error');
			
		} else {
			// display success message
			event_title = data['EVENT_NAME'];
			event_description = data['DESCRIPTION'];
			event_start_time = data['TIME'];
			
			
		}
	}).fail(function (data) {
		// for debug
		console.log(data);
	});
	
	
	
}



$('#addEventBtn').on('click',function(){
	
	
	selectedDate = selectedDate.toISOString().substring(0, 10);
	//alert(selectedDate);
				
});


						
							

$$('.create-popup').on('click', function () {
  var popupHTML = '<div class="popup">'+
                    '<div class="content-block">'+
                      '<p><a href="#" class="close-popup" style="color:#ff3b30; font-size: 135%;">Cancel</a></p>'+
					'</div>'+
					  '<div class="list-block">'+
					  '<ul>'+
						'<li class="item-content">'+
						  '<div class="item-inner">'+
							'<div class="item-title"><span>Event Date:&nbsp;&nbsp;&nbsp;&nbsp;'+selectedDate+'</span> </div>'+
						  '</div>'+
						'</li>'+
						'<li class="item-content">'+
							
						  '<div class="item-inner">'+
							'<div class="item-title label">Start Time</div>'+
							'<div class="item-input">'+
								'<input type="time" id="time" name="form-event-time" value="time">'+
							'</div>'+
						  '</div>'+
						'</li>'+
						
						
						
						'<li class="item-content">'+
							
						  '<div class="item-inner">'+
							'<div class="item-title label">Title</div>'+
							'<div class="item-input">'+
								'<input type="text" id="title" name="form-event-title" placeholder="Title">'+
							'</div>'+
						  '</div>'+
						'</li>'+
						'<li class="item-content">'+
						  '<div class="item-inner">'+
							'<div class="item-title label">Description</div>'+
							'<div class="item-input">'+
								'<input type="text" id="description" name="form-event-description" placeholder="Description">'+
							'</div>'+
						  '</div>'+
						'</li>'+
					  '</ul>'+
					'</div>'+
					'<p class="row">'+
						'<div class="list-block">'+
						  '<ul>'+
							'<li>'+
							  '<a href="#" onclick = "submitEvent();" id="submit-event-btn" class="item-link list-button">Add Event</a>'+
							'</li>'+
						  '</ul>'+
						'</div>'  +
					'</p>'+
                  '</div>'
					
				  

				  
  myApp.popup(popupHTML);
});    


function submitEvent(){
		
	
		var time = $('input[name="form-event-time"]').val();
		var title = $('input[name="form-event-title"]').val()
		var input_has_errors = false;
		
		
		
		
		//CHECK IF INPUTS ARE EMPTY - IF SO, THEN SHOW ERROR ALERT	
		if((title==null || title=="") ||(time==null || time=="")){
			input_has_errors = true;
			myApp.alert('Start Time and Title are required','Error');
		}
		

		
		//IF INPUT HAS NO ERRORS
		if(!input_has_errors){
			
		
			var formData = {
				'title' : $('input[name="form-event-title"]').val(),
				'description' : $('input[name="form-event-description"]').val(),
				'event_date' : selectedDate,
				'time':	$('input[name="form-event-time"]').val()
			};
			
			
			$.ajax({
				type : 'POST',
				url  : 'http://athena.ecs.csus.edu/~dteam/add_calendar_event.php',
				data : formData,
				dataType : 'json',
				encode : true
			}).done(function (data) {
				// handle errors
				if (!data.success) {
					myApp.alert('An error occurred');
					
				} else {
					// display success message
					//myApp.alert('Posted!');
					//myApp.closeModal('.popup');
					window.location.href="main.html";
					
					
		
					
					
				
				}
			}).fail(function (data) {
				// for debug
				
				alert('Server error');
			});
		
		}
		
		

}




function onBackKeyDown() { $$(".back").click(); } 
document.addEventListener("backbutton", onBackKeyDown, false);

$$('a').on('click', function (e) { //Close panel when you open a new page
    myApp.closePanel();
});


// Callbacks to run specific code for specific pages, for example for About page:


myApp.onPageInit('list', function (page) {
    $$('.action1').on('click', function () {
  myApp.alert('Action 1');
});
$$('.action2').on('click', function () {
  myApp.alert('Action 2');
}); 
});




//LOGIN PAGE - login.html
myApp.onPageInit('login-screen', function (page) {
	
  var pageContainer = $$(page.container);
  pageContainer.find('.button-round').on('click', function () {
    var username = pageContainer.find('input[name="username"]').val();
    var password = pageContainer.find('input[name="password"]').val();
    // Handle username and password
    myApp.alert('Username: ' + username + ', Password: ' + password, function () {
    });
  });
});   


myApp.onPageInit('404', function (page) {
	
});

//REGISTRATION PAGE - signup.html
myApp.onPageInit('signup', function (page) {
	


    var $form = $('#signup-form');

      $form.find('.button-round').on('click', function (e) {
        // remove the error class
        $('.form-group').removeClass('has-error');
        $('.help-block').remove();

        // get the form data
        var formData = {
			'email' : $('input[name="form-email"]').val(),
            'username' : $('input[name="form-username"]').val(),
            'password' : $('input[name="form-password"]').val(),
			'password2' : $('input[name="form-password2"]').val()
        };

        // process the form
        $.ajax({
            type : 'POST',
            url  : 'http://athena.ecs.csus.edu/~dteam/signup.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
			// handle errors
            if (!data.success) {
				if (data.errors.email) {
                    $('#email-field').addClass('has-error');
                    $('#email-field').find('.item-content').append('<span class="help-block">' + data.errors.email + '</span>');
                }
				
                if (data.errors.username) {
                    $('#username-field').addClass('has-error');
                    $('#username-field').find('.item-content').append('<span class="help-block">' + data.errors.username + '</span>');
                }

                if (data.errors.password) {
                    $('#password-field').addClass('has-error');
                    $('#password-field').find('.item-content').append('<span class="help-block">' + data.errors.password + '</span>');
                }
				if (data.errors.password2) {
                    $('#password-field').addClass('has-error');
                    $('#password-field').find('.item-content').append('<span class="help-block">' + data.errors.password2 + '</span>');
                }
				
            } else {
                // display success message
                $form.html('<div class="content-block">' + data.message + '</div><p><a href="start.html" class="button button-round">Back</a></p>');
				
            }
        }).fail(function (data) {
            // for debug
            console.log(data);
        });

        e.preventDefault();
    });
  });

  
myApp.onPageInit('retrieveCredentials', function (page) {
	

    var $form = $('#retrieve-form');

      $form.find('.button-round').on('click', function (e) {
        // remove the error class
        $('.form-group').removeClass('has-error');
        $('.help-block').remove();

        // get the form data
        var formData = {
			'email' : $('input[name="form-email"]').val()
            
        };

        // process the form
        $.ajax({
            type : 'POST',
            url  : 'http://athena.ecs.csus.edu/~dteam/retrieveCredentials.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
			// handle errors
            if (!data.success) {
				if (data.errors.email) {
                    $('#email-field').addClass('has-error');
                    $('#email-field').find('.item-content').append('<span class="help-block">' + data.errors.email + '</span>');
                }
				
				
            } else {
                // display success message
                $form.html('<div class="content-block">' + data.message + '</div><p><a href="start.html" class="button button-round">Back</a></p>');
				
            }
        }).fail(function (data) {
            // for debug
            console.log(data);
        });

        e.preventDefault();
    });
  });
 
 
var is_user_an_admin;


  
myApp.onPageInit('login', function (page) {
	


    var $form = $('#login-form');
	
	
	//if(localStorage.username === ""|| localStorage.username === null || localStorage.username === "null" || localStorage.username === "undefined" || localStorage.password === ""|| localStorage.password === null || localStorage.password === "null" || localStorage.password === "undefined"){
		
	//else if(user_name == "" || user_name == null || user_name == "null" || user_name == "undefined" || pass == ""|| pass == null || pass == "null" || pass == "undefined"){
      $form.find('.button-round').on('click', function (e) {
        // remove the error class
        $('.form-group').removeClass('has-error');
        $('.help-block').remove();

        // get the form data
        var formData = {
            'username' : $('input[name="login-username"]').val(),
            'password' : $('input[name="login-password"]').val()
			
        };
		

        // process the form
        $.ajax({
            type : 'POST',
            url  : 'http://athena.ecs.csus.edu/~dteam/login.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
			// handle errors
            if (!data.success) {
                if (data.errors.username) {
                    $('#username-field-login').addClass('has-error');
                    $('#username-field-login').find('.item-content').append('<span class="help-block">' + data.errors.username + '</span>');
                }

                if (data.errors.password) {
                    $('#password-field-login').addClass('has-error');
                    $('#password-field-login').find('.item-content').append('<span class="help-block">' + data.errors.password + '</span>');
                }
            } else {
                // display success message
					localStorage.login="true";
					localStorage.username=data.message;
					//is_user_an_admin = data['ADMIN'];
					localStorage.admin = data['ADMIN'];
					window.location.href = "main.html";
					//alert(is_user_an_admin);
					//checkIfUserIsAdmin();
					
					/*
					//DISPLAY DIFFERENT VERSIONS OF THE NEWSFEED IF USER IS ADMIN OR NOT
					if(is_user_an_admin == 1){
						window.location.href = "main.html";
						getNewsFeed();
						
					}
					else if(is_user_an_admin == 0){
						
						getNewsFeed();
						
					}*/
					
					
					
				//getNewsFeed();
				//localStorage.password=data.pw;
		


				
				
                
				//alert("Login Successful");
            }
        }).fail(function (data) {
            // for debug
            console.log(data);
        });
		
        e.preventDefault();
    });
	//}
	/*
	else if(localStorage.username !== ""|| localStorage.username !== null || localStorage.username !== "null" || localStorage.username !== "undefined" || localStorage.password !== ""|| localStorage.password !== null || localStorage.password !== "null" || localStorage.password !== "undefined"){
		window.location.href = "main.html";
		
	}
	*/
  });



var _school_address;
var _school_website;

function getSchool(){
		
		var formData = {
			'school' : $('#school-select').find('select[name="school-selected"]').val()
		};
		
		var school_name;
		var school_type;
		var school_phone;
		var school_address;
		var school_website;
		
		$.ajax({
            type : 'POST',
            url  : 'http://athena.ecs.csus.edu/~dteam/school_select.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
			// handle errors
            if (!data.success) {
                // YEE
				alert('not data success');
            } else {
                // display success message
				
				school_name = data.message['SCHOOL_NAME'];
				school_type = data.message['SCHOOL_TYPE'];
				school_phone = data.message['PHONE_NO'];
				school_address = data.message['ADDRESS'];
				school_website = data.message['WEBSITE'];
				
				$('#list').html('<li class="card" id="id"><div class="card-header" id="name"><b>'+school_name+'</b></div><div class="card-content"><div class="card-content-inner" id="school_type">'+school_type+'</div></div><div class="card-footer item-link" id="school_phone" ><a href="#" class="confirm-ok"   style="color: #007aff">'+school_phone+'</a></div><div class="card-footer item-link" id="school_address"><a href="#" class="ac-2"  style="color: #007aff"><u>'+school_address+'</u></a></div></li>');
				$('#list2').html('<li class="card"><div class="card-header"><a href="#" id="site-btn" class="button button-fill button-raised">See Website</a></div></li>');
				_school_address = school_address;
				_school_website = school_website;
            }
        }).fail(function (data) {
            // for debug
            
			alert('Fail');
        });
	}

//SCHOOL DIRECTORY - schoolDirectory.html	
myApp.onPageInit('schoolDirectory', function(page){
	
	
	
	$.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/school_init.php',
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			// YEE
		} else {
			// display success message
			$('#school-selected').append(data.message);
			$('#first-item').append(data.first_school);
			$('#school-selected').val(data.first_school);
			getSchool();
		}
	}).fail(function (data) {
		// for debug 
		
		alert(data);
	});
	
	$('#list').on('click', '#school_phone', function(){
		
		var phone_num = $(this).text();
	  
		myApp.confirm('Call  ' + phone_num, function () {
			
			window.open('tel:' + phone_num, '_system');
		});	
	   
    });
	
	$('#list').on('click', '#school_address',function(){
		//mainView.router.loadPage('schoolDirections.html');
		
		var buttons = [
        {
            text: 'See the route',
            label: true
        },
        {
            text: 'Apple Maps',
				onClick: function () {
					if(device.platform === 'iOS'){
						var url = 'http://maps.apple.com/?daddr='+_school_address+'&dirflg=d&t=m';
						window.open(url, '_system');
						
					}
					else if(device.platform === 'Android') {
						//do nothing - because apple maps doesn't exist on Android
						
					}	

            }
			
        },
        {
            text: 'Google Maps',
				onClick: function () {
					
					
					if(device.platform === 'iOS'){
						var url = 'comgooglemaps://?daddr='+_school_address;
						window.open(url, '_system');
						
						
					}
					else if(device.platform === 'Android') {
						var url2 = 'http://maps.google.com/maps?saddr='+_school_address;
						window.open(url2, '_system');
						
					}	
					
					
						
					
				}
				
				
        },
        {
            text: 'Cancel',
            color: 'red'
        },
    ];
    myApp.actions(buttons);
	
	});
	
	
	
	$('#list2').on('click', '#site-btn',function(){
		
		window.open(_school_website, '_blank', 'toolbar=yes');
			
	});

	
	
	
});



function getEmployees(){
		

		
		var formData = {
			'school' : $('#department-select').find('select[name="department-selected"]').val(),
			'title' : $('#department-select').find('select[name="title-selected"]').val()
		};
		
		//alert($('#department-select').find('select[name="department-selected"]').val());
		//alert($('#department-select').find('select[name="title-selected"]').val());
		
		var emp;
		var row_count;
		var itemlist = [];
		
		$.ajax({
            type : 'POST',
            url  : 'http://athena.ecs.csus.edu/~dteam/susd_get_employees.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
			// handle errors
            if (!data.success) {
                // YEE
				alert('not data success');
            } else {
                // display success message
				$('#list').empty();
				row_count = data.length;
				
				for(var i=0; i < row_count; i++){
					
					/*onclick="showFoo(\'' + data[i] + '\');"*/
					$('#list').append('<a href="#" onclick="showFoo(\'' + data[i] + '\');"  id="myid"  class="item-link"><li class="accordion-item item-content"> <div class="item-inner"> <div class="item-title">'+ data[i] +'</div> </div> </li></a></li>');
				
				}
				
			
			
			
            }
        }).fail(function (data) {
            // for debug
            
			alert('Fail');
        });
}

var emp_name;

function showFoo(name) {
  
	emp_name = name;
	mainView.router.loadPage('contact_info.html');
	
	return;
}

function getTitle(){
		

		
		var formData = {
			'school' : $('#department-select').find('select[name="department-selected"]').val()
		};
		
		var school_name;
		
		
		$.ajax({
            type : 'POST',
            url  : 'http://athena.ecs.csus.edu/~dteam/susd_get_title.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
			// handle errors
            if (!data.success) {
                // YEE
				alert('not data success');
            } else {
                // display success message
				
			$('#title-selected').empty();
			$('#second-item').empty();
			
			$('#title-selected').append(data.message);
			$('#second-item').append(data.first_title);
			getEmployees();
			
            }
        }).fail(function (data) {
            // for debug
            
			alert('Fail');
        });
}



//CORPORATE DIRECTORY - corporateDirectory.html
myApp.onPageInit('corporateDirectory', function(page){
	

	
	$.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/susd_get_department.php',
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			// YEE
			alert('error');
		} else {
			// display success message
			$('#department-selected').append(data.message);
			$('#first-item').append(data.first_department);
			getTitle();

			
		}
	}).fail(function (data) {
		// for debug 
		
		alert(data);
	});
	
    

	
	var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
	});  

	

});

//HELP AND SUPPORT - help_and_support.html
myApp.onPageInit('help_support', function(page){

	$('#email_link').on('click', function(){
		var email = $("#email_link").text();
		
        window.open('mailto:' + email, '_system');
    
  
  
	});
	
});

//PROFILE PAGE  -  contact_info.html
myApp.onPageInit('contact_info', function(page){
	
	
	$('#name').append(emp_name);
	
	
	
	var formData = {
		'name' : emp_name
	};
	
	
	
	
	$.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/susd_get_emp_phone_and_email.php',
		data : formData,
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			// YEE
			alert('not data success');
		} else {
			// display success message

			$('#title').append(data.Title);
			$('#phone').append(data.Phone);
			$('#email').append(data.E_Mail);
		
		}
	}).fail(function (data) {
		// for debug
		
		alert('Fail');
	});
	
	
	
	
	// User can dial a phone number just by clicking on the link
	$('#list1').on('click', '#phone_num', function(){
		
		var phone_num = $("#phone").text();
		
		myApp.confirm('Call  ' + phone_num, function () {
			
			window.open('tel:' + phone_num.replace(/\s/g,''), '_system');
			
		});	
    });
	

	
	$('#list2').on('click', '.open-3-modal', function(){

		
	var email = $("#email").text();
	
	myApp.modal({
    title:  'Email',
    text: email,
    buttons: [
      {
        text: 'Cancel',
        onClick: function() {
			
        }
      },
	  	  
      {
        text: 'OK',
        bold: true,
        onClick: function() {
          window.open('mailto:' + email, '_system');
        }
      },
    ]
  });
});
	

});

function checkIfUserIsAdmin(){
	

	return is_user_an_admin;
}



function removeImage(){
	//REMOVED SELECTED IMAGE 
	var image = document.getElementById('myImage');
	var closeBtn = document.getElementById('close');
	image.parentNode.removeChild(image);
	closeBtn.parentNode.removeChild(closeBtn);
	imgURI = null;
	setPhotoSelected(false);
	
}

var filename;

function uploadPhoto(imageURI) {
			
	var options = new FileUploadOptions();
	options.fileKey="file";
	//options.fileName= imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.fileName='image_'+Math.floor((Math.random() * 10000) + 1)+'.jpg';
	filename = options.fileName;
	options.mimeType="image/jpeg";
	
	
	//var params = new Object();
	//params.value1 = "test";
	//params.value2 = "param";

	//options.params = params;
	options.chunkedMode = false;
	
	

	
	var ft = new FileTransfer();
	//alert('uploading');
	ft.upload(imageURI, "http://athena.ecs.csus.edu/~dteam/upload.php", win, fail, options);
	

}
	
	
function win(r) {
	//SUCCESSFULLY UPLOADED FILE TO SERVER
	
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	
}

function fail(error) {
	//FAILED TO UPLOAD FILE TO SERVER
	
	console.log("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
	
	
}




var imgURI;
var photo_selected = false;

function getPhotoSelected(){
	
	return photo_selected;
	
}
function setPhotoSelected(value){
	photo_selected = value;
}



myApp.onPageInit('post_news_story', function (page) {
	
	


	
	$('#camera_roll').on('click',function(){
		
			navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 50,
			targetWidth: 640,
			targetHeight: 480,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPEG
		});

		function onSuccess(imageURI) {
			
			$('#img-block').append('<img  id="myImage" style="width: 70px; height: 70px; display: none; border:1px solid #d3d3d3; border-radius: 10px;" >');
			$('#img-block').append('<button id="close" onclick="removeImage();" style="position: absolute; top: 0; right: 0;display: none; color: #696969; border-radius: 100%; height: 30px; background-color: #d3d3d3; border: none;"><b>X</b></button>');
			
			setPhotoSelected(true);
			
			
			var image = document.getElementById('myImage');
			var closeBtn = document.getElementById('close');
			// This function is used for unhide the image elements
			image.style.display = 'block';
			closeBtn.style.display = 'block';
			// This function is used to display the captured image
			//image.src = "data:image/jpeg;base64," + imageData;
			image.src = imageURI;
			imgURI = imageURI;
	

			
		}

		function onFail(message) {
			
		}
		
	});
	

	
	
	
	$('#submit-btn').on('click',function(){
		
		
		var title = $('input[name="form-title"]').val();
		var description = $('textarea[name="form-description"]').val();
		var body = $('textarea[name="form-body"]').val();
		var input_has_errors = false;
		
		
	
		
		

		//CHECK IF INPUTS ARE EMPTY - IF SO, THEN SHOW ERROR ALERT	
		if((title==null || title=="") || (description==null || description=="") || (body==null || body=="")){
			input_has_errors = true;
			myApp.alert('All fields are required','Error');
		}
		
		

		
		
		var photo = getPhotoSelected();
		
		
		//IF INPUT HAS NO ERRORS
		if(!input_has_errors && (photo == true)){
			
			uploadPhoto(imgURI);
			var img_filename = filename;
			// get the form data
			var formData = {
				'title' : $('input[name="form-title"]').val(),
				'description' : $('textarea[name="form-description"]').val(),
				'body' : $('textarea[name="form-body"]').val(),
				'img_filename' : img_filename
			};
			
			
			$.ajax({
				type : 'POST',
				url  : 'http://athena.ecs.csus.edu/~dteam/post_news_story.php',
				data : formData,
				dataType : 'json',
				encode : true
			}).done(function (data) {
				// handle errors
				if (!data.success) {
					myApp.alert('An error occurred');
					
				} else {
					// display success message
					myApp.alert('Posted!');
					
					//mainView.router.loadPage('main.html')
					setTimeout(function () {
					
						
						window.location.href="main.html";
						
					}, 500);
		
					
					
				
				}
			}).fail(function (data) {
				// for debug
				
				alert('Server error');
			});
		
		}
		else if(!input_has_errors && (photo == false)){
			
			var formData = {
				'title' : $('input[name="form-title"]').val(),
				'description' : $('textarea[name="form-description"]').val(),
				'body' : $('textarea[name="form-body"]').val(),
				'img_filename' : null
			};
			
			
			$.ajax({
				type : 'POST',
				url  : 'http://athena.ecs.csus.edu/~dteam/post_news_story.php',
				data : formData,
				dataType : 'json',
				encode : true
			}).done(function (data) {
				// handle errors
				if (!data.success) {
					myApp.alert('An error occurred');
					
				} else {
					// display success message
					myApp.alert('Posted!');
					
					mainView.router.loadPage('main.html')

				}
			}).fail(function (data) {
				// for debug
				
				console.log('Server error');
			});
			
	
		}
		
		
		
		
			
	});
	
	
});



function loadNewsStory(id){
	
	
	
	
	var formData = {
				
		'ID' : id
            
	};
			
			
			
	$.ajax({
	type : 'POST',
	url  : 'http://athena.ecs.csus.edu/~dteam/load_news_story.php',
	data : formData,
	dataType : 'json',
	encode : true
	}).done(function (data) {
	// handle errors
	if (!data.success) {
		// YEE
		alert('error');
	} else {
		// display success message
		//RELOAD THE NEWS FEED PAGE
		var title = data['TITLE'];
		
		var body = data['BODY'];
		var date_posted = data['DATE_POSTED'];
		var filename = data['IMAGE_FILENAME'];
		
		//myApp.alert(sessionStorage.title);
		
		if((filename == null) || (filename == "")){
			
			var newPageContent = '<div class="navbar">'+
							'<div class="navbar-inner">'+
					
								'<div class="left">'+
									'<a href="#" class="back">'+
										'<i class="icon icon-back"></i>'+
									'</a>'+
								'</div>'+
								'<div class="center">'+
									'<img src="icon/susd-logo.png" style="width: 40px; height: 30px;"></img>'+
								'</div>'+
								'<div class="right">'+
									'<a href="#" class="link icon-only open-panel">'+
										'<i class="fa fa-bars"></i>'+
									'</a>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="page" data-page="my_news_story_page">' +
							'<div class="page-content">' +
								'<div class="content-block">'+
									'<div class="content-block-title" id="news_story_title"><h3><strong>'+title+'</strong></h3></div>'+
									
									
								
									'<div class="content-block-inner" id="news_story_paragraph"><p style="color: grey;">Posted on '+date_posted+'</p><p>'+body+'</p></div>'+
									
								'</div>'+
							
							'</div>' +
                      '</div>';
			
		}
		else {
		
		var URI = 'http://athena.ecs.csus.edu/~dteam/susd_newsfeed_images/'+filename;
		
		var newPageContent = '<div class="navbar">'+
							'<div class="navbar-inner">'+
					
								'<div class="left">'+
									'<a href="#" class="back">'+
										'<i class="icon icon-back"></i>'+
									'</a>'+
								'</div>'+
								'<div class="center">'+
									'<img src="icon/susd-logo.png" style="width: 40px; height: 30px;"></img>'+
								'</div>'+
								'<div class="right">'+
									'<a href="#" class="link icon-only open-panel">'+
										'<i class="fa fa-bars"></i>'+
									'</a>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="page" data-page="my_news_story_page">' +
							'<div class="page-content">' +
								'<div class="content-block">'+
									'<div class="content-block-title" id="news_story_title"><h3><strong>'+title+'</strong></h3></div>'+
									
									
								
									'<div class="content-block-inner" id="news_story_paragraph"><img id="image" src="'+URI+'" style="display: block; width: 100%; height: 50%;"/><p style="color: grey;">Posted on '+date_posted+'</p><p>'+body+'</p></div>'+
									
								'</div>'+
							
							'</div>' +
                      '</div>';
					  
		}				
	

	
	mainView.router.loadContent(newPageContent);
		

		
		
	}
	}).fail(function (data) {
		// for debug 
	
		alert('An error occured ');
	});
			
	
	
	
	
	return;
}

function deleteNewsStory(id,img_filename){
	
	
	
	myApp.modal({
    title:  'Delete Post?',
    buttons: [
      {
        text: 'Cancel',
        onClick: function() {
			
        }
      },
	  
      {
        text: 'OK',
        bold: true,
        onClick: function() {
			
			
			var formData = {
				'ID' : id,
				'img_filename': img_filename
            
			};
			
			
			
			$.ajax({
			type : 'POST',
			url  : 'http://athena.ecs.csus.edu/~dteam/delete_news_story.php',
			data : formData,
			dataType : 'json',
			encode : true
			}).done(function (data) {
			// handle errors
			if (!data.success) {
				// YEE
				alert('error');
			} else {
				// display success message
				//RELOAD THE NEWS FEED PAGE
				mainView.router.reloadPage('main.html');
				

			}
			}).fail(function (data) {
				// for debug 
			
				alert('An error occured ');
			});
	
			

 
		  
		  
        }
      },
    ]
  });
  
  
  
  
  
}


function getNewsFeedWithPrivileges(){
	
	//DISPLAY OPTION TO CREATE A NEW POST -ADMIN ONLY
	$('#post_new_story_link').append('<ul> <li> <a href="#" class="item-link" id="new_post"> <div class="item-content"> <div class="item-media"><i class="fa fa-plus-square-o fa-2x" style="color:#007aff;"></i></div> <div class="item-inner"><p>Post to News Feed</p> </div> </div> </a> </li> </ul>');
	

	//GET OUR NEWSFEED WITH ADMIN PRIVELAGES
	$.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/susd_get_newsfeed.php',
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			// YEE
			alert('error');
		} else {
			// display success message

			
			var row_count = data.length;
			
			for(var i = 0; i < row_count; i++){
				
				var filename = data[i]['IMAGE_FILENAME'];
				
				if((filename == null) || (filename == "")){
					
					$('#newsfeed').append('<div class="card" > <div class="card-header" id="title"><b>'+data[i]['TITLE']+'</b></div> <div class="card-content"> <div class="card-content-inner" id="content-inner"><p id="date" class="color-gray">Posted on '+data[i]['DATE_POSTED']+'</p><p id="description">'+data[i]['DESCRIPTION']+'</p></div> </div> <div class="card-footer"><a href="#" class="link" id="readmore"  onclick="loadNewsStory(\''+data[i]['ID']+'\');">Read More</a><a href="#" id="delete_post" onclick="deleteNewsStory(\''+data[i]['ID']+'\',\''+data[i]['IMAGE_FILENAME']+'\')" class="link open-3-modal" style="color:red;">Delete</a></div> </div>');

				} else {
				
					d = new Date();
					var URI = 'http://athena.ecs.csus.edu/~dteam/susd_newsfeed_images/'+filename;
					
				
					//$('#newsfeed').append('<img id="image" src="'+URI+'" style="display: block; width: 100%; height: 50%;"/>');																																																																																																			
					
					$('#newsfeed').append('<div class="card" > <div class="card-header" id="title"><b>'+data[i]['TITLE']+'</b></div> <div class="card-content"> <div class="card-content-inner" id="content-inner"><p id="date" class="color-gray">Posted on '+data[i]['DATE_POSTED']+'</p><img id="image" src="'+URI+'" style="display: block; width: 100%; height: 50%;"/><p id="description">'+data[i]['DESCRIPTION']+'</p></div> </div> <div class="card-footer"><a href="#" class="link" id="readmore"  onclick="loadNewsStory(\''+data[i]['ID']+'\');">Read More</a><a href="#" id="delete_post" onclick="deleteNewsStory(\''+data[i]['ID']+'\',\''+data[i]['IMAGE_FILENAME']+'\')" class="link open-3-modal" style="color:red;">Delete</a></div> </div>');
				
					
			
				}
				
				
			}


			

		}
	}).fail(function (data) {
		// for debug 
		
		alert('fail');
	});
	
} 


function getNewsFeedReadOnly(){

	//DISPLAY NEWS FEED WITHOUT ABILITY TO MAKE A NEW POST, OR DELETE ANY POST - READ ONLY
	
	$.ajax({
		type : 'POST',
		url  : 'http://athena.ecs.csus.edu/~dteam/susd_get_newsfeed.php',
		dataType : 'json',
		encode : true
	}).done(function (data) {
		// handle errors
		if (!data.success) {
			// YEE
			alert('error');
		} else {
			// display success message

			
			var row_count = data.length;
			
			for(var i = 0; i < row_count; i++){
				
				var filename = data[i]['IMAGE_FILENAME'];
				
				if((filename == null) || (filename == "")){
					
					$('#newsfeed').append('<div class="card" > <div class="card-header" id="title"><b>'+data[i]['TITLE']+'</b></div> <div class="card-content"> <div class="card-content-inner" id="content-inner"><p id="date" class="color-gray">Posted on '+data[i]['DATE_POSTED']+'</p><p id="description">'+data[i]['DESCRIPTION']+'</p></div> </div> <div class="card-footer"><a href="#" class="link" id="readmore"  onclick="loadNewsStory(\''+data[i]['ID']+'\');">Read More</a></div> </div>');
					

				} else {
				
				
					var URI = 'http://athena.ecs.csus.edu/~dteam/susd_newsfeed_images/'+filename;
				
				
					$('#newsfeed').append('<div class="card" > <div class="card-header" id="title"><b>'+data[i]['TITLE']+'</b></div> <div class="card-content"> <div class="card-content-inner" id="content-inner"><p id="date" class="color-gray">Posted on '+data[i]['DATE_POSTED']+'</p><img id="image" src="'+URI+'" style="display: block; width: 100%; height: 50%;"/><p id="description">'+data[i]['DESCRIPTION']+'</p></div> </div> <div class="card-footer"><a href="#" class="link" id="readmore"  onclick="loadNewsStory(\''+data[i]['ID']+'\');">Read More</a></div> </div>');
					

			
				}
				
				
				
				//$('#newsfeed').append('<div class="card" > <div class="card-header" id="title"><b>'+data[i]['TITLE']+'</b></div> <div class="card-content"> <div class="card-content-inner"><p id="date" class="color-gray">Posted on '+data[i]['DATE_POSTED']+'</p><p id="description">'+data[i]['DESCRIPTION']+'</p><img id="image" src="" width="100%"></div> </div> <div class="card-footer"><a href="#" class="link" id="readmore"  onclick="loadNewsStory(\''+data[i]['BODY']+'\',\''+data[i]['TITLE']+'\');">Read More</a></div> </div>');
				
			}	

		}
	}).fail(function (data) {
		// for debug 
		
		alert('fail');
	});

} 



       



