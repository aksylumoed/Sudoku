<?php
include('database_config.php');
// $data_array = json_decode(file_get_contents('php://input'), true);

// $response1 = 

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT count(responses) FROM `$table_data` WHERE  `hardship` = true");
    $stmt->execute();
    $row = $stmt->fetch();

    echo json_encode($row["count(responses)"]);

    // $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    // echo $result;
    
    // $r = array('success' => true);
    // echo json_encode($r);

}

catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?> 