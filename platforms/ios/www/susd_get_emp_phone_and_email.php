<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {

	$name=stripslashes(trim($_POST['name']));
	
	$q=mysql_query("SELECT  Title, Phone, E_Mail FROM Employee_List WHERE Directory_Name='$name';");
 	
	if (!empty($errors)) {
        $data['success'] = false;
        $data['errors']  = $errors;
    } else {
		$data['success'] = true;
		

		$row = mysql_fetch_array($q);
		$data['Title'] = $row['Title'];
		$data['Phone'] = $row['Phone'];
		$data['E_Mail'] = $row['E_Mail'];
	
	}

	
	
    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}
?>