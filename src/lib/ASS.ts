import EventEmitter from 'events';
import WebSocket from 'ws';

export default class ASS extends EventEmitter {
  OnSocketError(err: Error): void {
    console.log(err);
  }
  OnSocketMessage(msg: WebSocket.Data): void {
    console.log(msg);
  }
  OnSocketOpen(): void {
    console.log('open');
  }

  private readonly socket: WebSocket;

  constructor(port: number) {
    super();
    this.socket = new WebSocket(`ws://localhost:${port}`);
    this.socket.on('open', () => this.OnSocketOpen());
    this.socket.on('error', err => this.OnSocketError(err));
    this.socket.on('message', msg => this.OnSocketMessage(msg));
  }
}
