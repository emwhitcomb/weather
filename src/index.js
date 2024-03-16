const form = document.getElementById("city-input");
const cityInput = document.getElementById("city");
const unitBtn = document.getElementById("unit-btn");

window.onload = () => {
  const unit = document.getElementById("temp-unit");
  unit.innerHTML = "F";
  pullData('https://api.weatherapi.com/v1/forecast.json?key=989537b87bb849de8ce181346242602&q=Seattle&aqi=no&days=3');
}

unitBtn.addEventListener('click', () => {
  const unit = document.getElementById("temp-unit");
  const location = document.getElementById("location");

  if (unit.innerHTML == "F") {
    unit.innerHTML = "C";
  }
  else {
    unit.innerHTML = "F";
  }

  pullData(`https://api.weatherapi.com/v1/forecast.json?key=989537b87bb849de8ce181346242602&q=${location.textContent}&aqi=no&days=3`);

});

form.addEventListener("submit", (element) => {
  element.preventDefault();
    pullData(`https://api.weatherapi.com/v1/forecast.json?key=989537b87bb849de8ce181346242602&q=${cityInput.value}&aqi=no&days=3`);
  });

async function pullData(url) {
  const unit = getDegreeUnit();
  const response = await fetch(url, {mode: 'cors'});

  if (response.status !== 400) {
    clearData();
    response.json().then(function(response) {
      displayCurrent(response.location, response.current, unit);
      response.forecast.forecastday.forEach((element) => {
        displayForecast(element, unit);
      });
    });
  }
  else {
    alert("City not found!");
  }
}

function clearData() {
  const forecasts = document.getElementById("forecasts");

  while (forecasts.hasChildNodes()) {
    forecasts.removeChild(forecasts.firstChild);
  }
}

function getDegreeUnit() {
  return document.getElementById('temp-unit').innerHTML;
}

function displayCurrent(currentLocation, currentData, unit) {
  let currentTemp;
  let currentIcon;

  document.getElementById("location").innerHTML = currentLocation.name + ", " + currentLocation.region;

  if (unit == "F") {
    document.getElementById("current-temp").innerHTML = currentData.temp_f + "&deg";
  }
  else {
    document.getElementById("current-temp").innerHTML = currentData.temp_c;
  }

  document.getElementById("cond-icon").src = "https:" + currentData.condition.icon;
  document.getElementById("cond-text").innerHTML = currentData.condition.text;
}

function displayForecast(dayData, unit) {
  let highTemp;
  let lowTemp;
  let precip = dayData.day.totalprecip_in;
  let condIcon = "https:" + dayData.day.condition.icon;
  let condText = dayData.day.condition.text;

  if (unit == "F") {
    highTemp = dayData.day.maxtemp_f;
    lowTemp = dayData.day.mintemp_f;
  }
  else {
    highTemp = dayData.day.maxtemp_c;
    lowTemp = dayData.day.mintemp_c;
  }

  const forecasts = document.getElementById("forecasts");

  const dayBox = document.createElement("div");
  dayBox.setAttribute("class", "day-box");

  const boxHeader = document.createElement("span");
  boxHeader.setAttribute("class", "box-header");

  const dataBox = document.createElement("div");
  dataBox.setAttribute("class", "data-box")
  
  forecasts.appendChild(dayBox);
  dayBox.appendChild(boxHeader);
  dayBox.appendChild(dataBox);

  let dateHeader = new Date(dayData.date.replace(/-/g, '\/'));
  let options = {weekday:"short", month:"short", day:"numeric"};

  boxHeader.innerHTML = `
    ${dateHeader.toLocaleDateString("en-us", options)}
  `;
  
  dataBox.innerHTML = `
    <div class="hi-lo-temp">
      <span class="high" id="today-hi">${highTemp}&deg</span>
      <span class="low" id="today-lo">${lowTemp}&deg</span>
    </div>
    <div class="hi-lo-label">
      <span class="high">High</span>
      <span class="low">Low</span>
    </div>
    <div id="precip">
        <span>Precip:&nbsp&nbsp</span>
        <span id="today-precip">${precip}&nbsp in</span>
    </div>
    <img src="${condIcon}" alt="today's condition">
    <span class="cond-text">${condText}</span>
  `;
}