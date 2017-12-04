$(document).ready(function() {
	// Hidden or visible counter
	registerBlock = $('#registration').offset().top;
	counterBlockHeight = $('.fixed-counter').outerHeight(true);
	hederHeight = $('.navbar').outerHeight(true);
	registerBlockHeight = $('#registration .deadline').outerHeight(true);

	// Checkbox change val
	$('#register-checkbox').change(function() {
		if ($(this).val() == 0) {
			$(this).val(1);
		} else {
			$(this).val(0);
		}
	})

	// Login form
	$("#login-form form").submit(function() {
		var form = $(this);
		var error = false;
		form.find('input').each( function() {
			var parent = $(this).parent();
			var type = $(this).attr('type');
			var errorClass = 'error-field-' + type;

			if ($(this).val() == '') { 
				parent.addClass('error');
				$('.' + errorClass).detach();
				parent.after( '<div class="error-field ' + errorClass + '">The field is required!</div>' );
				error = true;
			} else if (type == 'email') {
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if ( !pattern.test( $(this).val() ) ) {
					parent.addClass('error');
					$('.' + errorClass).detach();
					parent.after( '<div class="error-field ' + errorClass + '">Wrong email format!</div>' );
					error = true;	
				} else {
					parent.removeClass('error');
					$('.' + errorClass).detach();
				}
			} else if (type == 'password') {
				if ( ($(this).val().length < 8) || ($(this).val().length > 16) ) {
					parent.addClass('error');
					$('.' + errorClass).detach();
					parent.after( '<div class="error-field ' + errorClass + '">Password must contain from 8 to 16 characters!</div>' );
					error = true;
				} else {
					parent.removeClass('error');
					$('.' + errorClass).detach();
				}
			} else {
				$(this).parent().removeClass('error');
			}
		});
		if (!error) {
			$.ajax({
		        type: "POST",
		        url: "/api/login",
		        contentType: "application/json; charset=utf-8",
		        dataType: "json",
		        data: JSON.stringify({
		        	email:form.find('.email-input-field').val(),
		        	password:form.find('.pass-input-field').val()
		        }),
		        success: function(data) {
		        	setTimeout("document.location.href='http://lol.gamestars.gg/#/tournament/lol/20'", 500);
		        },
		        error: function (xhr, ajaxOptions, thrownError) {
		        	form.find('.error-general').detach();
					form.find('button[type="submit"]').after( '<div class="error-field error-general">Email or password is wrong!</div>' );
		        	//console.log(xhr.status);
		        	//console.log(thrownError);
		        }
		    });
		}
		return false;
	});

	// Register form
	$("#register-form form").submit(function() {
		var form = $(this);
		var error = false;
		form.find('input').each( function() {
			var parent = $(this).parent();
			var type = $(this).attr('type');
			var errorClass = 'error-field-' + type;

			if ($(this).val() == '') { 
				parent.addClass('error');
				$('.' + errorClass).detach();
				parent.after( '<div class="error-field ' + errorClass + '">The field is required!</div>' );
				error = true;
			} else if (type == 'email') {
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if ( !pattern.test( $(this).val() ) ) {
					parent.addClass('error');
					$('.' + errorClass).detach();
					parent.after( '<div class="error-field ' + errorClass + '">Wrong email format!</div>' );
					error = true;	
				} else {
					parent.removeClass('error');
					$('.' + errorClass).detach();
				}
			} else if (type == 'password') {
				if ( ($(this).val().length < 8) || ($(this).val().length > 16) ) {
					parent.addClass('error');
					$('.' + errorClass).detach();
					parent.after( '<div class="error-field ' + errorClass + '">Password must contain from 8 to 16 characters!</div>' );
					error = true;
				} else {
					parent.removeClass('error');
					$('.' + errorClass).detach();
				}
			} else if (type == 'text') {
				if ( $(this).val().length > 16 ) {
					parent.addClass('error');
					$('.' + errorClass).detach();
					parent.after( '<div class="error-field ' + errorClass + '">Login must contain no more than 16 characters!</div>' );
					error = true;
				} else {
					parent.removeClass('error');
					$('.' + errorClass).detach();
				}
			} else if (type == 'checkbox') {
				if ( $(this).val() == 0 ) {
					parent.addClass('error');
					error = true;
				} else {
					parent.removeClass('error');
				}

			} else {
				$(this).parent().removeClass('error');
			}
		});
		if (!error) {
			$.ajax({
		        type: "POST",
		        url: "/api/signup",
		        contentType: "application/json; charset=utf-8",
		        dataType: "json",
		        data: JSON.stringify({
		        	email:form.find('.email-input-field').val(),
		        	password:form.find('.pass-input-field').val(),
		        	name:form.find('.login-input-field').val(),
		        	acceptConditions: "true",
					additionalIds: [
						{ "name" : "clientId", "value" : $.cookie("_ga_cid")}
					],
					autoLogin: true,
		        	tz: new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]
		        }),
		        success: function(data) {
					ga('send', 'event', 'registration', 'submit', '');
					document.location.href='http://lol.gamestars.gg/#/tournament/lol/20';
		        	//console.log(data);
                    //form.find('.error-general').detach();
		        	//form.find('button[type="submit"]').after('<div class="success text-center text-uppercase">' +
						//'Thank you for signing up! We\'ve sent a message to the email you provided<br/>' +
						//'<h3><b>Please check your email!</b></h3><br/>' +
						//'If you haven\'t received the letter, please check your spam box or contact our support team.<br/><br/>' +
						//'</div>');
		        	//form.find('button[type="submit"]').remove();
		        },
		        error: function (response) {
		        	form.find('.error-general').detach();
						var errorType = response.responseText;
						//console.log('errorType : ', errorType);
					var errorMsg ="Error!";
						if( errorType.indexOf('UserUnverifiedException')>=0){
							var errorMsg = 'E-mail unverified - check your email!';
						}else if (errorType.indexOf('ValidationException')>=0){
							var errorMsg = 'The Email or Login are already in use';
						}else if (errorType.indexOf('UserExistException')>=0){
							var errorMsg = 'The Email or Login are already in use';
						}else {
							var errorMsg = 'A server error has occurred. We apologize.';
						}


						form.find('button[type="submit"]').after( '<div class="error-field error-general">'+errorMsg+'</div>' );
		        	//console.log(xhr.status);
		        	//console.log(thrownError);
		        }
		    });
		}
		return false;
	});
	
	// Forgot password form
	$("#password-form form").submit(function() {
		var form = $(this);
		var error = false;
		form.find('input').each( function() {
			var parent = $(this).parent();
			var type = $(this).attr('type');
			var errorClass = 'error-field-' + type;

			if ($(this).val() == '') { 
				parent.addClass('error');
				$('.' + errorClass).detach();
				parent.after( '<div class="error-field ' + errorClass + '">The field is required!</div>' );
				error = true;
			} else if (type == 'email') {
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if ( !pattern.test( $(this).val() ) ) {
					parent.addClass('error');
					$('.' + errorClass).detach();
					parent.after( '<div class="error-field ' + errorClass + '">Wrong email format!</div>' );
					error = true;	
				} else {
					parent.removeClass('error');
					$('.' + errorClass).detach();
				}
			} else {
				$(this).parent().removeClass('error');
			}
		});
		if (!error) {
			$.ajax({
		        type: "POST",
		        url: "/api/accounts/password/reset",
		        contentType: "application/json; charset=utf-8",
		        dataType: "json",
		        data: JSON.stringify({
		        	email:form.find('.email-input-field').val()
		        }),
		        success: function(data) {
		        	console.log(data);
		        	form.find('button[type="submit"]').after('<div class="success text-center text-uppercase">Success!</div>');
		        	form.find('button[type="submit"]').remove();
		        },
		        error: function (xhr, ajaxOptions, thrownError) {
		        	form.find('.error-general').detach();
					form.find('button[type="submit"]').after( '<div class="error-field error-general">Wrong email!</div>' );
		        	console.log(xhr.status);
		        	console.log(thrownError);
		        }
		    });
		}
		return false;
	});
});

// Show/Hidden counter
$(window).scroll(function () {
	if ( ( $(this).scrollTop() > (registerBlock - counterBlockHeight - hederHeight) ) && ( $(this).scrollTop() < (registerBlock + registerBlockHeight + hederHeight + counterBlockHeight) ) ) {
		$('.fixed-counter').addClass("hidden");
	} else {
		$('.fixed-counter').removeClass("hidden");
	}
});

// Scroll on click
$('.navbar-main a').click(function () {
	var elementClick = $(this).attr("href");
	var destination = $(elementClick).offset().top - hederHeight;
	$('html, body').animate({ scrollTop: destination }, 900 );
})

// Show form
$('.show-popup').click(function () {
	$( '#' + $(this).data('form') ).removeClass('hidden');
})

/*
$('.popup-form form').click(function () {
    return false;
});

$('.popup-form').click(function () {
    $(this).addClass('hidden');
    return false;
});*/

// Close form
$('.close-form').click(function () {
	//var a = $(this).data('form');
	$( '#' + $(this).data('form') ).addClass('hidden');
})

// Show forgot pass form
$('#forgot-pass').click(function () {
	$('#login-form').addClass('hidden');
	$('#password-form').removeClass('hidden');
})
