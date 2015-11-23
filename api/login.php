<?php

	session_start();

	// $options = array(
	// 	'http' => array(
	// 		'header' => 'Authorization: Basic ' . base64_encase("$username:$password");
	// 		);
	// 	);

	if(!isset($_POST['username'])){
		header("HTTP/1.0 401 Unauthorized");
		echo  "Sorry - your username or password does not match.";
		exit;
	} else {
		if(($_POST['username'] == 'dance') && ($_POST['password'] == 'likenobodyiswatching')){
			//set the session
			$_SESSION['loggedin'] = true;
			header('HTTP/1.0 200 Ok');
			echo "Welcome to the private area!";
		} else {
			header("HTTP/1.0 401 Unauthorized");
			echo "Sorry - your username or password does not match.";
			exit;
		}

	}

?>