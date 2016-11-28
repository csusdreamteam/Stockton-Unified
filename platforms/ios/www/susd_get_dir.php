<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------
  $host = "athena.ecs.csus.edu";
  $user = "susd_user";
  $pass = "Buzz1234";
  

  $databaseName = "susd";
  $tableName = "Employee_List";

  $rows = Array();

  //--------------------------------------------------------------------------
  // 1) Connect to mysql database
  //--------------------------------------------------------------------------
  
  $con = mysql_connect($host,$user,$pass);
  $dbs = mysql_select_db($databaseName, $con);

  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
/*  $result = mysql_query("SELECT * FROM $tableName");          //query
//  $array = mysql_fetch_row($result);                          //fetch result    

	$num_rows = mysql_query("SELECT COUNT(*) from $tableName");

	while($row = mysql_fetch_array($result)){
		array_push($rows, $row);
	}
*/
	$result = mysql_query("SELECT Directory_Name FROM Employee_List;");
	$array = mysql_fetch_row($result);

	$num_rows = mysql_query("SELECT COUNT(*) from $tableName");

	while($row = mysql_fetch_array($result)){
		array_push($rows, $row);
	}

  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
//  echo json_encode($array);
echo json_encode($rows);


?>
