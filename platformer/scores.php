<?php
	include 'dblogin.php';

	$query = $conn->query('SELECT * FROM score_table', PDO::FETCH_ASSOC);

	$info = array();

	while ($row = $query->fetch()) {
		array_push($info, $row);
	}

	echo json_encode($info);
?>