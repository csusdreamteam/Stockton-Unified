<?php
if (function_exists('mssql_connect')){
echo "mssql_connect() function exists <br>";
} else {
echo "mssql_connect() function doesn't exist <br>";
}

if(function_exists('sqlsrv_connect')){
echo "sqlsrv_connect()  exists<br>";
}
else {
echo "sqlsrv_connect()  doesnt exist<br>";

}
if(extension_loaded("mssql")) {
echo "MSSQL is Loaded<br>";
}
else {
echo "MSSQL not loaded<br>";
} 

if(extension_loaded("msql")) {
echo "MSQL is Loaded<br>";
}
else {
echo "MSQL not loaded<br>";
} 
echo '<br><br>';

$ext = get_loaded_extensions();
if(in_array('mssql', $ext))
echo 'you have mssql installed<br><br>';
else
echo 'you do NOT have mssql installed<br><br>';

phpinfo();
?>
