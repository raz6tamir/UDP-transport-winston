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
                options.trailingLineFeed || DEFAULT_TRANSPORT_OPTIONS.trailingLineFeed,
            trailingLineFeedChar:
                options.trailingLineFeedChar || DEFAULT_TRANSPORT_OPTIONS.trailingLineFeedChar,
        };

        this.client = dgram.createSocket('udp4');
        this.client.unref();
    }

    log(info: InfoObject, callback: (error: Error | null, bytes: number | boolean) => void): void {
        if (this.silent) {
            return callback(null, true);
        }

        this.sendLog(info[Symbol.for('message')], (err: Error | null) => {
            this.emit('logged', !err);
            callback(err, !err);
        });
    }

    close(): void {
        this.client.disconnect();
    }

    private sendLog(
        message: string,
        callback: (error: Error | null, bytes?: number | boolean) => void,
    ): void {
        if (this.udpTransportOptions.trailingLineFeed) {
            message = message.replace(/\s+$/, '') + this.udpTransportOptions.trailingLineFeedChar;
        }

        const buffer: Buffer = Buffer.from(message);
        /* eslint-disable @typescript-eslint/no-empty-function */
        this.client.send(
            buffer,
            0,
            buffer.length,
            this.udpTransportOptions.port,
            this.udpTransportOptions.host,
            callback || function () {},
        );
        /* eslint-enable @typescript-eslint/no-empty-function */
    }
}
