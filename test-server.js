const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let Clients = [];

function message(content) {
  return JSON.stringify({
    route: 'message',
    data: content
  });
}

wss.on('connection', function connection(ws, req) {
  let url = new URL(`ws://localhost${req.url}`);

  let ID = url.searchParams.get('ID');

  let platform = url.searchParams.get('platform');
  if (!ID || !platform) {
    ws.send(message('Please include both ID and platform in url searchParams'));
    ws.close();
    return;
  }

  Clients.push({
    ID: ID,
    platform: platform,
    ws: ws
  });

  console.log(Clients);

  ws.on('message', function incoming(data) {
    console.log(data);
    Clients.forEach(client => {
      if (client.platform === 'ASS') {
        if (client.ws.readyState === WebSocket.OPEN) {
          console.log(data);
          client.ws.send(data);
        }
      }
    });
  });
});
