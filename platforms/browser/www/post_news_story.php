<?php
include 'connectionOpen.php';//call file to connect to database


$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data


if($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	$title=($_POST['title']);
	$description=($_POST['description']);
	$body=($_POST['body']);
	
	$q=mysql_query("INSERT INTO news_feed (TITLE, DESCRIPTION, BODY, DATE_POSTED) VALUES ('$title', '$description', '$body', NULL);");
	$result1 = mysql_query($q);
		
	
	//IF EMAIL IS EMPTY
	if (empty($title)) {
        $errors['title'] = 'title is required.';
	}
	
	//IF DESCRIPTION IS EMPTY
	if (empty($description)) {
        $errors['description'] = 'description is required.';
	}
	
	//IF BODY IS EMPTY
	if (empty($body)) {
        $errors['body'] = 'body is required.';
	}
	
	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
		
		
		//RETRIEVE USERNAME AND PASSWORD ASSOCIATED WITH THIS EMAIL
		$q=mysql_query("INSERT INTO news_feed (TITLE, DESCRIPTION, BODY, DATE_POSTED) VALUES ($title, $description, $body, NULL);");
		$result1 = mysql_query($q);
		
		
		
		$data['success'] = true;
					
			
		
		
		
		
	}        
	


	}
	
   
	//return all our data to an AJAX call
	echo json_encode($data);
	exit();


   
?>