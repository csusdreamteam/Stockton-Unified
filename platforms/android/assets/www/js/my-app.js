// Initialize your app

var myApp = new Framework7({
	tapHold: true,
	swipePanel: 'right',
	smartSelectOpenIn:'popup'
	//smartSelectSearchbar:true
	
	
	
});

// Export selectors engine
var $$ = Dom7;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
	
	
});


function onBackKeyDown() { $$(".back").click(); } 
document.addEventListener("backbutton", onBackKeyDown, false);

$$('a').on('click', function (e) { //Close panel when you open a new page
    myApp.closePanel();
});


// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
});

myApp.onPageInit('tab', function (page) {
	
});

myApp.onPageInit('list', function (page) {
    $$('.action1').on('click', function () {
  myApp.alert('Action 1');
});
$$('.action2').on('click', function () {
  myApp.alert('Action 2');
}); 
});

myApp.onPageInit('form', function (page) {
});



myApp.onPageInit('google-map', function (page) {
	
	var geocoder = new google.maps.Geocoder();
	var address = "Stockton, CA";
	
  var myLatlng = new google.maps.LatLng(48.852873, 2.343627);
  var map;
  var mapOptions = {
    zoom: 12,
    center: myLatlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
      var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });
  


});


myApp.onPageInit('calendar', function (page) {
    // Default

	
	

      var calendarDefault = myApp.calendar({
          input: '#calendar-default'
      });
      // With custom date format
      var calendarDateFormat = myApp.calendar({
          input: '#calendar-date-format',
          dateFormat: 'DD, MM dd, yyyy'
      });
      // With multiple values
      var calendarMultiple = myApp.calendar({
          input: '#calendar-multiple',
          dateFormat: 'M dd yyyy',
          multiple: true
      });
      // Inline with custom toolbar
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
      var calendarInline = myApp.calendar({
          container: '#calendar-inline-container',
          value: [new Date()],
          weekHeader: false,
          toolbarTemplate: 
              '<div class="toolbar calendar-custom-toolbar">' +
                  '<div class="toolbar-inner">' +
                      '<div class="left">' +
                          '<a href="#" class="link icon-only"><i class="fa fa-chevron-left"></i></a>' +
                      '</div>' +
                      '<div class="center"></div>' +
                      '<div class="right">' +
                          '<a href="#" class="link icon-only"><i class="fa fa-chevron-right"></i></a>' +
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
          }
});
});





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
 
  
myApp.onPageInit('login', function (page) {
	


    var $form = $('#login-form');
	
	
	if(localStorage.username === ""|| localStorage.username === null || localStorage.username === "null" || localStorage.username === "undefined" || localStorage.password === ""|| localStorage.password === null || localStorage.password === "null" || localStorage.password === "undefined"){
		
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
				
				
				localStorage.password=data.pw;
				
				
                window.location.href = "main.html";
				//alert("Login Successful");
            }
        }).fail(function (data) {
            // for debug
            console.log(data);
        });
		
        e.preventDefault();
    });
	}
	else if(localStorage.username !== ""|| localStorage.username !== null || localStorage.username !== "null" || localStorage.username !== "undefined" || localStorage.password !== ""|| localStorage.password !== null || localStorage.password !== "null" || localStorage.password !== "undefined"){
		window.location.href = "main.html";
	}
	
  });


myApp.onPageInit('main', function (page) {
	

	
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
	
	
	
	/*
	$('#list').on('taphold', '#school_address',function(){
		var geocoder = new google.maps.Geocoder();
		var pos;
		
		alert('pressed');
		
		geocoder.geocode({'address' : _school_address}, function(results, status){
			if (status === 'OK'){
				pos = results[0].geometry.location;
				lat = pos.lat();
				lng = pos.lng();
				var url = 'http://maps.google.com/?ie=UTF8&hq=&ll='+ lat + ',' + lng + '&z=20';
				window.open(url);
			}
		});
		
				

	});
	*/
	
	
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
		
		var phone_num = $("#phone").text()
		
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
        
		text: 'Copy',
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
  })
});
	

});



myApp.onPageInit('emailpage', function(page){
	
	/*
	if(device.platform === 'iOS'){
		window.open("ms-outlook://",'_system');
	}
	
	else if(device.platform === 'Android') {
        //Android uses different URL schemes to launch external apps - 
		//insert for android here
		
    }	
	
	
	*/
	
	
	
	
	
	
	
	
	
	
	
});


myApp.onPageInit('subfinder', function(page){

	//window.open('http://www.stocktonusd.net/Page/3001', '_blank', 'toolbar=yes');
	
	
	//$('#subfinder-link').on('click', function(){

    
	
	
	
	cordova.ThemeableBrowser.open('http://google.com', '_blank', {
		statusbar: {
			color: '#ffffffff'
		},
		toolbar: {
			height: 44,
			color: '#f0f0f0ff'
		}
		
	});
	
	

	//});
	//window.open('http://www.stocktonusd.net/Page/3001', '_blank', 'toolbar=yes');
	
	
	/*

	$('#subfinder-link').on('click', function(){
		window.open('http://www.stocktonusd.net/Page/3001', '_blank', 'toolbar=yes');
		

	});
	*/
	
	
	
	
	
	
});



myApp.onPageInit('gosignmeup', function(page){

	//window.open('https://gsmu.stocktonusd.net/dev_students.asp?action=login&misc=897', '_blank', 'toolbar=yes');
	
	
		
		
	
	
	
});








function initMap(){
		var map;
		var mapOptions = {
			zoom: 12,
			center: {lat: 45, lng: -86}
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
			
		var directionsDisplay = new google.maps.DirectionsRenderer;
		var directionsService = new google.maps.DirectionsService;
		var infoWindow = new google.maps.InfoWindow();
		
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('text-panel'));
		
		if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
				  lat: position.coords.latitude,
				  lng: position.coords.longitude
				};

				map.setCenter(pos);
				displayRoute(directionsService, directionsDisplay, pos);
				
			  }, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			  });
			} else {
			  // Browser doesn't support Geolocation
			  handleLocationError(false, infoWindow, map.getCenter());
			}
		  

		  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
			//infoWindow.setPosition(pos);
		  }

		  
}
function displayRoute(directionsService, directionsDisplay, pos){
	var start = pos;
	var end = _school_address;

	directionsService.route({
		origin: start,
		destination: end,
		travelMode: 'DRIVING'
	}, function(response, status){
			if (status === 'OK'){
				directionsDisplay.setDirections(response);
			}else{
				alert('Direction request failed due to ' + status);
			}
	});

}
	
myApp.onPageInit('schoolDirections', function(page){
	initMap();
});
       



