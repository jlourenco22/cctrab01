<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "recuvera_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifique a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}


