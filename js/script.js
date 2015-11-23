var showHtmlContent = function(url){
	jQuery.ajax({
		url: url,
		dataType: 'html'
	}).done(function(data, textStatus, jqXHR){
		$('#content').empty();
		$('#content').html(data);
	}).fail(function(jqXHR, textStatus, errorThrown){
		$('#content').html("Sorry! We are having technical problems. Please come back soon!");
	});
};

var showForm = function(guestInfo, elem){
	var html = "<form>";
	html += "<span>Will you be attending?  ";
	html += "<select name='isAccepted'>";
	html += "<option value=''></option>";
	html += "<option value='1'>Accept</option>";
	html += "<option value='0'>Decline</option>";
	html += "</select> </span> <br/>";
	html += "<span> How many guests?  ";
	html += "<input type='text' name='numOfPeopleComing' value='' maxlength='2' size='3'/></span><br/>";
	html += "<input type='submit' class='submitForm' name='submitForm' value='RSVP' />";
	html += "</form>";

	var $form = $(html),
		$select = $form.find('select'),
		$input = $form.find('input[type=text]');
		$button = $form.find('input[type=submit]');

	$(elem).after($form); //add the form to the DOM

	//This will be edited if user has already accepted the invitation
	if(guestInfo.invitationStatus !== null){

		$select.val(guestInfo.invitationStatus);
		$input.val(guestInfo.numOfPeopleComing);

	} else {
		$input.val(guestInfo.peopleInvited);
	}

	$select.on('change', function(){
		//whenever the value changes
		var invitationStatus = $(this).val();

		if(invitationStatus == 0){
			$input.val('0');
		}
	});

	$button.on('click', function(ev){
		ev.preventDefault(); //stop form from submitting the regular way
		ev.stopPropagation //stop the event from bubbling up to the document
		
		//AJAX is used to submit the data
		//gather the values
		
		var data = {
			id: guestInfo.id
		};

		data.invitationStatus = $select.val();

		if(data.invitationStatus == 1){
			data.numOfPeopleComing = $input.val();
		} else{
			data.numOfPeopleComing = 0;
		};

		//now that we have all the data, remove the form from DOM
		$form.remove();

		//submit form with AJAX
		$.ajax({
			url: 'api/',
			data: JSON.stringify(data),
			dataType:'json',
			contentType: 'charset=utf-8',
			type: 'put'
		}).done(function(data, textStatus, jqXHR){
			//refresh guest data
			console.log("The put method is working... Look at refreshGuestData function.");
			refreshGuestData();
		}).fail(function(jqXHR, textStatus, errorThrown){
			$('#content').html("Sorry! We are having issues updating this information. Please try again later.");
		});

	});
};

var refreshGuestData = function(){
	//read just the start and max variables
	//As new pages are appended, to refresh data, we need to read the content from page 0 to the current page.
	var updatedMax = start;
	var updatedStart = 0;

	$.ajax({
		url:"api/?start=" + updatedStart + "&max=" + updatedMax,
		dataType:'json',
		accepts: 'appication/json'
	}).done(function(data, textStatus, jqXHR){
		//Update the statistics
		$('#totalGuestComing .value').html(data.statistics.totalGuestComing);

		// Get all the guest container
		$('.guestInfo').each(function(i, elem){
			var guestProfileContainer = $(elem).find('.guestProfile');
			var oneGuest = data.guests[i];
			var html = createGuestInfoHTML(oneGuest);

			guestProfileContainer.html(html);

			//update wording of the link
			var $formLink = $(elem).find(".showFormLink");

			if(oneGuest.invitationStatus === null){
				$formLink.html('RSVP');
			} else {
				$formLink.html('Update RSVP');
			};

			//update data attached to the link
			$formLink.data('guest', oneGuest);
			//detail the click handler as the data is out of data.
			$formLink.off('click');

			//event handler
			$formLink.on('click', function(ev){
				var $form = $(this).parent().siblings('form');
				if($form.length > 0){
					$form.remove();
				} else {
					showForm(oneGuest, $(this).parent() );
				}
			});

		});
	}).fail(function(textStatus, errorThrown, jqXHR){
		$('#content').html("Sorry! We are having a server problem. Try again later.")
	});

};


//global variables for pagination
var start = 0;
var max = 6;

var showGuestListContent = function(){

	$('#content').empty();

	var wrapper = "<div class='invitation-header'></div><br/>" +
					"<h2>Who is coming</h2>" +
						"<div id='statistics'>" +
						"</div>" +
						"<div id='guestlist' class='twelve columns'>" +
						"</div>" +
						"<button id='loadmore'>load more</button>";
	$('#content').html(wrapper);

	var jQueryStatisticsContainer = $('#statistics');
	var jQueryGuestListContainer = $('#guestlist');

	$.ajax({
		url: 'api/?start=' + start + '&max=' + max,
		dataType: 'json',
		accepts: 'application/json'
	}).done(function(data, textStatus, jqXHR){
	
		//HTML for total invited guests display
		var statisticshtml = "<div id='totalInvitedGuests'>" +
							"<span class='value'>" +
							data.statistics.peopleInvited +
							"</span>" +
							"<span class='label'> invited</span>" +
							"</div>";

		//HTML for total coming guests display
		statisticshtml += "<div id='totalGuestComing'>" +
							"<span class='value'>" +
							data.statistics.totalGuestComing +
							"</span>" +
							"<span class='label'> coming</span>" +
							"</div>";

		//HTML for total guests declined display
		statisticshtml += "<div id='totalGuestDeclined'>" +
							"<span class='value'>" +
							data.statistics.totalGuestDeclined +
							"</span>" +
							"<span class='label'> declined</span>" +
							"</div>";

		//add the HTML to the content on the website

		jQueryStatisticsContainer.append(statisticshtml);

		loadGuests(data);

	}).fail(function(jqXHR, textStatus, errorThrown){
		$('#content').html("Sorry! We are having a problem with displaying the data. Please try again later.");
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});

	//Click handler for the next  group of guestlist items to load
	$('#loadmore').on('click', function(ev){
		//disable the default event handling for the button
		ev.preventDefault();

		$.ajax({
			url: 'api/?start=' + start + '&max=' + max,
			dataType: 'json',
			accepts: 'application/json'
		}).done(function(data, textStatus, jqXHR){
			console.log("The loadmore event handler is running currectly.");
			loadGuests(data);
		}).fail(function(jqXHR, textStatus, errorThrown){
			$('#content').html("Sorry! We are having a server problem. Please try again later.");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);		
		});
	});


	//process the data and display the list.
	//loop through the guest list
	var loadGuests = function(data){
		
		//increment the start by max once we get the data
		start = start + max;

		if(start >= data.statistics.totalRecords){
			$('#loadmore').remove();
		}

		for(var i = 0; i < data.guests.length; i++){

			var oneGuest = data.guests[i];
			var classes = 'guestInfo five columns alpha';

			//create the HTML for one guest information
			var html = '';

			html += "<div class='" + classes + "'>";

			if(!oneGuest.thumbnail || oneGuest.thumbnail == ''){
				oneGuest.thumbnail = 'assets/thumbnails/default.png'
			}

			html += "<div class='thumbnail'>" +
					"<img src='" + oneGuest.thumbnail + "' width='100'/>" +
					"</div>";
			html += "<div class='guestProfile'>";
			html += createGuestInfoHTML(oneGuest);
			html += "</div>";
			
			//update RSVP button
			html += "<div class='rsvpLink'>";

			if(oneGuest.invitationStatus === null){
				html += "<a class='showFormLink'>RSVP</a>";
			} else {
				html += "<a class='showFormLink'>Update RSVP</a>"
			}

			html += "</div>";
			html += "</div>";

			var $html = $(html);

			//append the active html to display each guest
			jQueryGuestListContainer.append($html);

			var $showFormLink = $html.find(".showFormLink");
			$showFormLink.data('guest', oneGuest);

			//Attach event handler
			$showFormLink.on('click', function(ev){
				var guest = $(this).data('guest');
				var $form = $(this).parent().siblings('form');

				if($form.length > 0){
					$form.remove();
					$(this).removeClass('active');
				} else {
					showForm(guest, $(this).parent() );
					$(this).addClass("active");
				}

			});
		};
	};
};

//update data and display to user
var createGuestInfoHTML = function(oneGuest){

	var html = "<p class='guestName'>" + oneGuest.guestName + "</p>" +
		"<p class='guestAddress'>" + oneGuest.streetAddress;

	if( oneGuest.city && oneGuest.city != '' )
	{				 
		html += "<br/>" + oneGuest.city;
	};
	
	// Add the state in the display if it exists.
	if( oneGuest.state && oneGuest.state != '' )
	{
		html += ", " + oneGuest.state;
	};

	if(oneGuest.invitationStatus === null){
		html += "<p class='status'>No response</p>";
	} else if (oneGuest.invitationStatus == 1){

		var plural = 'attendees';

		if(oneGuest.numOfPeopleComing == 1){
			plural = 'attendee';
		}

		html += "<p class='status'>Accepted <br/>" + oneGuest.numOfPeopleComing +
		" " + plural + "</p>"
	} else {
		html += "<p class='status'>Declined</p>"
	}

	return html;
};



$(window).on("hashchange", function(){

	if(window.location.hash == '#guestlist'){
		showGuestListContent();
	} else if(window.location.hash == '#contact'){
		showHtmlContent('contact.html');
	} else {
		showHtmlContent('home.html');
	}
});

$('document').ready(function(){
	var $loginLink = $('#login');
	var $overlay = $('#overlay');
	var $username = $('.loginForm .username');
	var $password = $('.loginForm .password');
	var $logoutLink = $('#logout');


	$loginLink.on('click', function(ev){
		if($overlay.is(':visible')){
			$overlay.hide();
			showHtmlContent('home.html');
		} else {
			$username.val('');
			$password.val('');
			$overlay.show();
		}
	});


	$('#logout').on('click', function(ev){
		$.ajax({
			url:'api/logout.php'
			}).done(function(data,textStatus, jqXHR){
				$logoutLink.hide();
				$loginLink.show();
				showHtmlContent();
				$username.val('');
				$password.val('');
				$overlay.show();
			});
	});

	$('.submitLoginInfo').on('click', function(ev){
		ev.preventDefault();
		ev.stopPropagation();

		var data = {
			username: $username.val(),
			password: $password.val()
		};

		$.ajax({
			url:'api/login.php',
			data:data,
			type:'post'
		}).done(function(data, textStatus, jqXHR){
			//close form
			$overlay.hide();

			$loginLink.hide();
			$logoutLink.show();

			if(window.location.hash == '#guestList'){
				//load guestlist page
				showGuestListContent();
			}
		}).fail(function(jqXHR, textStatus, errorThrown){
			$('.loginForm').append("<div class='feedback'>" + jqXHR.responseText + "</div>");
		});
	});
	$(window).trigger('hashchange');
});















