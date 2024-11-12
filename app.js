const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);

const io = socketio(server);

app.set("view engine", "ejs");
app.use((req, res, next) => {
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");
	next();
});

app.use(express.static(path.join(__dirname, "public")));

const users = {}; // Object to keep track of connected users and their rooms

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	// Add new user
	users[socket.id] = { socketId: socket.id, username: "", room: "" };

	// Notify all clients of the new user count
	io.emit("user-count", Object.keys(users).length);

	// Handle joining a room
	socket.on("join-room", (room) => {
		const previousRoom = users[socket.id].room;
		if (previousRoom) {
			socket.leave(previousRoom);
		}
		users[socket.id].room = room;
		socket.join(room);
		console.log(`User ${socket.id} joined room ${room}`);
		io.to(room).emit(
			"user-list",
			Object.values(users)
				.filter((user) => user.room === room)
				.map((user) => user.username)
		);
	});

	// Handle setting username
	socket.on("set-username", (username) => {
		users[socket.id].username = username;
		const room = users[socket.id].room;
		io.to(room).emit(
			"user-list",
			Object.values(users)
				.filter((user) => user.room === room)
				.map((user) => user.username)
		);
	});

	// Handle location data
	socket.on("send-location", (data) => {
		const room = users[socket.id].room;
		io.to(room).emit("receive-location", { id: socket.id, ...data });
	});

	// Handle chat messages
	socket.on("chat-message", (message) => {
		const room = users[socket.id].room;
		const username = users[socket.id] ? users[socket.id].username : "Anonymous";
		console.log({ username, message });
		io.to(room).emit("receive-message", { username, message });
	});

	// Notify all clients of the new user count on disconnect
	socket.on("disconnect", () => {
		const room = users[socket.id].room;
		delete users[socket.id];
		io.emit("user-count", Object.keys(users).length);
		io.to(room).emit("user-disconnect", socket.id);
		io.to(room).emit(
			"user-list",
			Object.values(users)
				.filter((user) => user.room === room)
				.map((user) => user.username)
		);
	});
});

app.get("/", (req, res) => {
	res.render("index");
});

server.listen(3000, () => {
	console.log("Server is running on port 3000");
});
