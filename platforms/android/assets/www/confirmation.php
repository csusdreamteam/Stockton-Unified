<?php

include('connectionOpen.php');


//Passkey that we got from link
$passkey=$_GET['passkey'];
$tbl_name1="temp_members_db";

//RETRIEVE DATA FROM TABLE WHERE ROW THAT MATCH THIS PASSKEY
$sql1="SELECT * FROM $tbl_name1 WHERE confirm_code ='$passkey'";
$result1=mysql_query($sql1);

//IF SUCCESSFULLY QUERIED
if($result1){


//COUNT HOW MANY ROWS HAS THIS PASSKEY
$count=mysql_num_rows($result1);

//IF FOUND THIS PASSKEY IN OUR DATABASE, RETRIEVE FATA FROM TABLE
if($count==1){

$rows=mysql_fetch_array($result1);
$username=$rows['username'];
$password=$rows['password'];
$email=$rows['email'];
$tbl_name2="user_login";

//INSERT DATA FROM 'temp_members_db' INTO 'user-login'
$sql2="INSERT INTO $tbl_name2(USERNAME,PW,email)VALUES('$username','$password','$email')";
$result2=mysql_query($sql2);
}

//IF NOT FOUND PASSKEY, DISPLAY MSG "Wrong confirmation code"
else{
echo "<h1>Wrong Confirmation code</h1>";
}

if($result2){

echo "<h1>Your account has been activated!</h1>";

//DELETE INFORMATION OF THIS USER FROM TABLE 'temp_members'db' THAT HAS THIS PASSKEY
$sql3="DELETE FROM $tbl_name1 WHERE confirm_code = '$passkey'";
$result3=mysql_query($sql3);

}

}
?>

