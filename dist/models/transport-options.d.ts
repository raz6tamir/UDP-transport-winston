import * as Transport from 'winston-transport';
export interface TransportOptions extends Transport.TransportStreamOptions {
    host: string;
    port: number;
    trailingLineFeed?: boolean;
    trailingLineFeedChar?: string;
}
