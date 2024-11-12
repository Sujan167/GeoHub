# GeoHub: Real-Time Location Sharing & Chat

GeoHub is a real-time location sharing and chat application that allows users to share their location with others within groups. It utilizes **Node.js** for the backend, **WebSockets** for real-time communication, and **Leaflet.js** for interactive map visualizations. This platform allows users to interact, share their locations, and chat with others in real time.

## Features

- **Real-Time Location Sharing**: Users can share their current location on the map, and it will update for all participants in the group in real-time.
- **Group Chat**: A chat system where users can communicate with others in the same group.
- **Interactive Map**: Uses **Leaflet.js** to display users' locations and map markers dynamically.
- **WebSocket Communication**: Enables seamless real-time updates for location sharing and chat messages.
- **Group Management**: Users can create and join different groups for collaboration.

## Tech Stack

- **Node.js** with **Express.js**
- **WebSockets** (via `socket.io`) for real-time communication
- **Geolocation API** for retrieving users' locations

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (or **yarn**)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Sujan167/GeoHub.git
cd GeoHub
```
### 2. Backend Setup
```bash
npm install
```
### 3. Start the server:
```bash
npm run dev
```

# License
This project is licensed under the MIT License - see the LICENSE file for details.

