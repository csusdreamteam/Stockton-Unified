<?php

//include 'open_sql_express_conn.php';//call file to connect to database

$myServer = '50.202.221.40\SQLEXPRESS'; // host/instance_name
$myUser = 'djrabang'; // username
$myPass = 'FarmtoF0rk!'; // paasword
$myDB = 'SacState'; // database name

$data   = array(); // array to pass back data


$serverName = "50.202.221.40\SQLEXPRESS"; //serverName\instanceName
$connectionInfo = array( "Database" => "SacState", "UID" => "djrabang", "PWD" => "FarmtoF0rk!");
$conn = sqlsrv_connect( $serverName, $connectionInfo);


if( $conn ) {
     echo "Connection established.<br />";
	 $data['success'] = true;
}else{
     echo "<h1>Connection could not be established.</h1>";
	 $data['success'] = false;
	 die('MSSQL error: ' . mssql_get_last_message());
     
}



//if($_SERVER['REQUEST_METHOD'] === 'POST') {	
	// connection to the database
	
	/*
	$dbhandle = mssql_connect($myServer, $myUser, $myPass);
	
 	
	if($dbhandle){
		$data['success'] = true;
	}
	else if(!$dbhandle){
		$data['success'] = false;
	}
	*/
	
	
	

	//$data['success'] = true;

    

    // return all our data to an AJAX call
    echo json_encode($data);
    exit();
		

		
?>

