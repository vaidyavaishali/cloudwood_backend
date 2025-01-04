const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"],
  },
});

let globalState = {
  bedroom: { light1: false, light2: false },
  kitchen: { light1: false, light2: false },
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send initial state to the client
  socket.emit("stateUpdate", globalState);

  // Listen for state changes from a client
  socket.on("updateState", (newState) => {
    globalState = { ...globalState, ...newState };
    io.emit("stateUpdate", globalState); // Broadcast updated state to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("WebSocket server running on port 4000");
});
