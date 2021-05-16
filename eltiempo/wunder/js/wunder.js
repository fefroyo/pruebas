jQuery(document).ready(function($) {

// mi modal
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
// function loaded() {
var myScroll = new IScroll('#wrapper', {
  scrollX: true, mouseWheel: true });
// }
// scrollY: false,
// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
// window.onload = function(){ 
  // loaded();
// }

// opciones
var select = document.querySelector("#states");
var selectOption = select.options[select.selectedIndex];
var lastSelected = localStorage.getItem('select');
if(lastSelected) { select.value = lastSelected; }

$(document).on('change', "#states", function (e) {
  e.preventDefault();
  lastSelected = select.options[select.selectedIndex].value;
  localStorage.setItem('select', lastSelected);
  var idioma = localStorage.getItem('select');
  getlink(idioma);
});
// select.onchange = function () {
//    lastSelected = select.options[select.selectedIndex].value;
//    localStorage.setItem('select', lastSelected);
// }
// console.log(lastSelected);

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
        html += '<li><a class="item item-icon-left item-icon-right" href="#" data-desc="' + todos[i] + '" data-city="' + todos[i] 
        + '"><i class="icon ion-ios-location"></i>' + todos[i] +' <i class="icon ion-ios-close-outline remove" id="' + i  + '"></i></a></li>';
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

// resultados
$(".location").keyup(function() {
    getAutoCompleteValues($(".location").val());
});

// lista
$('#delegateAnchor').on('click', '#side-bar a', function() {
    var $this = $(this);
    var linkId = $this.data('desc');
    
    $this.closest('ul').find('a').removeClass("active");
    $this.addClass("active");
    
    localStorage.setItem("menuSelection", linkId);

    var ciu = $(this).data('city');
    localStorage.setItem("selectedolditem", ciu);
});
    
var selectedLinkId = localStorage.getItem("menuSelection");
if (selectedLinkId !== null) {
    $('#side-bar a[data-desc="'+ selectedLinkId +'"]').trigger("click");
}

// botones y listas localidades
$(document).on('click', '#side-bar a', function (e) {
    e.preventDefault();
    var ciu = $(this).data('city');
    localStorage.setItem("selectedolditem", ciu);
    getlink();
});

$(document).on('click', '.js-geolocation', function (e) {
    e.preventDefault();
    var ciu3 = $("#autocomplete").val();
    localStorage.setItem("selectedolditem", ciu3);
    getlink();
});

// GPS ___________________
var Geo={};
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getlink2);
}
else {
  $("#weather").html("Geolocation is not supported by this browser.");
}
$('#geobutton').on('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getlink2);
    }
    else {
        $("#weather").html("Geolocation is not supported by this browser.");
    }
});

var appID = "96e4fd7f9fe5cde9"; // 72df18b7f213607b de otro, 96e4fd7f9fe5cde9, f9623cdd2ccc9305 new
var idioma = localStorage.getItem('select');
//localStorage.getItem('select'); -- $("#states").val();

function getAutoCompleteValues(val) {
  $.ajax({
    url: "http://autocomplete.wunderground.com/aq?query=" + val + "&format=json",
    dataType: "jsonp",
    jsonp: "cb",
    cache: 'false',
    // jsonpCallback: "callback",

    success: function(data) {
      // alert(data);
      if (val == "") {
      $("#results").html('');
      $("#results").removeClass('result');}
      else {
      $("#results").html('');
      $("#results").addClass('result');

        for (i in data.RESULTS) {
          var city = data.RESULTS[i]['name'];
          $("#results").append('<li class="searchterm">'+city+'</li>');
        }
        
        $("li.searchterm").click(function() { 
          $(".location").val($(this).text());
          $("#results").html('');
          $("#results").removeClass('result');
        });
      }
      // console.log(data);
    }
  });
}

function getlink2(position) {

  Geo.lat = position.coords.latitude;
  Geo.lng = position.coords.longitude;
  ciudadgps = Geo.lat + "," + Geo.lng;
  // var idioma = localStorage.getItem('select');
  var geturlgps = "http://api.wunderground.com/api/"+ appID +"/lang:"+ idioma +"/geolookup/conditions/forecast/astronomy/hourly/q/"+ ciudadgps +".json";

   $.ajax({
    url : geturlgps,
    dataType : "jsonp",
    success : function(weather) {

      var citygps = weather['location']['city'];
      var getgps = "http://api.wunderground.com/api/"+ appID +"/lang:"+ idioma +"/geolookup/conditions/forecast/astronomy/hourly/q/"+ citygps +".json";
      
        $.ajax({
          url : getgps,
          dataType : "jsonp",
          success : infoweather,
        });
      
    }
    });
}

// tiempo
function getlink(idioma) {

var ciudad = localStorage.getItem('selectedolditem');
// var idioma = localStorage.getItem('select');
var geturl = "http://api.wunderground.com/api/"+ appID +"/lang:"+ idioma +"/geolookup/conditions/forecast10day/astronomy/hourly/q/"+ ciudad +".json";
  
console.log(geturl);
  // otro ajax
  $.ajax({
    url: geturl,
    dataType : "jsonp",
    success : infoweather,
  });
}getlink();

function infoweather(weather){

  var folder_icon = "icon-v4";

  var location = weather['location']['city'];
  var desc = weather['current_observation']['weather'];
  var tempc = weather['current_observation']['temp_c'];
  var tempf = weather['current_observation']['temp_f'];
  var wind_speed = weather.current_observation.wind_kph;
  // var img = weather['current_observation']['icon_url'];
  var forecast = weather.forecast.simpleforecast.forecastday;
  var solsunrise = weather.sun_phase.sunrise.hour+':'+weather.sun_phase.sunrise.minute;
  var solsunset = weather.sun_phase.sunset.hour+':'+weather.sun_phase.sunset.minute;

  var lastUpdated = moment.unix(weather.current_observation.observation_epoch);
  //   html += '<p>'+ forecast[0].avewind.kph + ' km/h</p>';
  //   html += '<p>'+ forecast2[0].fcttext_metric + '</p>';
  var edadluna = weather.moon_phase.ageOfMoon;
  var noche = weather.moon_phase.sunset.hour;
  var now = new Date();
  var hora = now.getHours();
    
    $('#milocation').html(location);
    $('#condicion').html(desc);
    $('#current-temp').html(Math.round(tempc));
    $('#temp-hi-t').html(forecast[0].high.celsius);
    $('#temp-lo-t').html(forecast[0].low.celsius);
    $('#humedad').html(weather.current_observation.relative_humidity);
    $('#viento').html(wind_speed+' km/h');
    $('#presion').html(weather.current_observation.pressure_mb+' mba');
    $('#sensacion').html(weather['current_observation']['feelslike_c']+'°');
// luna    
    $('#luna_desc').html(weather.moon_phase.phaseofMoon);
    $('#luna_ilum').html(weather.moon_phase.percentIlluminated+'%');
    $('#laluna').addClass('icon-luna'+edadluna);
    
    $('#sol').html('<i class="wicon wfore icon-sunrise"></i> '+solsunrise+' <i class="wicon wfore icon-sunset"></i> '+solsunset);
// ultima actualizacion
    // $('#ultimahora').html(lastUpdated.format("H:mm"));
    $('#ultimahora').html(lastUpdated.fromNow());
    // $('.logo').html(weather.current_observation.image.url);

    // + ' F' 'C'
    $("#tempeF").click(function() {
      $('#current-temp').html(tempf);
    });
    $("#tempeC").click(function() {
      $('#current-temp').html(tempc);
    });


    // day and nigh
    if (hora >= noche) {
      // $('#img2').html('<img class="miimg" src="'+folder_icon+'/nt_'+weather.current_observation.icon+'.svg" width="150">');
      // $('#img2').html('<i class="wicon current icon-nt_'+weather.current_observation.icon+'"></i>');
      $('#accuicon').addClass('icon-nt_'+weather.current_observation.icon);
    }else if (hora <= noche) {
      // $('#img2').html('<img class="miimg" src="'+folder_icon+'/'+weather.current_observation.icon+'.svg" width="150">');
      // $('#img2').html('<i class="wicon current icon-'+weather.current_observation.icon+'"></i>');
      $('#accuicon').addClass('icon-'+weather.current_observation.icon);
    }

        //hourly - weather.hourly_forecast.length 36
        var porhoras = "<ul>";
        for (i = 0; i < 12; i++) {
            porhoras += '<li class="daily">';
            porhoras += '<div class="day">'+weather.hourly_forecast[i].FCTTIME.hour + ":" + weather.hourly_forecast[i].FCTTIME.min+'</div>';
            
            //porhoras += '<img src="'+folder_icon+'/' + weather.hourly_forecast[i].icon + '.svg" width="30" />';
            if (weather.hourly_forecast[i].FCTTIME.hour >= noche) {
              // porhoras += '<img src="'+folder_icon+'/nt_' + weather.hourly_forecast[i].icon + '.svg" width="30" />';
              porhoras += '<i class="wicon whoras icon-nt_'+ weather.hourly_forecast[i].icon+'"></i>';
            }
            else if (weather.hourly_forecast[i].FCTTIME.hour <= noche) {
              // porhoras += '<img src="'+folder_icon+'/' + weather.hourly_forecast[i].icon + '.svg" width="30" />';
              porhoras += '<i class="wicon whoras icon-'+ weather.hourly_forecast[i].icon+'"></i>';
            }
              porhoras += '<div class="temp high">'+weather.hourly_forecast[i].temp.metric+'°</div>';
            if (weather.hourly_forecast[i].pop == 0){
              // $('.horahmd').css({display: "none"});
              porhoras += '<div class="temp low">&nbsp;</div>';
            }else {
              porhoras += '<div class="temp low"><i class="icon ion-waterdrop gota"></i> '+weather.hourly_forecast[i].pop+' %</div>';
            }
            porhoras += "</li>";
          document.getElementById("mishoras").innerHTML = porhoras;
            // $('#horas').html(porhoras);
        }
        porhoras += "</ul>";
    

      // forecast.length o poner 5 hasta 10
      // var forecast = data.forecast.simpleforecast.forecastday;
      // var forecast2 = data.forecast.txt_forecast.forecastday;

      var future = "";
      var future_nt = "";

        for (var i = 0; i < forecast.length; i++) {
          future += '<div class="row"><div class="col"><span>' 
          + forecast[i].date.weekday_short + '</span></div><div class="col"><i class="wicon wfore icon-'
          +forecast[i].icon+'"></i></div><div class="col"><span class="temp-high ng-binding">'
          + forecast[i].high.celsius + '°</span><span class="temp-low ng-binding">' 
          + forecast[i].low.celsius + '°</span></div></div>';
        }
        for (var i = 0; i < forecast.length; i++) {
          future_nt += '<div class="row"><div class="col"><span>' 
          + forecast[i].date.weekday_short + '</span></div><div class="col"><i class="wicon wfore icon-nt_'
          +forecast[i].icon+'"></i></div><div class="col"><span class="temp-high ng-binding">'
          + forecast[i].high.celsius + '°</span><span class="temp-low ng-binding">' 
          + forecast[i].low.celsius + '°</span></div></div>';
        }

      if (hora >= noche) {
        $("#five-day").html(future_nt); }
      else {
        $("#five-day").html(future); }


  }
  //fin
});