import EventEmitter from 'events';
import WebSocket from 'ws';
import uuid from 'uuid';
import psList from 'ps-list';
// import cp from 'child-process-promise';

export enum AssRouteType {
  Task,
  APP
}

export interface AssData {
  content: string;
}

export interface ASSMessage {
  route: AssRouteType;
  data: AssData;
}

const ExtendScript = {
  win32:
    'powershell -command "$app = new-object -comobject {app}.Application; $app.BringToFront; $script = \'{script}\'; $args = {args};  $app.DoJavaScriptFile($script,$args,1)"',
  darwin:
    'osascript -e \'tell application id "com.adobe.{app}" to activate do javascript file "{script}"\''
};

//{"route": 0, "data": {"content": "123"}}
export default class ASS extends EventEmitter {
  OnSocketMessage(msg: WebSocket.Data): void {
    let data: ASSMessage;
    try {
      data = JSON.parse(msg.toString()) as ASSMessage;
    } catch (e) {
      console.log(e);
      return;
    }
    console.log(data.route);
    console.log(AssRouteType.Task);
    switch (data.route) {
      case AssRouteType.Task: {
        this.OnTaskArrive(data.data);
        break;
      }
      default:
        break;
    }
  }

  OnTaskArrive(data: AssData): void {
    console.log(data);
  }

  OnSocketOpen(): void {
    console.log('open');
  }

  OnSocketError(err: Error): void {
    console.log(err);
  }

  private socket: WebSocket;
  private readonly port: number;
  private readonly ID: string;

  constructor(port: number) {
    super();
    this.port = port;
    this.ID = uuid.v1();
    this.socket = new WebSocket(
      `ws://localhost:${this.port}/?platform=ASS&ID=${this.ID}`
    );
    this.socket.on('open', () => this.OnSocketOpen());
    this.socket.on('error', err => this.OnSocketError(err));
    this.socket.on('message', msg => this.OnSocketMessage(msg));
  }
}
