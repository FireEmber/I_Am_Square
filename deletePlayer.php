<?php
	$file = "players.tptk";
	$temp = "players.tmp";
	$echoText = "Player with id: " . $_POST["id"] . " deleted.";
	
	$reading = @fopen($file, "r");
	$writing = @fopen($temp, "w");
	if($reading && $writing){
		$replaced = false;
		
		while (!feof($reading)) {
			$line = fgets($reading);
			if (stristr($line,"id:" . $_POST["id"])) {
				$line = "";
				$replaced = true;
			}
			fputs($writing, $line);
		}
	}
	
	fclose($reading); fclose($writing);
	// might as well not overwrite the file if we didn"t replace anything
	if ($replaced) 
	{
		rename($temp, $file);
		} else {
		unlink($temp);
	}
	echo $echoText;
	exit();
?>