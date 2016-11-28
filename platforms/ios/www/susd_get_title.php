<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {

	$school=stripslashes(trim($_POST['school']));
	
	$q=mysql_query("SELECT  DISTINCT Title FROM Employee_List WHERE Department='$school';");
 	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
		$data['success'] = true;
		
	}
	
	
	$row = mysql_fetch_array($q);
	$data['first_title'] = $row['Title'];

	do{
	    $list .= "<option value='" . $row['Title'] . "'>" . $row['Title'] . "</option>";
	} while ($row = mysql_fetch_array($q));
	$data['message'] = $list;
	
	
    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}
?>