<?php

	$headers = apache_request_headers();

	require('../dbconnect.php');

	//updating data
	if($_SERVER['REQUEST_METHOD'] == 'PUT'){
		// real data from the request body
		$data = file_get_contents("php://input");
		$jsonDecode = json_decode($data, true);

		//We have post data
		
		$sql = "UPDATE guestlist " .
				"SET invitationStatus='" . mysql_real_escape_string( $jsonDecode['invitationStatus']) . "' ," .
				"numOfPeopleComing='" . mysql_real_escape_string( $jsonDecode['numOfPeopleComing']) . "' " .
				"WHERE id'{$jsonDecode['id']}'";

		$result = mysql_query($sql);
	} else if ( $_SERVER['REQUEST_METHOD'] == 'GET'){

		$sql = "SELECT * from guestlist";

		// Select query to save the query in the variable 'sql'
		if($_GET['start'] || $_GET['max']){
			$sql .= " LIMIT ";
		}

		if($_GET['start'] ){
			$sql .= $_GET['start'];

			if($_GET['max']){
				$sql .= ', ';
			}
		}

		if($_GET['max']){
			$sql .= $_GET['max'];
		}

		$results = mysql_query($sql);

		$guestList = array();

		// SET DB TABLE COLUMNS TO PHP VARIABLES AND RETRIEVE DATA
		while($myrow = mysql_fetch_array($results)){
			$record = array(
					'id' => $myrow['id'],
					'guestName' => $myrow['guestName'],
					'streetAddress' => $myrow['streetAddress'],
					'city' => $myrow['city'],
					'state' => $myrow['state'],
					'country' => $myrow['country'],
					'peopleInvited' => $myrow['peopleInvited'],
					'numOfPeopleComing' => $myrow['numOfPeopleComing'],
					'invitationStatus' => $myrow['invitationStatus'],
					'thumbnail' => $myrow['thumbnail']
				);

			// APPEND DATA TO GUESTLIST ARRAY
			$guestlist[] = $record;
		}

		//Save the statistics in an array
		$statistics = array();

		//Get number of guests invited
		$sql = "SELECT SUM(peopleInvited) AS total FROM guestlist";
		$dbresult = mysql_query($sql);
		$row = mysql_fetch_object($dbresult);
		$statistics['peopleInvited'] = (int) $row -> total;

		//Get number of guests who are not attending
		$sql = "SELECT SUM('peopleInvited') AS total FROM guestlist where invitationStatus=0";
		$dbresult = mysql_query($sql);
		$row = mysql_fetch_object($dbresult);
		$statistics['totalGuestDeclined'] = (int) $row -> total;

		//Get number of guests coming
		$sql = "SELECT SUM(numOfPeopleComing) AS total FROM guestlist";
		$dbresult = mysql_query($sql);
		$row = mysql_fetch_object($dbresult);
		$statistics['totalGuestComing'] = (int) $row -> total;

		//Get the total number of records
		$sql = "SELECT COUNT(*) AS COUNT FROM guestlist";
		$dbresult = mysql_query($sql);
		$row = mysql_fetch_object($dbresult);
		$statistics['totalRecords'] = (int) $row -> COUNT;


		if($headers['Accept'] == 'application/xml'){

		echo "<?xml version='1.0' encoding='utf8' standalone='yes'?>\n";
		echo "<guests>\n";

			foreach($guestlist as $guest){
				echo "<feed>\n";
				echo "<guest>\n";
				foreach($guest as $columnName => $value){
					echo "<${columnName}>" . htmlentities($value) . "<columnName>\n";
				}
				echo "</guest>\n";
			}
			echo "</guests>\n";

			echo "<statistics>\n";
			foreach($statistics as $columnName => $value){
				echo "<${columnName}>" . " htmlentities($value)" . "</${columnName}>\n";
			}
			echo "</statistics>\n";
			echo "</feed>\n";
		} else {

			// ENCODES THE GUESTLIST ARRAY TO JSON FORMAT
			echo json_encode( array ('guests' => $guestlist, 'statistics' => $statistics));
		}
	}

?>