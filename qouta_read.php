<?php
include('database_config.php');
$data_array = json_decode(file_get_contents('php://input'), true);

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT responses FROM `$table_data`");
    $stmt->execute();
    // $col_names = array();
    // while($row = $stmt->fetchColumn()) {
    //     $col_names[] = $row;
    // }

    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    echo json_encode($result);

}

catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$conn = null;
?> 