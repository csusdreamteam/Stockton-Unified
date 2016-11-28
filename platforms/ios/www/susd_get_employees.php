<?php
include 'connectionOpen.php';//call file to connect to database

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data
$rows = array();


	
if($_SERVER['REQUEST_METHOD'] === 'POST') {

	$school=stripslashes(trim($_POST['school']));
	$title=stripslashes(trim($_POST['title']));
	
	$q=mysql_query("SELECT Directory_Name FROM Employee_List WHERE Department='$school' and Title='$title';");
 	
		$data['success'] = true;

	$row = mysql_fetch_array($q);
	
	
	$num_rows = mysql_num_rows($q);
	
	//$data['name'] = $row['Directory_Name'];
	$data['length'] = $num_rows;
	
	do{
	    //$list .= $row['Directory_Name'];
		//$data['name'] = $row['Directory_Name'];
		$data[] = $row['Directory_Name'];
		
	} while ($row = mysql_fetch_array($q));
	
	//$data[] = $list;
	
	/*
	while($rows = mysql_fetch_array($q)){
		array_push($data, $rows);
	}
	*/

	
	
	
	
	
    // return all our data to an AJAX call
    echo json_encode($data);
    exit();

	
}
?>