<?php

include_once "../model/model_perfil_Clientes.php";

$log = new Edita();

if($_POST['op'] == 1){
    $resp = $log -> editaCliente(
        $_POST['id']
    );
    echo($resp);

}else if($_POST['op'] == 2){
   
    $resp = $log->guardaEditaCliente(
        $_POST['id'],
        $_POST['editnomeCliente'],
        $_POST['editNIFCliente'],
        $_POST['editemailCliente'],
        $_POST['editmoradaCliente'],
        $_POST['editcodigopostalCliente'],
        $_POST['edittelemovelCliente'],
        $_POST['editNISSCliente'],
        $_POST['editultimonomeCliente'],
        $_POST['editdescricaoCliente'],
        $_POST['editdatanasciementoCliente'],
        $_FILES
    );
    echo ($resp);

}else if($_POST['op'] == 3){
    $resp = $log -> removeCliente($_POST['id']);
    echo($resp);
}else if($_POST['op'] == 4){
    $resp = $log -> listaServicos($_POST['id']);
    echo($resp);
}else if($_POST['op'] == 5){
   
    $resp = $log->guardaEditaCliente_pw_edition(
        $_POST['id'],
        $_POST['editpswCliente']
    );
    echo ($resp);
}else if($_POST['op'] == 6){
    $resp = $log -> listaPagamentos($_POST['id']);
    echo($resp);
}
?>