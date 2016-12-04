<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {

	$name=stripslashes(trim($_POST['name']));
	
	$q=mysql_query("SELECT  TITLE, DESCRIPTION, DATE_POSTED FROM news_feed;");
 	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
		$data['success'] = true;
		

		$row = mysql_fetch_array($q);
		//$data['TITLE'] = $row['TITLE'];
		//$data['DESCRIPTION'] = $row['DESCRIPTION'];
		//$data['DATE_POSTED'] = $row['DATE_POSTED'];
		
		
		do{

			$data[] = $row;
		
		} while ($row = mysql_fetch_array($q));
	
			

	
	}

	
	
    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}
?>