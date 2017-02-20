<?php
	$httpClientIP = (!empty($_SERVER['HTTP_CLIENT_IP'])) ? $_SERVER['HTTP_CLIENT_IP'] : "NR";
	$httpXForwardedFor = (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : "NR";
	$remoteAddress = (!empty($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : "NR";
	
	$base = str_replace(":","-","players/player-" . $_POST["clientHash"] . "-" . $httpClientIP . $httpXForwardedFor . $remoteAddress);
	
	$file = $base . ".tptk";
	
	$writing = fopen($file, "w+");
	
	function generateHash($length){
		$possibleChars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

		$hash = '';
		for($i = 0; $i < $length; $i++){
			$hash .= $possibleChars[rand(0, sizeof($possibleChars) - 1)];
		}
		return $hash;
	}
	
	fwrite($writing, "\"playerHashID\": \"" . generateHash(10) . "\";\n");
	fwrite($writing, "\"color\": \"" . $_POST["color"] . "\";\n");
	fwrite($writing, "\"x\": \"" . $_POST["x"] . "\";\n");
	fwrite($writing, "\"y\": \"" . $_POST["y"] . "\";\n");
	
	fclose($writing);
	exit();
?>