import { Socket as SocketIOClient } from "socket.io-client";
import io from "socket.io-client";

class SocketService {
  private static instance: typeof SocketIOClient;

  public static getInstance(): typeof SocketIOClient {
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
