<?php

class Login{

    function login() {
        
        session_start();
    
        return ("Bem-vindo João Alberto!");
    }

    function logout(){

        session_start();
        session_destroy();

        return("Sessão Terminada!");
    }
    
 }
?>