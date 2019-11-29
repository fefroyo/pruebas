<?php 

$botToken = "386844828:AAHZcFYFI-2E-ZlQPllTPIYBbd07CXhhX0c";
$website = "https://api.telegram.org/bot".$botToken;

$update = file_get_contents('php://input');
$update = json_decode($update, TRUE);

$chatId = $update["message"]["chat"]["id"];
$chatType = $update["message"]["chat"]["type"];

$message = $update["message"]["text"];


switch ($command) {
	case '/ayuda':
		$response = "Tranquilo, estoy contigo.";
		sendMessage($chatId, $response);
		break;
	
	default:
		break;

}

function sendMessage($chatId,$response){

	$url = $GLOBALS[website].'/sendMessage?chat_id='.$chatId.'&parse_mode=HTML&text='.urlencode($response);
	file_get_contents($url);
}



?>