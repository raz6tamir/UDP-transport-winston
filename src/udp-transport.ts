import dgram from 'dgram';
import { Socket } from 'dgram';
import Transport from 'winston-transport';
import { InfoObject, TransportOptions } from './models/transport-options';
import { DEFAULT_TRANSPORT_OPTIONS } from './constants/default-transport-options';

export class UDPTransport extends Transport {
    private udpTransportOptions: TransportOptions;
    private client: Socket;

    constructor(options: TransportOptions) {
        super(options as Transport.TransportStreamOptions);
        this.udpTransportOptions = {
            host: options.host,
            port: options.port,
            trailingLineFeed:
                options.trailingLineFeed ?? DEFAULT_TRANSPORT_OPTIONS.trailingLineFeed,
            trailingLineFeedChar:
                options.trailingLineFeedChar ?? DEFAULT_TRANSPORT_OPTIONS.trailingLineFeedChar,
        };

        this.client = dgram.createSocket('udp4');
        this.client.unref();
    }

    log(info: InfoObject, callback: (error: Error | null, bytes: number | boolean) => void): void {
        if (this.silent) {
            return callback(null, true);
        }

        const message = info[Symbol.for('message')];
        if (message === undefined || message === null) {
            return callback(null, true);
        }

        this.sendLog(message, (err: Error | null) => {
            if (err) {
                this.emit('error', err);
            }
            this.emit('logged', !err);
            callback(err, !err);
        });
    }

    close(): void {
        try {
            this.client.close();
        } catch (_err) {
            // socket may already be closed
        }
    }

    private sendLog(
        message: string,
        callback: (error: Error | null, bytes?: number | boolean) => void,
    ): void {
        if (this.udpTransportOptions.trailingLineFeed) {
            message = message.trimEnd() + this.udpTransportOptions.trailingLineFeedChar;
        }

        const buffer: Buffer = Buffer.from(message);
        this.client.send(
            buffer,
            0,
            buffer.length,
            this.udpTransportOptions.port,
            this.udpTransportOptions.host,
            callback,
        );
    }
}
