<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data
$data2   = array(); // array to pass back data

if($_SERVER['REQUEST_METHOD'] === 'POST') {	
	$q=mysql_query("SELECT DISTINCT Department FROM Employee_List WHERE Department is not null ORDER BY Department;");
 	
        $data['success'] = true;

	$row = mysql_fetch_array($q);
	$data['first_department'] = $row['Department'];

	do{
	    $list .= "<option value='" . $row['Department'] . "'>" . $row['Department'] . "</option>";
	} while ($row = mysql_fetch_array($q));
	$data['message'] = $list;



    // return all our data to an AJAX call
    echo json_encode($data);
	
	
	
    exit();

	
}

?>