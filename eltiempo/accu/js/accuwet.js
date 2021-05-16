$(document).ready(function() {

$('#basic-modal').click(function() {
$('#mimodal1').css({display: 'block'});
});
$('#basic-modal2').click(function() {
$('#mimodal2').css({display: 'block'});
});
$('.modalclose').click(function() {
$('.mimodal').css({display: 'none'});
});

// scroller
// var myScroll;
// function loaded () {
var myScroll = new IScroll('#wrapper', { 
    scrollX: true, mouseWheel: true });
// } 
// scrollY: false, 
// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, true);
// window.onload = function(){
  // loaded();
// }

// input intro
$(".buscar").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        var text = $(".buscar").val();
        getLocation(text);
      $(".buscar").val($(this).text());
      $("#results").html('');
      $("#results").removeClass('result');
        return false;
    }else { return true; }
});
// boton search
$("#awxSearchButton").click(function () {
    var text = $(".buscar").val();
    getLocation(text);
    $(".buscar").val();
    $("#results").html('');
    $("#results").removeClass('result');
});
// buton GEO location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) { 
  geoLocation(position.coords.latitude+', '+position.coords.longitude); //load weather using your lat/lng coordinates
  });
}else {
  $("#weather").html("Geolocation is not supported by this browser.");
}
$('#geobutton').on('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( function(position) { 
    geoLocation(position.coords.latitude+', '+position.coords.longitude); //load weather using your lat/lng coordinates
    });
  }else {
      $("#weather").html("Geolocation is not supported by this browser.");
  }
// geoLocation(geotext)
});

    // add lista
function get_todos() {
    var todos = new Array;
    var todos_str = localStorage.getItem('todo');
    if (todos_str !== null) {
        todos = JSON.parse(todos_str); 
    } return todos;
}
function add() {
    var task = document.getElementById('autocomplete').value;
    var todos = get_todos();
    todos.push(task);
    localStorage.setItem('todo', JSON.stringify(todos));
    show();
    return false;
}
function remove() {
    var id = this.getAttribute('id');
    var todos = get_todos();
    todos.splice(id, 1);
    localStorage.setItem('todo', JSON.stringify(todos));
    show();
    return false;
}
function show() {
    var todos = get_todos();
    var html = '<ul class="list" id="side-bar">';
    for(var i=0; i<todos.length; i++) {
        html += '<li><a class="item item-icon-left item-icon-right" href="#" data-desc="' 
        + todos[i] + '" data-city="' + todos[i]+ '"><i class="icon ion-ios-location"></i>' 
        + todos[i] +' <i class="icon ion-ios-close-outline remove" id="' +i+ '"></i></a></li>';
    };
    html += '</ul>';
 
    document.getElementById('delegateAnchor').innerHTML = html;
 
    var buttons = document.getElementsByClassName('remove');
    for (var i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };
}
document.getElementById('add2').addEventListener('click', add);
show();

// lista
$('#delegateAnchor').on('click', '#side-bar a', function() {
    var $this = $(this);
    var linkId = $this.data('desc');
    localStorage.setItem("menuSelection", linkId);

    $this.closest('ul').find('a').removeClass("active");
    $this.addClass("active");
    
    var ciu = $(this).data('city');
    localStorage.setItem("selectedolditem", ciu);
});
    
  var selectedLinkId = localStorage.getItem("menuSelection");
  if (selectedLinkId !== null) {
      $('#side-bar a[data-desc="'+ selectedLinkId +'"]').trigger("click");
  }
 $(document).on('click', '#side-bar a', function (e) {
    e.preventDefault();
    var ciu = $(this).data('city');
    localStorage.setItem("selectedolditem", ciu);
    getLocation(ciu);
 });


});


// var optVal = $('#states').val();
//$("#selecionado").html(optVal);
// localStorage.setItem('langu', optVal);
// var language = localStorage.getItem('langu');
var lenguaje = $('#states').val();
//console.log(language);

// __opciones idioma__________________
var select = document.querySelector("#states");
var selectOption = select.options[select.selectedIndex];
var lastSelected = localStorage.getItem('langu');
if(lastSelected) { select.value = lastSelected; }

//var language = localStorage.getItem('select');
// $('select').on('change', function() {
//   $("#selecionado").html(this.value);
// });
//getLocation(localStorage.getItem('selectedolditem'));
lenguaje = localStorage.getItem('langu');

$(document).on('change', "#states", function (e) {
  e.preventDefault();
  lastSelected = select.options[select.selectedIndex].value;
  //lastSelected = $( "#states option:selected" ).text();
  localStorage.setItem('langu', lastSelected);
  var lenguaje = localStorage.getItem('langu');
  getLocation(localStorage.getItem('selectedolditem'));

});

var unidades = $('#units_metric').attr('checked', 'checked');

$(document).on('change', function (e) {
  e.preventDefault();
  unid = $('input[name="options"]:checked').val();
  localStorage.setItem('unidsel', unid);
  var unidades = localStorage.getItem('unidsel');
  getLocation(localStorage.getItem('selectedolditem'));
  //getLocation(unidades);
});

// fin opciones

var apiKey = "ff1b463d98fb47af848ea2843ec5c925"; // 9d5e8176302f25e92b3a5f4780f01
// http://tinyurl.com/orq3rgr/accuweather-com-stratus-widget/dm315a

//var folder = "http://apidev.accuweather.com/developers/Media/Default/WeatherIcons/";
var folder = "sym9/";

// http://api.worldweatheronline.com/free/v2/weather.ashx?key=9d5e8176302f25e92b3a5f4780f01&q=''&num_of_days= &tp=24&format=json

$(".buscar").keyup(function() {
    getAutoCompleteValues($(".buscar").val());
});
function getAutoCompleteValues(val) {
  // accuweather api key
//if (val.length < 3) return false;
  $.ajax({
    url: "http://apidev.accuweather.com/locations/v1/cities/autocomplete?apikey="+ apiKey +"&q=" + val,
    type: "GET",
    dataType: "jsonp",
    jsonp: "callback",
    cache: false,
    success: function(data) {
      //                    alert(data);
      if (val == "") {
      $("#results").html('');
      $("#results").removeClass('result');}
      else {
      $("#results").html('');
      $("#results").addClass('result');

      $.each(data, function(i, item) {
        $("#results").append('<li class="searchterm">'
        	+ item.LocalizedName + ", " + item.Country.ID +'</li>');   
      });
      $("li.searchterm").click(function() { 
          $(".buscar").val($(this).text());
          $("#results").html('');
          $("#results").removeClass('result');
        });
     }
    }
  });
}

function geoLocation(geotext) {

var lenguaje = localStorage.getItem('langu');

locationGEO = "http://apidev.accuweather.com/locations/v1/cities/geoposition/search.json?q=" + geotext + "&language=" + lenguaje + "&apikey=" + apiKey;  
//api.accuweather.com/locations/v1/cities/geoposition/search.json?q=40, -73&

console.log(locationGEO);

  $.ajax({
      url:locationGEO,
      type: "GET",
      jsonpCallback: "awxCallback",
      dataType: 'jsonp',
      cache: true,
      // work with the response
      success: function(data) {

      var cityKeygeo = data.Key;

      $('#weather_description').html(data.LocalizedName+ ", "+data.Country.ID);
      getCurrent(cityKeygeo);
      //console.log(cityKeygeo);
       
      },
  });
}

// localizacion seleccionada de la lista
function getLocation(freetext) {
  
  //var lenguaje = localStorage.getItem('langu');
  var lenguaje = $('#states').val();
  	//var freetext = $('#autocomplete').val();
  locationUrl = "http://apidev.accuweather.com/locations/v1/search?q=" + freetext + "&language=" + lenguaje + "&apikey=" + apiKey;

console.log(lenguaje);
console.log(locationUrl);

    $.ajax({
      url:locationUrl,
      type: "GET",
      jsonpCallback: "awxCallback",
      dataType: 'jsonp',
      cache: true,
      // work with the response
      success: function(data) {

      var cityKey = data[0].Key;

    	$('#weather_description').html(data[0].LocalizedName+ ", "+ data[0].Country.ID);
    	//+ ", "+ cityKey);
    	getCurrent(cityKey);
       
      },
    });

  }getLocation(localStorage.getItem('selectedolditem'));

function getCurrent(cityKey) {

    var lenguaje = localStorage.getItem('langu');
    var unidades = localStorage.getItem('unidsel');
    // localUrl ="http://apidev.accuweather.com/localweather/v1/" + cityKey + ".json?language=" + language + "&details=true&getphotos=true&metric=" + unidades + "&apikey=" + apiKey;
    currentUrl = "http://apidev.accuweather.com/currentconditions/v1/" + cityKey + ".json?language=" + lenguaje + "&details=true&getphotos=true&apikey=" + apiKey;
    foreUrl = "http://apidev.accuweather.com/forecasts/v1/daily/5day/" + cityKey + ".json?language=" + lenguaje + "&details=true&metric=" + unidades + "&apikey=" + apiKey;
    horaUrl = "http://apidev.accuweather.com/forecasts/v1/hourly/12hour/" + cityKey + ".json?language=" + lenguaje + "&details=true&metric=" + unidades + "&apikey=" + apiKey;
    // http://api.accuweather.com/forecasts/v1/hourly/24hour/335315?apikey={your key} - 5day, 10day, 15day
    // http://api.accuweather.com/localweather/v1/349727?apikey={your key}

    $.ajax({
      url:currentUrl,
      type: "GET",
      jsonpCallback: "awxCallback",
      dataType: 'jsonp',
      cache: true,
      success: function(data) {

// FOTO DE FONDO_________
    // var foto = data[0].Photos[0].PortraitLink; //Landscape Portrait
    // $("body").css('background-image', 'url('+foto+')');

    var isCelcius = (function() {
    var check = document.getElementById('units_metric');
    var func = function() {
      return check.checked
    }
      return func;
    })()

  $('#temperatura').html(Math.round(data[0].Temperature[isCelcius() ? 'Metric' : 'Imperial'].Value));
  $('#temp-hi-t').text(data[0].TemperatureSummary.Past6HourRange.Maximum[isCelcius() ? 'Metric' : 'Imperial'].Value);
  $('#temp-lo-t').text(data[0].TemperatureSummary.Past6HourRange.Minimum[isCelcius() ? 'Metric' : 'Imperial'].Value);
  $('#condicion').text(data[0].WeatherText);
  $('#sensacion').text(data[0].RealFeelTemperature[isCelcius() ? 'Metric' : 'Imperial'].Value);
  $('#weather_windD').text(data[0].Wind.Direction.Degrees+' '+data[0].Wind.Direction.Localized);
	$('#viento').text(data[0].Wind.Speed[isCelcius() ? 'Metric' : 'Imperial'].Value+' '+data[0].Wind.Speed[isCelcius() ? 'Metric' : 'Imperial'].Unit);
  $('#humedad').text(data[0].RelativeHumidity);
  $('#precip').text(data[0].PrecipitationSummary.Precipitation[isCelcius() ? 'Metric' : 'Imperial'].Value);
  $('#presion').text(data[0].Pressure[isCelcius() ? 'Metric' : 'Imperial'].Value+' '+data[0].Pressure[isCelcius() ? 'Metric' : 'Imperial'].Unit);
		
    var wicon1 = data[0].WeatherIcon;
    
    if ( wicon1 < 10 ){
      // var wIcon = 'http://apidev.accuweather.com/developers/Media/Default/WeatherIcons/0'+wicon1+'-s.png';
      var wIcon = folder+'0'+wicon1+'.png';
    }else {
      var wIcon = folder+wicon1+'.png'; 
    }
		$('#icn').attr('src', wIcon);
    
    // $('#accuicon').addClass('icon-accu'+wicon1);
    // $('#accuicon').html('<i class="wicon current icon-accu'+wicon1+'"></i>');
    // $('#img').attr('src', foto);

    // PrecipitationSummary Precipitation Metric Value-Unit
    actual = moment(data[0].LocalObservationDateTime);
    $("#fechita").html('Actualizado a: '+ actual.format(" H:mm"));
    
      },
      
    });
// forecast DIAS
$.ajax({
  url:foreUrl,
  type: "GET",
  dataType: 'jsonp',
  cache: true,
  success: function(data) {

// var sunrise = data.DailyForecasts[0].Sun.Rise+' '+data.DailyForecasts[0].Sun.Set;
// var moonrise = data.DailyForecasts[0].Moon.Rise+' '+data.DailyForecasts[0].Moon.Set;
// var moonphase = data.DailyForecasts[0].Moon.Phase+' '+data.DailyForecasts[0].Moon.Age;

var langluna = localStorage.getItem('langu');
var day = new Date();
var mes = day.getMonth()+1;
var anio = day.getUTCFullYear();	 

// luna
$.getJSON( "http://www.wdisseny.com/lluna/api/?lang="
  +langluna+"&month="+mes+"&year="+anio+"&size=50&lightColor=currentColor&shadeColor=black&sizeQuarter=20&texturize=true&LDZ=1462053600&", function(moon) {

  // $("#laluna").addClass('icon-luna');
  $("#laluna").html(moon.phase[day].svg);
  $(".luna_ilum").html(Math.round(moon.phase[day].lighting)+'%');
  $("#faseluna").html(moon.phase[day].phaseName);

});// fin luna

//$("#laluna").addClass('icon-luna'+data.DailyForecasts[0].Moon.Age);

// fase luna wdisseny
  // var language = 'es';
  // $.getJSON( "http://www.wdisseny.com/lluna/api/?lang="+language+"&month=5&year=2016&size=50&lightColor=currentColor&shadeColor=black&sizeQuarter=20&texturize=true&LDZ=1462053600&", function(moon) {
  // var day = new Date().getDate();
  // $(".icon-luna").html(moon.phase[day].svg);
  // $(".luna_ilum").html(Math.round(moon.phase[day].lighting)+'%');
  // $(".faseluna").html(moon.phase[day].phaseName);
  // });
// fin luna

    var lenguaje = localStorage.getItem('langu');

    var sunriseD = moment(data.DailyForecasts[0].Sun.Rise).locale(lenguaje);
    var sunsetD = moment(data.DailyForecasts[0].Sun.Set).locale(lenguaje);
    // var mihora = sunriseD.format("H:mm");
    $("#sol").html('<i class="wicon wfore icon-sunrise"></i> '+ sunriseD.format("H:mm")+' <i class="wicon wfore icon-sunset"></i> '+sunsetD.format("H:mm"));
    // $('.laluna').attr('src', 'https://www.wunderground.com/graphics/moonpictsnew/moon'+data.DailyForecasts[0].Moon.Age+'.gif');
    // <i class="icon icon-luna4"></i>
     // $('#faseluna').html(faseES[data.DailyForecasts[0].Moon.Phase]);
// data.DailyForecasts[0].Moon.Phase[faseES]
  var porhoras = "<ul>";
  for (i = 0; i < data.DailyForecasts.length; i++) { 

  var wiconFdia = data.DailyForecasts[i].Day.Icon;
  var wiconFnoche = data.DailyForecasts[i].Night.Icon;
  var dayCode = moment.unix(data.DailyForecasts[i].EpochDate).locale(lenguaje);
  var miday2 = dayCode.format("dddd").toUpperCase();

    porhoras += '<li class="row">';
    porhoras += '<div class="col"><span>'+miday2+'</span></div><div class="col">';
    
    //porhoras += '<i class="wicon whoras icon-accu'+data.DailyForecasts[i].Day.Icon+'"></i>';
    //porhoras += '<img src="'+ folder + data.DailyForecasts[i].Day.Icon + '-s.png" width="50" />';
    
    if (wiconFdia < 10){
      porhoras += '<img src="'+folder+'0' + wiconFdia + '.png" width="50" />';
    }else if (wiconFdia){
      porhoras += '<img src="'+folder+'' + wiconFdia + '.png" width="50" />';
    }else if (wiconFnoche < 10){
      porhoras += '<img src="'+folder+'0' + wiconFnoche + '.png" width="50" />';
    }else if (wiconFnoche){
      porhoras += '<img src="'+folder+'' + wiconFnoche + '.png" width="50" />';
    }  

    porhoras += '</div><div class="col">';
    porhoras += '<span class="temp-high">'+Math.round(data.DailyForecasts[i].Temperature.Maximum.Value)+'°</span>';
    porhoras += '<span class="temp-low">'+Math.round(data.DailyForecasts[i].Temperature.Minimum.Value)+'°</span>';
    porhoras += "</div></li>";

    document.getElementById("five-day").innerHTML = porhoras; 
  }
  porhoras += "</ul>";
	  
      },
    });

// forecast HORAS
    $.ajax({
      url:horaUrl,
      type: "GET",
      dataType: 'jsonp',
      //jsonpCallback: "awxCallback",
      cache: true,
      success: function(data) {

      var porhoras2 = "<ul>";
      for (i = 0; i < 12; i++) {
        var horasCode = moment(data[i].DateTime).locale(lenguaje);
        var mihora = horasCode.format("H:mm");
        var wiconH = data[i].WeatherIcon;

        // $('.precipH').html(data[0].PrecipitationProbability);
        // $('.precipH').html(mihora);
    porhoras2 += '<li class="daily">';
    porhoras2 += '<div class="day">'+mihora+'</div>';
    
      // porhoras2 += '<i class="wicon whoras icon-accu'+data[i].WeatherIcon+'"></i>';

      if (wiconH < 10){
        porhoras2 += '<img src="'+folder+'0' + wiconH + '.png" width="70" />';
      }else {
        porhoras2 += '<img src="'+folder+'' + wiconH + '.png" width="70" />';
      }
    
    // porhoras2 += '<img src="http://icons.wxug.com/i/c/i/sunny.gif">';
    
    porhoras2 += '<div class="temp high">'+Math.round(data[i].Temperature.Value)+' &deg;</div>';
    
    if (data[i].RainProbability == 0){
      porhoras2 += '<div class="temp low">&nbsp;</div>';
    }else {
      porhoras2 += '<div class="temp low">'+data[i].RainProbability+' %</div>';
    }
    porhoras2 += "</li>";

    document.getElementById("mishoras").innerHTML = porhoras2; 
  }
  porhoras2 += "</ul>";
        
      },
      
    });
}
