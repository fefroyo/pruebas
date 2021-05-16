jQuery(document).ready(function($) {

$('#basic-modal').click(function() {
$('#mimodal1').css({display: 'block'});
});
$('#basic-modal2').click(function() {
$('#mimodal2').css({display: 'block'});
});
$('.modalclose').click(function() {
$('.mimodal').css({display: 'none'});
});

// &appid=b231606340553d9174136f7f083904b3 - aa564a517a79807e618aa1b3843c2a26
// 0596fe0573fa9daa94c2912e5e383ed3 - 87a3ac98e2e48918db144e9f69eeb057
// 2177df799b4d263ad5446bc242c3d7ff
var appid ="f9dbd911bc01df1d9ce563b2ba4d3209";
// var idioma = $select.options[select.selectedIndex].value;
// var unidades = $('input[name="options"]:checked').val(); // metric - imperial
// $('input[name="options"]:checked').val();

$('#buscalocal2').click(function () {
    var ciu1 = $('#autocomplete').val();
    localStorage.setItem("selectedolditem", ciu1);
    if (location != "") {
        getWeather();
    }  
});
$("#autocomplete").keyup(function() {
    getAutoCompleteValues($("#autocomplete").val());
});

// __opciones idioma__________________
var select = document.querySelector("#states");
var selectOption = select.options[select.selectedIndex];
var lastSelected = localStorage.getItem('select');
if(lastSelected) { select.value = lastSelected; }

$(document).on('change', "#states", function (e) {
  e.preventDefault();
  lastSelected = select.options[select.selectedIndex].value;
  localStorage.setItem('select', lastSelected);
  getWeather();
});

$(document).on('change', function (e) {
  e.preventDefault();
  unid = $('input[name="options"]:checked').val();
  localStorage.setItem('unidsel', unid);
  getWeather();
});

var idioma = localStorage.getItem('select');
var unidades = $('#units_metric').attr('checked', 'checked');

// Fahrenheit-Celsius switches
// $(document).on('click', '#f', function (e) {
//     e.preventDefault();
//     var $this = $(this);
//     var fa = $this.data('unit');
// 	$('#c').removeClass("selected");
// 	$this.addClass("selected");
//     localStorage.setItem("uni", fa);
//     getWeather();
// });
// $(document).on('click', '#c', function (e) {
//     e.preventDefault();
//     var $this = $(this);
//     var ce = $this.data('unit');
// 	$('#f').removeClass("selected");
// 	$this.addClass("selected");
//     localStorage.setItem("uni", ce);
//     getWeather();
// });

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
    getWeather();
});

// geonavigation_______________
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocation);
    $('#mimodal1').css({display: 'block'});
}else {
  $("#weather").html("Geolocation is not supported by this browser.");
}
$('#geobutton').on('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocation);
  }else {
      $("#weather").html("Geolocation is not supported by this browser.");
  }
});

function getAutoCompleteValues(val) {
  // accuweather api key
  var appkey = "ff1b463d98fb47af848ea2843ec5c925";

  $.ajax({
    url: "http://apidev.accuweather.com/locations/v1/cities/autocomplete?apikey="+ appkey +"&q=" + val,
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
        $("#results").append('<li class="searchterm">'+ item.LocalizedName + ", " + item.Country.ID +'</li>');   
      });
      $("li.searchterm").click(function() { 
          $(".location").val($(this).text());
          $("#results").html('');
          $("#results").removeClass('result');
        });
     }
    }
  });
}

//  GPS
function getLocation(position) {
   lat = position.coords.latitude;
   lon = position.coords.longitude;
   var idioma = localStorage.getItem('select');
   var unidades = localStorage.getItem('unidsel');
   // var unidades = $('input[name="options"]:checked').val(); // metric - imperial
    
   apiurl = 'http://api.openweathermap.org/data/2.5/weather?lat=' +lat+ '&lon=' + lon + '&lang='
        +idioma+'&units='+unidades+'&appid='+appid;
    
    $.ajax({
      url : apiurl,
      method : 'GET',
      success : infoweather,
    });
}
// current weather
function getWeather() {
  // var local = $('#autocomplete').val();
  var local = localStorage.getItem('selectedolditem');
  var idioma = localStorage.getItem('select');
  var unidades = localStorage.getItem('unidsel');
  // var unidades = localStorage.getItem("uni");
  // metric - imperial
  console.log(unidades);

  apiurl = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' +local+ '&lang='
        +idioma+'&units='+unidades+'&cnt=9&appid='+appid;
  apiurl2 = 'http://api.openweathermap.org/data/2.5/weather?q=' +local+ '&lang='
        +idioma+'&units='+unidades+'&appid='+appid;

    $.ajax({
      url : apiurl2,
      method : 'GET',
      success : infoweather,
    });
    $.ajax({
      url : apiurl,
      method : 'GET',
      success : foreweather,
    });

}getWeather();

var folder = "icons/shut";

// http://openweathermap.org/img/w/10d.png
function infoweather(data){


  // cambia el color de fondo depende del tiempo
  // var weatherIcon = data.weather[0].icon;
  // var daynight, color;
  // if (weatherIcon[2] === 'n') {
  //   daynight = 'night';
  //   color = '#0D47A1';
  // } else {
  //   daynight = 'day';
  //   color = '#64B5F6';
  // }
  // $('body').css({
  //   'backgroundColor': color,
  //   'color': color
  // });

  var localidad = data.name+', '+data.sys.country;
  var condicion = data.weather[0].description;
  // var icono = '<img src="'+folder+'/'+data.weather[0].icon+'.png" width="150"/>';
  // var icofon ='<i class="owf owfcurrent owf-'+data.weather[0].id+'"></i>';
  var icofon ='<i class="wicon icon-'+data.weather[0].icon+'" style="font-size: 100px;"></i>';
  var tempe = Math.round(data.main.temp);

  console.log(data.weather[0].id);

// $('#sensa').html(weather['current_observation']['feelslike_c']);

  $('#city').html(localidad);
  $('#condicion').html(condicion.toUpperCase());
  // $('#img2').html(icono);
  $('#img2').html(icofon);
	$('#current-temp').html(tempe);
  $('#humedad').html(data.main.humidity);
  $('#viento').html(data.wind.speed);
  $('#presion').html(data.main.pressure);
  $('#temp-lo-t').html(Math.round(data.main.temp_min));
  $('#temp-hi-t').html(Math.round(data.main.temp_max));
  // $('#precip').html(data.precipitation);

// luna
$.getJSON( "http://www.wdisseny.com/lluna/api/?lang="+localStorage.getItem('select')
  +"&month=5&year=2016&size=50&lightColor=currentColor&shadeColor=black&sizeQuarter=20&texturize=true&LDZ=1462053600&", function(moon) {

  var day = new Date().getDate();
  var dayWeek=moon.phase[day].dayWeek;
  var iconluna = moon.phase[day].svg;
  // console.log(iconluna);

  // html="<div>"+moon.phase[day].phaseName + " "+ Math.round(moon.phase[day].lighting)+"%</div>";
  $("#laluna").html(iconluna);
  $("#faseluna").html(moon.phase[day].phaseName);
  // document.getElementById("ex1").innerHTML = html;
});// fin luna

sunrise = moment.unix(data.sys.sunrise);
sunset = moment.unix(data.sys.sunset);
actual = moment.unix(data.dt);

console.log(data.dt);

$("#sol").html('Salida sol: '+sunrise.format("HH:mm") +' Puesta sol:'+ sunset.format("HH:mm"));
$("#fechita").html('Actualizado a: '+ actual.format(" HH:mm"));

var wall = data.weather[0].icon;

// console.log(wall);

// var wind = data.wind.speed;
// $('#city-wind-direction').css("transform", "rotate(" + wind + 180 + "deg)");

  var images = {
    clear: "./img/1.jpg",
    cloudy: "./img/2.jpg",
    lluvia: "./img/3.jpg",
    tormenta: "./img/4.jpg",
  
  }
  // cambia el color de fondo depende temperatura
  // if (wall === '01d') { 
  //   return $("body").css('background-image', 'url(' + images.clear + ')')}
  // else if (wall === '02d' || wall === '02n' || wall === '03d' || wall === '03n') {
  //   return $("body").css('background-image', 'url(' + images.cloudy + ')')}
  // else if (wall === '04d' || wall === '04n') {
  //   return $("body").css('background-image', 'url(' + images.cloudy + ')')}
  // else if (wall === '09d' || wall === '09n' || wall === '10d' || wall === '10n') {
  //   return $("body").css('background-image', 'url(' + images.tormenta + ')')}
}
function foreweather(dataf){

  // var diasemana = dataf.list[0].weather[0].main;
  // var ftempMax = Math.round(dataf.list[0].temp.max)+'°';
  // var ftempMin = Math.round(dataf.list[0].temp.min)+'°';
  // var weatherImg = '<img src="tick-open/' + data.list[0].weather[0].icon + '.png"/>';

$('#precip').html(dataf.list[0].clouds);

// $('#ftemp').html(ftempMax+' '+ftempMin);
// var fecha = new Date();
// var fechadias = fecha.getDay();
// var misdias = dsemana[fechadias];

  //forecast //dataf.list.length
var porhoras = "<ul>";
  for (i = 0; i < dataf.list.length; i++) { 

  var dayCode = moment.unix(dataf.list[i].dt).locale(localStorage.getItem('select'));
  var miday2 = dayCode.format("dddd").toUpperCase();

    porhoras += '<li class="row">';
    porhoras += '<div class="col"><span>'+miday2+'</span></div><div class="col">';
    // porhoras += '<img src="'+folder+'/' + dataf.list[i].weather[0].icon + '.png" width="50" />';
    // porhoras += '<i class="owf owffore owf-'+dataf.list[i].weather[0].id+'"></i>';
    porhoras += '<i class="wicon wfore icon-'+dataf.list[i].weather[0].icon+'"></i>';
    porhoras += '</div><div class="col">';
    porhoras += '<span class="temp-high">'+Math.round(dataf.list[i].temp.max)+'°</span>';
    porhoras += '<span class="temp-low">'+Math.round(dataf.list[i].temp.min)+'°</span>';
    // porhoras += Math.round(dataf.list[i].temp.min)+'°' + Math.round(dataf.list[i].temp.max)+'°';
    porhoras += "</div></li>";

    document.getElementById("five-day").innerHTML = porhoras; 
  }
  porhoras += "</ul>";
  
}

// for (var i = 1; i < dataf.list.length; i++) {
//   dayCode = moment.unix(dataf.list[i].dt).locale(idioma);
//   $("#daysOfWeek").append(dayCode.format("ddd") + "<br>");
// }


$("#refreshButton").click(function() {
    location = self.location;
});
//fin
});

