<?php
	
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	
	$base = str_replace(":","-","players/player-" . $_POST["clientHash"] . "-" . $httpClientIP . $httpXForwardedFor . $remoteAddress);
	
	$file = $base . ".tptk";
	
	unlink($file);
	exit();
?>