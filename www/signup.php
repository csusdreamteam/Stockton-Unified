<?php
include 'connectionOpen.php';//call file to connect to database


$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data
$confirm_code=md5(uniqid(rand()));
$allowed = array('stocktonusd.net');	//allow only SUSD employees to register

if($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	$email=stripslashes(trim($_POST['email']));
	$username=stripslashes(trim($_POST['username']));
	$password=stripslashes(trim($_POST['password']));

	$confirm_password=stripslashes(trim($_POST['password2']));
	$email_exist=mysql_num_rows(mysql_query("select * from `user_login` where `email`='$email';"));
	$username_exist=mysql_num_rows(mysql_query("select * from `user_login` where `username`='$username';"));
	
	//IF EMAIL IS EMPTY
	if (empty($email)) {
        $errors['email'] = 'Email is required.';
	}
	
	
	
	//IF THERES ALREADY AN ACCOUNT WITH THAT EMAIL
	if($email_exist){
			$errors['email'] = 'You already have an account with this email.';
			
	}
	
	
	
	//CHECK IF VALID EMAIL WAS ENTERED
	if (!preg_match('/^[^0-9][A-z0-9._%+-]+([.][A-z0-9_]+)*[@][A-z0-9_]+([.][A-z0-9_]+)*[.][A-z]{2,4}$/', $email)) {
        	$errors['email'] = 'Email is invalid.';
    }
	
	//CHECK IF EMAIL IS A VALID STOCKTON UNIFIED SCHOOL DISTRICT EMAIL
	//REMOVE COMMENTS WHEN READY TO DEPLOY
	/*
	
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		$explodedEmail = explode('@',$email);
		$domain = array_pop($explodedEmail);
		
		if(!in_array($domain,$allowed)){
			$errors['email'] = 'Enter SUSD email address';
		}
	}
	*/
	
	if (empty($username)) {
        	$errors['username'] = 'Username is required.';
    }
	//IF THERES ALREADY A USERNAME LIKE THAT IN THE DATABASE
	if($username_exist){
			$errors['username'] = 'Username is taken.';
			

	}

    if (empty($password)) {
       		$errors['password'] = 'Password is required.';
    }
	if($password != $confirm_password){
			$errors['password2'] = 'Passwords do not match.';
	}
	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {



		$q=mysql_query("insert into `temp_members_db` (`confirm_code`,`username`,`password`, `email`) values ('$confirm_code','$username','$password','$email')");
        
		$to=$email;
	
		//SUBJECT
		$subject="Your confirmation link here";
		
		//FROM
		$header="from: Stockton Unified School District";

		//MESSAGE
		$message="Your Confirmation link \r\n";
		$message.="Click on this link to activate your account \r\n";
		$message.="http://athena.ecs.csus.edu/~dteam/confirmation.php?passkey=$confirm_code";

		//SEND EMAIL
		$sendmail = mail($to,$subject,$message,$header);
		
		if($sendmail){
		
			$data['success'] = true;
			$data['message'] = 'Confirmation email sent. Please follow the instructions in the email to activate  your account';
		}
		else {
			
			$data['success'] = false;
			$data['message'] = 'Cannot send Confirmation link to your email address';
		}
		
		
		
		
	}        
	
	
	
	

	}
	
   
	//return all our data to an AJAX call
	echo json_encode($data);
	exit();




   
?>
