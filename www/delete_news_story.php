<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {

	$id=($_POST['ID']);

	
		

	$q=mysql_query("DELETE FROM news_feed WHERE ID='$id';");
	$result1 = mysql_query($q);
		
		
		
	$data['success'] = true;

	
	
    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}
?>
