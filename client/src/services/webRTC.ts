import { Socket as SocketIOClient } from "socket.io-client";

export class WebRTCService {
  private peerConnection: RTCPeerConnection;
  private socket: typeof SocketIOClient;
  private localStream: MediaStream | null = null;
  private targetUserId: string | null = null;

  constructor(socket: typeof SocketIOClient) {
    this.socket = socket;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun5.l.google.com:19302" },
        { urls: "stun:stun6.l.google.com:19302" },
        { urls: "stun:stun7.l.google.com:19302" },
        { urls: "stun:stun8.l.google.com:19302" },
        { urls: "stun:stun9.l.google.com:19302" },
        { urls: "stun:stun10.l.google.com:19302" },
        {
          urls: "turn:YOUR_TURN_SERVER",
          username: "YOUR_USERNAME",
          credential: "YOUR_PASSWORD",
        },
      ],
      iceCandidatePoolSize: 10,
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.targetUserId) {
        this.socket.emit("ice-candidate", {
          candidate: event.candidate,
          target: this.targetUserId,
        });
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(
        "ICE Connection State:",
        this.peerConnection.iceConnectionState
      );
    };
  }

  async getUserMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return this.localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }

  async createOffer(targetUserId: string) {
    try {
      this.targetUserId = targetUserId;
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit("offer", {
        target: targetUserId,
        sdp: offer,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit, callerId: string) {
    try {
      this.targetUserId = callerId;
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit("answer", {
        target: callerId,
        sdp: answer,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Error handling answer:", error);
      throw error;
    }
  }

  handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
      throw error;
    }
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    this.peerConnection.close();
  }

  public addTrack(track: MediaStreamTrack, stream: MediaStream): Promise<void> {
    return new Promise((resolve) => {
      this.peerConnection.addTrack(track, stream);
      resolve();
    });
  }

  public setOnTrack(handler: (event: RTCTrackEvent) => void) {
    this.peerConnection.ontrack = handler;
  }
}
