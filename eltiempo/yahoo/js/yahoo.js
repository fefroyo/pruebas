$(document).ready(function () {

$('#basic-modal').click(function() {
$('#mimodal1').css({display: 'block'}); });
$('#basic-modal2').click(function() {
$('#mimodal2').css({display: 'block'}); });
$('.modalclose').click(function() {
$('.mimodal').css({display: 'none'}); });

var autocomplete = new google.maps.places.Autocomplete(/** @type {HTMLInputElement} */
(document.getElementById('autocomplete')),
                  { types: ['geocode'] });
google.maps.event.addListener(autocomplete, 'place_changed', function () { });

// cambiar temp C/F
$(document).on('change', function (e) {
  e.preventDefault();
  unid = $('input[name="options"]:checked').val();
  localStorage.setItem('unidsel', unid);
  var tempunit = localStorage.getItem('unidsel');
  getweather(localStorage.getItem('selectedolditem'), tempunit);
});
// var tempunit = $('#units_metric').attr('checked', 'checked');

// function change() {
//     if (tempunit == 'f') {
//         tempunit = 'c';
//     } else if (tempunit == 'c') {
//         tempunit = 'f';
//     }getweather();
// }
// $('.degree-btn').on('click', function () {
//     change();
// });
// fin cambiar temp

// geonavigation_______________
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    getweather(position.coords.latitude+','+position.coords.longitude); 
  });
    // $('#mimodal1').css({display: 'block'});
}else {
  $("#weather").html("Geolocation is not supported by this browser.");
}
$('#geobutton').on('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    getweather(position.coords.latitude+','+position.coords.longitude); 
  });
  }else {
      $("#weather").html("Geolocation is not supported by this browser.");
  }
});

// $(".page-container").css("margin-top", ($(window).height() - $(".todaysData").height()));  
  $('#awxSearchButton').click(function (e) {
      var location = $('#autocomplete').val();
      if (location != "") {
          getweather(location);
      }
  });

getweather(localStorage.getItem('selectedolditem'));
});// fin

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
// fin add lista
// seleccion de add lista
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

$(document).on('click', '#side-bar a', function (e) {
    e.preventDefault();
    var ciu = $(this).data('city');
    localStorage.setItem("selectedolditem", ciu);
    getweather(ciu,'');
});
// fin seleccionar de la lista


var codes = new Array();
codes[0] = "tornado"; //"tornado"
codes[1] = "tormenta tropical"; //"tropical storm"
codes[2] = "huracan"; //"hurricane"
codes[3] = "severas tormentas electricas"; //"severe thunderstorms"
codes[4] = "tormentas electricas"; //"thunderstorms"
codes[5] = "lluvia y nieve"; //"mixed rain and snow"
codes[6] = "lluvia y aguanieve"; //"mixed rain and sleet"
codes[7] = "nieve y aguanieve"; //"mixed snow and sleet"
codes[8] = "llovizna helada"; //"freezing drizzle"
codes[9] = "llovizna"; //"drizzle"
codes[10] = "lluvia helada"; //"freezing rain"
codes[11] = "chaparrones"; //"showers"
codes[12] = "chaparron"; //"showers"
codes[13] = "copos de nieve"; //"snow flurries"
codes[14] = "chaparron nieve ligera"; //"light snow showers"
codes[15] = "soplo de nieve"; // "blowing snow"
codes[16] = "nevado"; //"snow"
codes[17] = "granizos"; //"hail"
codes[18] = "aguanieve"; //"sleet"
codes[19] = "polvoriento"; //"dust"
codes[20] = "neblina"; //"foggy"
codes[21] = "bruma"; //"haze"
codes[22] = "humareda"; //"smoky"
codes[23] = "ventoso"; //"blustery"
codes[24] = "viento"; //"windy"
codes[25] = "frio"; //"cold"
codes[26] = "nublado"; //"cloudy"
codes[27] = "mayormente nublado"; //"mostly cloudy (night)"
codes[28] = "mayormente nublado"; //"mostly cloudy (day)"
codes[29] = "parcialmente nublado"; //"partly cloudy (night)"
codes[30] = "parcialmente nublado"; //"partly cloudy (day)"
codes[31] = "despejado"; //"clear (night)"
codes[32] = "soleado"; //"sunny"
codes[33] = "despejado"; //"fair (night)"
codes[34] = "despejado"; //"fair (day)"
codes[35] = "lluvia y granizos"; //"mixed rain and hail"
codes[36] = "caluroso"; //"hot"
codes[37] = "tomentas electricas aisladas"; //"isolated thunderstorms"
codes[38] = "tormentas dispersas"; //"scattered thunderstorms"
codes[39] = "tormentas dispersas"; //"scattered thunderstorms"
codes[40] = "chaparrones dispersas"; //"scattered showers"
codes[41] = "fuerte nevada"; //"heavy snow"
codes[42] = "chaparron nieve dispersas"; //"scattered snow showers"
codes[43] = "fuerte nevada"; //"heavy snow"
codes[44] = "parcialmente nublado"; //"partly cloudy"
codes[45] = "tormenta lloviznas"; //"thundershowers"
codes[46] = "llovizna nieve"; //"snow showers"
codes[47] = "tomentas aisladas"; //"isolated thundershowers"
codes[3200] = "no disponible"; //"not available"

var getweather = function (locationCode, tempunit) {

var tempunit = localStorage.getItem('unidsel');
  
$.simpleWeather({
  zipcode: '',
  woeid: '', //2357536
  location: locationCode,
  unit: tempunit,
success: function (weather) {
  
  $("#weather_description").html(weather.city);
  $('#accuicon').addClass('yahoo-'+weather.code);
  
  var curentupdate = moment(weather.updated, "ddd, DD MMM YYYY h:mm A").locale('es');
  var actual = moment(curentupdate).format("dddd H:mm"); //.format(" H:mm")
  var actualahora = moment(curentupdate).fromNow();
  $("#fechita").html('Actualizado: '+actualahora); //moment(actual).fromNow()
  
  // var current = '<li><i class="my icon-' + weather.code + '"></i><span class="title">' + weather.currently + '</span></li>'
  // current += '<li><i class="fa fa-long-arrow-up"></i><span class="hightemp">' + weather.high + '&deg</span>'
  // current += '<i class="fa fa-long-arrow-down"></i><span class="lowtemp">' + weather.low + '&deg</span></li>'
  // current += '<li><h2>' + weather.temp + '&deg</h2></li>';
  // $(".todaysData ul").html(current);
  // $('#condicion').html((weather.currently).toUpperCase());
  $('#condicion').html((codes[weather.code]).toUpperCase());
  $('#temperatura').html(weather.temp);
  $('#temp-lo-t').html(Math.round(weather.low));
  $('#temp-hi-t').html(Math.round(weather.high));

  
  var forecast = '';
  for (item in weather.forecast) {

var diasem = moment(weather.forecast[item].day, "ddd").locale('es');
var diasem1 = moment(diasem).format("dddd").toUpperCase(); //.format(" H:mm")

      forecast += '<li class="row">';
      forecast += '<div class="col"><span>' + diasem1 + '</span></div>';
      forecast += '<div class="col"><i class="wicon wfore yahoo-' + weather.forecast[item].code + '"></i></div><div class="col">';
      forecast += '<span class="temp-high">' + weather.forecast[item].high + '°</span>';
      forecast += '<span class="temp-low">' + weather.forecast[item].low + '°</span>';
      forecast += '</div></li>';
  }

  var today = '<tr><td rowspan="6" style="text-align: center; border:0;vertical-align: middle;"><i class="wicon wfore icon-luna" id="laluna"></i>';
  today += '<span class="luna_ilum">80%</span><br/><span class="faseluna">gibosa</span></td><td></td></tr>';
  today += '<tr><td class="row2"><span class="coleft">Sensación:</span><span class="colright">' + weather.temp + '&deg;' + weather.units['temp'] + '</span></td></tr>';
  today += '<tr><td class="row2"><span class="coleft">Humedad:</span><span class="colright">' + weather.humidity + ' ' + '%</span></td></tr>';
  today += '<tr><td class="row2"><span class="coleft">Visibilidad:</span><span class="colright">' + weather.visibility + ' ' + weather.units['distance'] + '</span></td></tr>';
  today += '<tr><td class="row2"><span class="coleft">Viento</span><span class="colright">' + weather.wind['speed'] + ' ' + weather.units['speed'] + '</span></td></tr>';

  $(".fiveday").html(forecast);
  $(".todayInDetails").html(today);
  $('#autocomplete').val("");

  // fase luna
  var language = 'es';

  $.getJSON( "http://www.wdisseny.com/lluna/api/?lang="+language+"&month=5&year=2016&size=50&lightColor=currentColor&shadeColor=black&sizeQuarter=20&texturize=true&LDZ=1462053600&", function(moon) {
  var day = new Date().getDate();
  $(".icon-luna").html(moon.phase[day].svg);
  $(".luna_ilum").html(Math.round(moon.phase[day].lighting)+'%');
  $(".faseluna").html(moon.phase[day].phaseName);
  });// fin luna

  $('#sol').html('<i class="wicon wfore icon-sunrise"></i> '
    +weather.sunrise+' <i class="wicon wfore icon-sunset"></i> '
    +weather.sunset);

  // Assign background image links to variables
  // var sunnyImg  = "http://u.kanobu.ru/comments/images/92025b04-c980-46da-8859-66f64c997468.jpg";
  // var rainyImg  = "http://webneel.com/wallpaper/sites/default/files/images/04-2013/cute-rain-in-mirror.jpg";
  // var cloudyImg   = "http://p1.pichost.me/i/31/1542826.jpg";
  // var snowyImg  = "https://wallpaperscraft.com/image/snow_white_background_surface_79574_2560x1440.jpg";
  // var clearImg_n  = "http://images.summitpost.org/original/472297.jpg";
  // var cloudyImg_n = "https://c1.staticflickr.com/1/92/211605391_782caa152f_b.jpg";

  //     function changeBgImg(linkToImg) {
  //       return $('body').css('background-image', 'url(' + linkToImg + ')');
  //     }
  //     // Set background images
  //     var c = parseInt(weather.code);
  //     switch(true) {
  //       // Rainy
  //       case (c >= 0 && c <= 12 || c === 35 || c >= 37 && c <= 40 || c >= 45 && c <= 47):
  //         changeBgImg(rainyImg);
  //         break;
  //       // Sunny
  //       case (c === 19 || c === 21 || c === 22 || c === 32 || c === 34 || c === 36):
  //         changeBgImg(sunnyImg);
  //         break;
  //       // Cloudy
  //       case (c === 20 || c >= 23 && c <= 26 || c === 28 || c === 30):
  //         changeBgImg(cloudyImg);
  //         break;
  //       // Snow

  //       case (c >= 13 && c <= 18 || c === 41 || c === 42 || c === 46):
  //         changeBgImg(snowyImg);
  //         break;
  //       // Cloudy (night)
  //       case (c === 27 || c === 29):
  //         changeBgImg(cloudyImg_n);
  //         break;
  //       // Clear (night)
  //       case (c === 31 || c === 33):
  //         changeBgImg(clearImg_n);
  //         break;
  //       default:
  //         changeBgImg('http://www.imgbase.info/images/safe-wallpapers/animals/cat/37493_cat_kitten_orange_kitten.jpg');
  //         break;
  //     };
      // fin imagenes tiempo
      
            },
            error: function (error) {
                $("#weather").html('<p>' + error + '</p>');
            }
        });
};
// var setbackground = function populate() {
//   var tag = document.getElementById('tag').value;
//   document.getElementById('photos').innerHTML = getFlickr.html[tag].replace(/_m\.jpg/g, '_s.jpg');
//   document.getElementById('tags').innerHTML = getFlickr.tags[tag];
//   return false;
// }
