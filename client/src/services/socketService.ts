import { io, Socket } from "socket.io-client";

class SocketService {
  private static instance: Socket;

  public static getInstance(): Socket {
    if (!SocketService.instance) {
      SocketService.instance = io("http://localhost:3000", {
        transports: ["websocket"],
        autoConnect: true,
      });
    }
    return SocketService.instance;
  }
}

export default SocketService;
