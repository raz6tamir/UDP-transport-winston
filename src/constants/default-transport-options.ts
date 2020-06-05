import { TransportOptions } from '../models/transport-options';
import * as os from 'os';

export const DEFAULT_TRANSPORT_OPTIONS: Partial<TransportOptions> = {
    trailingLineFeed: true,
    trailingLineFeedChar: os.EOL,
};
