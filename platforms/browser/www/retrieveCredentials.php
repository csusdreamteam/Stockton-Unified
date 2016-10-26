<?php
include 'connectionOpen.php';//call file to connect to database


$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data
$allowed = array('stocktonusd.net');	//allow only SUSD employees to register

if($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	$email=stripslashes(trim($_POST['email']));
	$email_exist=mysql_num_rows(mysql_query("select * from `user_login` where `email`='$email';"));
	
	
	//IF EMAIL IS EMPTY
	if (empty($email)) {
        $errors['email'] = 'Email is required.';
	}
	
	
	//IF THERES ALREADY AN ACCOUNT WITH THAT EMAIL
	if(!$email_exist){
			$errors['email'] = 'No account exists with this email';
			
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
	
	
	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
		
		
		//RETRIEVE USERNAME AND PASSWORD ASSOCIATED WITH THIS EMAIL
		$sql1="SELECT * FROM `user_login` WHERE email = '$email'";
		$result1 = mysql_query($sql1);
		
		if($result1){
		
			$rows = mysql_fetch_array($result1);
			$username = $rows['USERNAME'];
			$password = $rows['PW'];
					
			
		}
		
		//SEND EMAIL
		$to=$email;

		//SUBJECT
		$subject="Your login information";
		
		//FROM
		$header="from: Stockton Unified School District";

		//MESSAGE
		$message="Your login information \r\n";
		$message.="Username:	$username \r\n";
		$message.="Password:	$password \r\n";
		

		//SEND EMAIL
		$sendmail = mail($to,$subject,$message,$header);
		
		$data['success'] = true;
		$data['message'] = 'We sent an email containing your username/password associated with this account';
		
		
	}        
	


	}
	
   
	//return all our data to an AJAX call
	echo json_encode($data);
	exit();


   
?>