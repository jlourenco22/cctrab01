<?php

include_once "../model/modelLogin.php";

$log = new Login();

if($_POST['op'] == 1){
    $resp = $log -> login();
    echo($resp);
} else if($_POST['op'] == 2){
    $resp = $log -> logout();
    echo($resp);
}


?>