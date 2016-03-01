<?php
	$file = "players.tptk";
	
	$reading = @fopen($file, "r");
	if($reading){
		$objArr = "[";
		while (!feof($reading)) {
			$line = fgets($reading);
			$line = str_replace(PHP_EOL,'',$line);
			$line = str_replace("\n",'',$line);
			$obj = "";
			if(stristr($line, "id:")){
				$tempArr1 = explode(";", $line);
				$obj = "{";
				for($i=0;$i<count($tempArr1);$i++){
					$tempArr2 = explode(":",$tempArr1[$i]);
					for($j=0;$j<count($tempArr2);$j++){
						$obj.='"' . $tempArr2[$j] . '"';
						if($j==0){
							$obj.=':';
						}
					}
					if($i != count($tempArr1) - 1){
						$obj.=",";
					}
					
				}
				$obj .="},";
				
			}
			$objArr.=$obj;
		}
		$objArr = trim($objArr, ",");
		$objArr.="]";
	}
	fclose($reading);
	
	echo($objArr);
	exit();
?>		