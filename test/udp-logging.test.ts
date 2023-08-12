import winston from 'winston';
import { createSocket, Socket } from 'dgram';

import { UDPTransport } from '../src';

const TEST_PORT = 55000;
describe('Winston UDP Transport Test', () => {
    let udpServer: Socket;

    beforeEach(() => {
        udpServer = createSocket('udp4');
        udpServer.bind(TEST_PORT);
    });

    afterEach(() => {
        udpServer.close();
    });

    it('should send log message via UDP transport', async () => {
        const logger = winston.createLogger({
            transports: [
                new UDPTransport({
                    host: '127.0.0.1',
                    port: TEST_PORT,
                }),
            ],
        });

        const logMessage = 'Test log message';
        logger.info(logMessage);

        await new Promise<void>((resolve) => {
            udpServer.on('message', (message) => {
                const receivedMessage = message.toString();
                expect(receivedMessage).toContain(logMessage);
                resolve();
            });
        });
    });

    it('should send error message via UDP transport', async () => {
        const logger = winston.createLogger({
            transports: [
                new UDPTransport({
                    host: '127.0.0.1',
                    port: TEST_PORT,
                }),
            ],
        });

        const logMessage = 'Test error message';
        logger.error(logMessage);

        await new Promise<void>((resolve) => {
            udpServer.on('message', (message) => {
                const receivedMessage = message.toString();
                expect(receivedMessage).toContain(logMessage);
                resolve();
            });
        });
    });
});
