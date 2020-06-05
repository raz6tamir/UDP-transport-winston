import * as dgram from 'dgram';
import {Socket} from 'dgram';
import * as Transport from 'winston-transport';
import {TransportOptions} from './models/transport-options';
import {DEFAULT_TRANSPORT_OPTIONS} from './constants/default-transport-options';

export class UDPTransport extends Transport {
    private udpTransportOptions:TransportOptions;
    private client:Socket;

    constructor(options:TransportOptions) {
        super(options as Transport.TransportStreamOptions);
        this.udpTransportOptions = {
            host: options.host,
            port: options.port,
            trailingLineFeed: options.trailingLineFeed || DEFAULT_TRANSPORT_OPTIONS.trailingLineFeed,
            trailingLineFeedChar: options.trailingLineFeedChar || DEFAULT_TRANSPORT_OPTIONS.trailingLineFeedChar
        };

        this.client = dgram.createSocket('udp4');
        this.client.unref();
    }

    log(info:any, callback:(error:Error | null, bytes:number | boolean) => void):void {
        if (this.silent) {
            return callback(null, true);
        }

        this.sendLog(info[Symbol.for('message')], (err:Error | null) => {
            this.emit('logged', !err);
            callback(err, !err);
        });
    }

    close():void {
        this.client.disconnect();
    }

    private sendLog(message:string, callback:(error:Error | null, bytes?:number | boolean) => void):void {
        if (this.udpTransportOptions.trailingLineFeed) {
            message = message.replace(/\s+$/, '') + this.udpTransportOptions.trailingLineFeedChar;
        }

        const buffer:Buffer = Buffer.from(message);
        this.client.send(buffer, 0, buffer.length, this.udpTransportOptions.port, this.udpTransportOptions.host, (callback || function () {}));
    }
}
