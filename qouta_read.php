<?php
include('database_config.php');
$data_array = json_decode(file_get_contents('php://input'), true);

// $response1 = 

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT responses FROM `$table_data` WHERE  `responses` = '{"Q0":"No, my family did not experience economic hardship"}'");
    $stmt->execute();
    

    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    echo $result;

}

catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?> 