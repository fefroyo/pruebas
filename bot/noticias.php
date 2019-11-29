<?php 

$botToken = "386844828:AAHZcFYFI-2E-ZlQPllTPIYBbd07CXhhX0c";

$website = "https://api.telegram.org/bot".$botToken;

$update = file_get_contents('php://input');
$update = json_decode($update, TRUE);
$modo = 0;

$chatId = $update["message"]["chat"]["id"];
$chatType = $update["message"]["chat"]["type"];
$userId = $update["message"]['from']['id'];
$firstname = $update["message"]['from']['username'];
if ($firstname=="") {
	$modo=1;
	$firstname = $update["message"]['from']['first_name'];
}

if ($modo == 0) {
	$firstname = "@".$firstname;
}

$message = $update["message"]["text"];

$agg = json_encode($update, JSON_PRETTY_PRINT);




//Extraemos el Comando
$arr = explode(' ',trim($message));
$command = $arr[0];

$message = substr(strstr($message," "), 1);

//No requieren variables del usuario.
switch ($command) {
	case '/ayuda':
		$response = "Tranquilo, estoy contigo.";
		sendMessage($chatId, $response);
		break;
	case '/ayuda2':
		$response = "Tranquilo, estoy contigo.";
		$keyboard = '["Gracias"],["Pos Ok"]';
		sendMessage($chatId, $response,$keyboard);
		break;
	case '/noticias':
		getNoticias($chatId);
		break;
	case '/participar': case '/participar@VazCell_bot':
		getSorteos($chatId, $message, $userId, $firstname, $agg);
		break;
	case '/youtube':
		sendMessage($chatId, "Mi canal de YouTube es <a href='https://www.youtube.com/channel/UCGArCE3vmQkFpu_o_6axt1g'>SrVazquez</a>");
	break;

}



function sendMessage($chatId, $response, $keyboard = NULL){
	if (isset($keyboard)) {
		$teclado = '&reply_markup={"keyboard":['.$keyboard.'], "resize_keyboard":true, "one_time_keyboard":true}';
	}
	$url = $GLOBALS[website].'/sendMessage?chat_id='.$chatId.'&parse_mode=HTML&text='.urlencode($response).$teclado;
	file_get_contents($url);
}

function getNoticias($chatId){

	//include("simple_html_dom.php");

	$context = stream_context_create(array('http' =>  array('header' => 'Accept: application/xml')));
	$url = "http://www.europapress.es/rss/rss.aspx";

	$xmlstring = file_get_contents($url, false, $context);

	$xml = simplexml_load_string($xmlstring, "SimpleXMLElement", LIBXML_NOCDATA);
	$json = json_encode($xml);
	$array = json_decode($json, TRUE);

	for ($i=0; $i < 9; $i++) { 
		$titulos = $titulos."\n\n".$array['channel']['item'][$i]['title']."<a href='".$array['channel']['item'][$i]['link']."'> +info</a>";
	}

	sendMessage($chatId, $titulos);



}

?>