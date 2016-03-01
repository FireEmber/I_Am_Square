<?php
	$reading = @fopen($file, "r");
	$writing = @fopen($temp, "w");
	
	if($reading && $writing){
		$replaced = false;
		
		while (!feof($reading)) {
			$line = fgets($reading);
			if (!stristr($line,"id:") && !$replaced) {
				$line =
				"id:" . $_POST["id"] . ";" . 
				"color:" . $_POST["color"] . ";" . 
				"x:" . $_POST["x"] . ";" . 
				"y:" . $_POST["y"];
				$line .= "\n";
				$replaced = true;
			}
			fputs($writing, $line);
		}
	}
	if(!$reading || !$writing){
		$echoText = "Error: File(s) could not be opened! Location: createPlayer.php. Reading: " . $reading . ", Writing: " . $writing . "test3";
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
	die();
?>