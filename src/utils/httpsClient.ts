import { IncomingMessage } from 'http';
import { request, Agent } from 'https';
import {
  HttpsClientClass,
  HttpsClientResponseClass,
  RequestHeaders,
  RequestData,
  ResponseHeaders,
  ResponseJSONBody,
} from 'src/types/httpsClient';
import { HttpMethodsEnum } from 'src/types/enums';

export default class HttpsClient implements HttpsClientClass {
  agent: Agent;

  constructor() {
    this.agent = new Agent({ keepAlive: true });
  }

  clearSockets(): boolean {
    this.agent.destroy();
    return true;
  }

  async sendRequest(
    hostname: string,
    port: number,
    path: string,
    method: string,
    headers: RequestHeaders,
    timeout: number,
    requestData?: RequestData,
  ): Promise<HttpsClientResponseClass> {
    const agent = this.agent;

    return new Promise<HttpsClientResponseClass>((resolve, reject) => {
      const req = request({
        hostname: hostname,
        port: port,
        path: path,
        method: method,
        agent: agent,
        headers: headers,
      });

      req.setTimeout(timeout, () => {
        // TODO: Handle timeout error with error handler CB and custom error code
        req.destroy();
      });

      req.on('response', (resp) => {
        resolve(new HttpsClientResponse(resp));
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.once('socket', (socket) => {
        if (socket.connecting) {
          socket.once('secureConnect', () => {
            if (
              method === HttpMethodsEnum.Post ||
              method == HttpMethodsEnum.Put
            )
              req.write(requestData);
            req.end();
          });
        } else {
          if (method === HttpMethodsEnum.Post || method == HttpMethodsEnum.Put)
            req.write(requestData);
          req.end();
        }
      });
    });
  }
}

export class HttpsClientResponse implements HttpsClientResponseClass {
  resp: IncomingMessage;
  respStatusCode: number;
  respHeaders: ResponseHeaders;

  constructor(resp: IncomingMessage) {
    this.resp = resp;
    this.respStatusCode = resp.statusCode || 400;
    this.respHeaders = resp.headers || {};
  }

  statusCode(): number {
    return this.respStatusCode;
  }

  headers(): ResponseHeaders {
    return this.respHeaders;
  }

  rawResponse(): IncomingMessage {
    return this.resp;
  }

  async responseBodyToJSON(): Promise<ResponseJSONBody> {
    return new Promise((resolve, reject) => {
      let response = '';

      this.resp.setEncoding('utf8');
      this.resp.on('data', (chunk) => {
        response += chunk.toString();
      });
      this.resp.once('end', () => {
        try {
          resolve(JSON.parse(response));
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}
