<?php
	$baseDir = "players";
	$fileList = scandir($baseDir);
	$objArr = "[";
	
	foreach($fileList as $file){
		if(preg_match("/player-([0-9A-Z])+-[\s\S]+.tptk/", $file)){
			$fileContent = @file_get_contents($baseDir . "/" . $file);
			$fileContent = str_replace("\n","",$fileContent);
			$fileContent = str_replace(";",",",$fileContent);
			$objArr .= "{" . rtrim($fileContent, ",") . "},";
		}
	}
	$objArr = rtrim($objArr, ",");
	$objArr.="]";
	
	echo($objArr);
	exit();
?>		