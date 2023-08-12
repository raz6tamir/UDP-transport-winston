import os from 'os';
import { TransportOptions } from '../models/transport-options';

export const DEFAULT_TRANSPORT_OPTIONS: Partial<TransportOptions> = {
    trailingLineFeed: true,
    trailingLineFeedChar: os.EOL,
};
