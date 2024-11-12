const socket = io();

// Prompt for room name with default value
const username = prompt("Enter Your Name to label in Map:");
const room = prompt("Enter Room Name:('General' by default)", "General");
if (room && username) {
	// Emit the room name and username when the user connects
	socket.emit("join-room", room);
	socket.emit("set-username", username);
}

// Handle location sharing
if (navigator.geolocation) {
	navigator.geolocation.watchPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			// Emit location with username
			socket.emit("send-location", { latitude, longitude, username });
		},
		(error) => {
			console.error(error);
		},
		{
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 5000,
		}
	);
}

// Initialize the map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

// Update markers with username
socket.on("receive-location", (data) => {
	const { id, latitude, longitude, username } = data;
	map.setView([latitude, longitude]);

	if (markers[id]) {
		markers[id].setLatLng([latitude, longitude]);
		markers[id].setPopupContent(username);
	} else {
		markers[id] = L.marker([latitude, longitude]).bindPopup(username).addTo(map);
		markers[id].openPopup();
	}
});

// Update user count display
socket.on("user-count", (count) => {
	console.log("User count received:", count); // Debugging log
	document.getElementById("user-count").innerText = `Connected Users: ${count}`;
});

// Remove marker on user disconnect
socket.on("user-disconnect", (id) => {
	if (markers[id]) {
		map.removeLayer(markers[id]);
		delete markers[id];
	}
});

// Handle incoming chat messages
socket.on("receive-message", (data) => {
	const { username, message } = data;
	const messageElement = document.createElement("div");
	messageElement.textContent = `${username}: ${message}`;
	document.getElementById("messages").appendChild(messageElement);
});

// Handle sending chat messages
const sendMessage = () => {
	const message = document.getElementById("message").value;
	if (message) {
		socket.emit("chat-message", message);
		document.getElementById("message").value = "";
	}
};

// Add event listener for the "Send" button
document.getElementById("send-message").addEventListener("click", sendMessage);

// Add event listener for the Enter key in the message input
document.getElementById("message").addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault(); // Prevent the default action (new line in the input)
		sendMessage(); // Call the function to send the message
	}
});
