<?php
	$file = "players.tptk";
	$temp = "players.tmp";
	$echoText = "Player with id: " . $_POST["id"] . " saved.";
	
	$reading = @fopen($file, "r");
	$writing = @fopen($temp, "w");
	if($reading && $writing){
		$replaced = false;
		
		while (!feof($reading)) {
			$line = fgets($reading);
			if (stristr($line,"id:" . $_POST["id"])) {
				$arrParts = explode(";", $line);
				$arrVars;
				for($pos = 0; $pos < count($arrParts);$pos++){
					$arrVars[$pos] = explode(":",$arrParts[$pos]);
				}
				$x;$y;
				for($pos = 0; $pos<count($arrVars);$pos++){
					if(stristr($arrVars[$pos][0], "x")){$x = (int) $arrVars[$pos][1];}
					if(stristr($arrVars[$pos][0], "y")){$y = (int) $arrVars[$pos][1];}
				}
				if($_POST["leftArrow"]==1){$x-=5;}
				if($_POST["rightArrow"]==1){$x+=5;}
				if($_POST["upArrow"]==1){$y-=5;}
				if($_POST["downArrow"]==1){$y+=5;}
				if($x<0){$x=0;}
				if($y<0){$y=0;}
				$line =
				"id:" . $_POST["id"] . ";" . 
				"color:" . $arrVars[1][1] . ";" . 
				"x:" . $x . ";" . 
				"y:" . $y;
				$line .= "\n";
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