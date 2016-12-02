<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {
	$username=stripslashes(trim($_POST['username']));
	$password=stripslashes(trim($_POST['password']));
	
	// Check if user is in database
	$q=mysql_query("select * from `user_login` where `username`='$username' and `pw`='$password';");
	$valid=mysql_num_rows($q);

	$exist=mysql_num_rows(mysql_query("select * from `user_login` where `username`='$username';"));
	
	
	// Error for blank username
	if (empty($username)) {
        $errors['username'] = 'Username is required.';

	//Error for username does not exist
	}else if($exist==0){
		$errors['username'] = 'Username does not exist.';
	}
	  
	// Error for blank password
    if (empty($password)) {
        $errors['password'] = 'Password is required.';
    }
	
	// Error for wrong password
	if ($valid==0){
		$errors['password'] = 'Invalid password.';
	}
	  	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
	$row = mysql_fetch_array($q);
        $data['success'] = true;
        $data['message'] = $row['USERNAME'];
		$data['pw'] = $row['PW'];

	session_start();
	$_SESSION['username'] = $username;

    }

    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}

?>