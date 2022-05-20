document.body = document.createElement("body");

//initialize the header block
var headerBlock = document.createElement("section");
headerBlock.setAttribute("id","headerBlock");
document.body.appendChild(headerBlock);

//add the title of header block
var title = document.createElement("h1");
title.appendChild(document.createTextNode("Weather in Hong Kong"));
title.setAttribute("id","title");
headerBlock.appendChild(title);

//set the reload button
var reloadBttn = document.createElement("div");
reloadBttn.setAttribute("id","reloadBttn");
headerBlock.appendChild(reloadBttn);
reloadBttn.innerHTML += "<img src='reload.png' alt='reload button' width='20' height='20' onclick='bttnClick()'>";
function bttnClick(){ //refresh content when the reload button is clicked
  location.reload();
};


//display options
var temperature = document.createElement("div");
temperature.setAttribute("class","tBttn");
temperature.setAttribute("id","tBttn");
temperature.appendChild(document.createTextNode("Temperature"));
var forecast = document.createElement("div");
forecast.setAttribute("class","fBttn");
forecast.setAttribute("id","fBttn");
forecast.appendChild(document.createTextNode("Forecast"));
document.body.appendChild(temperature);
document.body.appendChild(forecast);


fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en")
.then(response => response.json())
.then( response => {
  //set the weather icon
  var link="https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+response.icon[0]+".png";
  document.getElementById("headerBlock").innerHTML+="<img src="+link+" alt='weather icon' width='60' height='60'>";
  
  //set the update time
  var updateTime = document.createElement("div");
  updateTime.setAttribute("id","updateTime");
  headerBlock.appendChild(updateTime);
  updateTime.appendChild(document.createTextNode("Last Update: "+response.updateTime.substr(11,5)));

  //set the temperature
  document.getElementById("headerBlock").innerHTML+="<img src='thermometer.png' alt='thermometer' class='icon' width='20' height='40'>"
  document.getElementById("headerBlock").innerHTML+=response.temperature.data[2].value+"°"+response.temperature.data[1].unit;

  //set the humidity
  document.getElementById("headerBlock").innerHTML+="<img src='drop.png' alt='drop' class='icon' width='20' height='30'>"
  document.getElementById("headerBlock").innerHTML+=response.humidity.data[0].value+"%";

  //set the rainfall data
  document.getElementById("headerBlock").innerHTML+="<img src='rain.png' alt='rain' class='icon' width='30' height='30'>"
  document.getElementById("headerBlock").innerHTML+=response.rainfall.data[13].max+"mm";

  //set the UV level
  if (response.uvindex){
    document.getElementById("headerBlock").innerHTML+="<span class='phone'>";
    document.getElementById("headerBlock").innerHTML+="<img src='UVindex.png' alt='UVindex' class='icon' width='30' height='30'>";
    document.getElementById("headerBlock").innerHTML+=response.uvindex.data[0].value;
    document.getElementById("headerBlock").innerHTML+="</span>";
  }

  //space separate warning and icons
  document.getElementById("headerBlock").innerHTML+="<p></p>";

  //set the warning
  if (response.warningMessage[0]){
    var warning = document.createElement("details");
    warning.setAttribute("id","warning");
    var summary = document.createElement("summary");
    summary.appendChild(document.createTextNode("Warning"));
    document.getElementById("headerBlock").appendChild(warning);
    warning.appendChild(summary);
    warning.innerHTML+="<p>"+response.warningMessage[0]+"</p>";
  }

    //display block
    var block = document.createElement("div");
    block.setAttribute("id","displayBlock");
    document.body.appendChild(block);

    //when temperature is chosen
    function tClicked(){
      document.getElementById("displayBlock").innerHTML = ""; //clear all data in display area
      temperature.setAttribute("class","tBttnClicked"); //switch the white-background in the options
      forecast.setAttribute("class","fBttn");

      for (var i=0; i < response.temperature.data.length ; i++){
        var tBlock = document.createElement("div");
        tBlock.setAttribute("class","tBlock");
        tBlock.innerHTML += "<p>"+response.temperature.data[i].place+"</p>";
        tBlock.innerHTML += "<p>"+response.temperature.data[i].value+"°"+response.temperature.data[i].unit+"</p>";

        //set the close button
        tBlock.innerHTML += "<img src='cancel.ico' alt='cancelBttn' class='cancelBttn' width='1' height='1' >";
        function cancel(){
          this.parentNode.remove();
        }
        document.getElementById("displayBlock").appendChild(tBlock); 

        var cancelBttn = document.getElementsByClassName('cancelBttn');
        for (var j=0; j< cancelBttn.length;j++){
          cancelBttn[j].addEventListener('click',cancel);  
        }
      }
    }
    //default show the temperature
    tClicked();
    temperature.addEventListener("click" , tClicked);
})
.catch( err => {
  console.log("Fetch Error!");
  console.log(err);
});



fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en")
.then(response => response.json())
.then(response => {
    //when forecast is chosen
    function fClicked(){
      document.getElementById("displayBlock").innerHTML = ""; //clear all data in display area
      document.getElementById("tBttn").setAttribute("class","tBttn");//switch the white-background in the options
      document.getElementById("fBttn").setAttribute("class","fBttnClicked");

      //set the forecast blocks
      for (var i=0; i<9 ; i++){
        var fBlock = document.createElement("div");
        fBlock.setAttribute("class","fBlock");

        //set the weather icon
        var link="https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+response.weatherForecast[i].ForecastIcon+".png";
        fBlock.innerHTML+="<img src="+link+" alt='weather icon' width='60' height='60'>";

        //forcast date
        fBlock.innerHTML += "<p>"+response.weatherForecast[i].forecastDate.substr(6)+"/"+response.weatherForecast[i].forecastDate.substr(4,2)+"</p>";

        //forecast week
        fBlock.innerHTML += "<p>"+response.weatherForecast[i].week+"</p>";

        //break line
        fBlock.innerHTML += "<p>------------------</p>";

        //forecast temperature
        fBlock.innerHTML += "<p>"+response.weatherForecast[i].forecastMintemp.value+"°"+response.weatherForecast[i].forecastMintemp.unit+" | "+response.weatherForecast[i].forecastMaxtemp.value+"°"+response.weatherForecast[i].forecastMaxtemp.unit+"</p>";

        //forecast humidity
        fBlock.innerHTML += "<p>"+response.weatherForecast[i].forecastMinrh.value+"%"+" - "+response.weatherForecast[i].forecastMaxrh.value+"%"+"</p>";

        document.getElementById("displayBlock").appendChild(fBlock); 
      }
    }
    document.getElementById("fBttn").addEventListener("click" , fClicked);
})
.catch( err => {
  console.log("Fetch Error!");
  console.log(err);
});

