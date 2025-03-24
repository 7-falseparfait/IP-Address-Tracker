console.log("tinubu");
let map;
async function getIPAPI(ip = "") {
  const APIKEY = "at_B5RrrTE73J93QijRsUh74cbq3vZVX";
  try {
    const response = await fetch(
      ip
        ? `https://geo.ipify.org/api/v2/country,city?apiKey=${APIKEY}&ipAddress=${ip}`
        : `http://ip-api.com/json/`
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (Error) {
    console.error("Error:", Error.message);
  }
}
async function getLocation(ip = "") {
  try {
    const locationData = await getIPAPI(ip);
    console.log(locationData);

    if (!locationData) throw new Error("Failed to Load Location Data");

    let lat, lon, timezone, query, isp, city;
    if (locationData.status === "success") {
      lat = locationData.lat;
      lon = locationData.lon;
      timezone = locationData.timezone;
      query = locationData.query;
      isp = locationData.isp;
      city = locationData.city;
    } else if (locationData.ip) {
      const { ip, location, isp: ISP } = locationData;
      query = ip;
      lat = location.lat;
      lon = location.lng;
      timezone = location.timezone;
      isp = ISP;
      city = location.city;
    }
    const updateData = [timezone, query, isp, city];
    updateCard(updateData);

    if (!map) {
      map = L.map("map", { zoomControl: false }).setView([lat, lon], 28);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    } else {
      map.setView([lat, lon], 28);
    }
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

btn.addEventListener("click", function () {
  console.log("I am working");
  const input = document.getElementById("ip-input");
  const inputValue = input.value;
  getLocation(inputValue);
});
document.addEventListener("DOMContentLoaded", () => getLocation(""));

function updateCard(data) {
  console.log(data);
  console.log(data[1]);

  document.getElementById("ip").textContent = data[1];
  document.getElementById("location").textContent = data[3];
  document.getElementById("timezone").textContent = data[0];
  document.getElementById("isp").textContent = data[2];

  const inputField = document.getElementById("ip-input");
  inputField.value = `${data[1]}`;
}
