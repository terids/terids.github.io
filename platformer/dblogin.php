<?php
	$servername = "http://vesta.uclan.ac.uk/~gkirk2";//"vesta.uclan.ac.uk";
	$username = "gkirk2";
	$password = "ratcb99n";
	$dbname = "gkirk2";

	try {
		$conn = new PDO('mysql:host=$servername;dbname=$dbname', $username, $password);
		//$conn = new PDO('mysql:host=localhost;dbname=gkirk2', gkirk, ratcb99n);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		echo "Connection SUCCESSSSSSS";
	}
	catch {
		echo "Connection failed: " . $e->getMessage();
	}
?>