import { Socket as SocketIOClient } from "socket.io-client";
import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

class SocketService {
  private static instance: typeof SocketIOClient;

  public static getInstance(): typeof SocketIOClient {
    if (!SocketService.instance) {
      SocketService.instance = io(BACKEND_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });
    }
    return SocketService.instance;
  }
}

export default SocketService;
