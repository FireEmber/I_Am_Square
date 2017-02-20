<?php
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	
	$base = str_replace(":","-","players/player-" . $_POST["clientHash"] . "-" . $httpClientIP . $httpXForwardedFor . $remoteAddress);
	
	$file = $base . ".tptk";
	$temp = $base . ".tmp";
	
	$content = file_get_contents($file);
	$content = str_replace("\n", "", $content);
	$contentArray = explode(";", $content);
	$contentPlayerHashIDRow = explode(": ", $contentArray[0]);
	$contentColorRow = explode(": ", $contentArray[1]);
	$contentXRow = explode(": ", $contentArray[2]);
	$contentXRow[1] = str_replace('"', "", $contentXRow[1]);
	$contentYRow = explode(": ", $contentArray[3]);
	$contentYRow[1] = str_replace('"', "", $contentYRow[1]);
	
	if($_POST["rightArrow"]){
		$contentXRow[1] = intval($contentXRow[1]) + 5;
	}
	if($_POST["leftArrow"]){
		$contentXRow[1] = intval($contentXRow[1]) - 5;
	}
	echo($contentXRow[1] . '|' . $_POST["rightArrow"] . '|' . $_POST["leftArrow"]);
	if($contentXRow[1] < 0){
		$contentXRow[1] = 0;
	}
	
	if($_POST["upArrow"]){
		$contentYRow[1] = intval($contentYRow[1]) - 5;
	}
	if($_POST["downArrow"]){
		$contentYRow[1] = intval($contentYRow[1]) + 5;
	}
	if($contentYRow[1] < 0){
		$contentYRow[1] = 0;
	}
	
	$contentXRow[1] = '"' . $contentXRow[1] . '"';
	$contentYRow[1] = '"' . $contentYRow[1] . '"';
	
	$writing = @fopen($temp, "w");
	fwrite($writing,
			implode(": ", $contentPlayerHashIDRow) . ";\n" . 
			implode(": ", $contentColorRow) . ";\n" . 
			implode(": ", $contentXRow) . ";\n" . 
			implode(": ", $contentYRow) . ";\n");
	fclose($writing);
	rename($temp, $file);
	exit();
?>