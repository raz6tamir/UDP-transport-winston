import { TransportOptions } from './models/transport-options';
import Transport = require('winston-transport');
export declare class UDPTransport extends Transport {
    private udpTransportOptions;
    private client;
    constructor(options: TransportOptions);
    log(info: any, callback: (error: Error | null, bytes: number | boolean) => void): void;
    close(): void;
    private sendLog;
}
