
let map = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},


	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 0,
		});
		
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
	
		let marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p><b>You are currently here</b></p>')
		.openPopup()
	},

	addMarkers() {
		for (let i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p>${this.businesses[i].name}</p>`)
			.addTo(this.map)
		}
	},
}


async function getCoordinates(){
	let pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

async function getMarkers(business) {
	const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3MLT9yZTjFM5PAhgzq/zTeA0llXPBge409A4V+SW1/KA='
        }
      };
      let limit = 5
    let lat = map.coordinates[0]
    let lon = map.coordinates[1]
    let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
	return businesses
    
}



function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}


window.onload = async () => {
	let coords = await getCoordinates()
	map.coordinates = coords
	map.buildMap()
}


document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getMarkers(business)
	map.businesses = processBusinesses(data)
	map.addMarkers()
})