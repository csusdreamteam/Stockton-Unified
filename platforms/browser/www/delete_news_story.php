<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {


		$data['success'] = true;
		



	
	
    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}
?>