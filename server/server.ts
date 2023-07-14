import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { parseController } from './parseController';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import fs from 'fs';
import path from 'path';
import ws from 'ws';

const wss = new ws.Server({ noServer: true });

interface ServerError {
  log: string;
  status: number;
  message: { err: string };
}

const PORT = parseInt(process.env.PORT || '8080');
const app = express();

// const provider = new NodeTracerProvider();

// const exporter = new OTLPTraceExporter({ url: 'http://localhost:8080' });
// provider.addSpanProcessor(new BatchSpanProcessor(exporter));
// provider.register();

// registerInstrumentations({
//   instrumentations: [new HttpInstrumentation()],
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/getSpans', parseController.fetchSpans, (req, res) => {
  return res.status(200).json(res.locals.traces);
});

app.get('/clearSpans', parseController.clearSpans, (req, res) => {
  return res.status(200).json('hello');
});

app.use('/', parseController.getData, (req, res) => {
  return res.status(200).send(res.locals.data);
});

//global error handler
app.use(
  '/',
  (err: ServerError, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

const server = app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

//---------------------------------------- WEBSOCKETS ----------------------------------------
//upgrade
server.on('upgrade', function upgrade(request, socket, head) {
  try {
    // authentication and some other steps will come here
    // we can choose whether to upgrade or not

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
});

let client: any = undefined;

wss.on('connection', function connection(ws) {
  console.log(`Recieved a new connection.`);
  ws.send('[{data: data, swag: swag, Isaac: Lee,}]');

  ws.on('message', function message(data, isBinary) {
    console.log('received message', data.toString());
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  // handle close event
  ws.on('close', () => {
    console.log('closed', 'bye bye');
  });
});

module.exports = app;
