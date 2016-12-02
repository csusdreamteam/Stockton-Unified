<?php
//mssql.secure_connection = On
// Need to upload ntwdblib.dll from net

$myServer = “50.202.221.40\SQLEXPRESS”; // host/instance_name
$myUser = “djrabang”; // username
$myPass = “FarmtoF0rk!”; // paasword
$myDB = “SacState; // database name

// connection to the database
$dbhandle = mssql_connect($myServer, $myUser, $myPass)
or die(“Couldn’t connect to SQL Server on $myServer”);

// select a database to work with
$selected = mssql_select_db($myDB, $dbhandle)
or die(“Couldn’t open database $myDB”);

echo “You are connected to the ” . $myDB . ” database on the ” . $myServer . “.”;

$query = “select [Title] FROM [SacState].[dbo].[List_Of_Employees]”; // your database query
$result = mssql_query($query);
while($row = mssql_fetch_assoc($result))
{
print_r($row);
}
// close the connection
mssql_close($dbhandle);
?>