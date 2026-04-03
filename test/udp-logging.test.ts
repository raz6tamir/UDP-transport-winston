import winston from 'winston';
import { createSocket, Socket } from 'dgram';
import { AddressInfo } from 'net';
import os from 'os';

import { UDPTransport } from '../src';

function receiveMessage(server: Socket, timeoutMs = 2000): Promise<string> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timed out waiting for UDP message')), timeoutMs);
        server.once('message', (msg) => {
            clearTimeout(timer);
            resolve(msg.toString());
        });
    });
}

describe('Winston UDP Transport Test', () => {
    let udpServer: Socket;
    let testPort: number;

    beforeEach((done) => {
        udpServer = createSocket('udp4');
        // Bind to port 0 so the OS assigns a free ephemeral port for each test,
        // preventing cross-test contamination from buffered UDP packets.
        udpServer.bind(0, () => {
            testPort = (udpServer.address() as AddressInfo).port;
            done();
        });
    });

    afterEach((done) => {
        udpServer.close(done);
    });

    // -------------------------------------------------------------------------
    // Basic log levels
    // -------------------------------------------------------------------------

    it('should send an info log message via UDP', async () => {
        const logger = winston.createLogger({
            transports: [new UDPTransport({ host: '127.0.0.1', port: testPort })],
        });

        const logMessage = 'Test info message';
        logger.info(logMessage);

        const received = await receiveMessage(udpServer);
        expect(received).toContain(logMessage);
    });

    it('should send an error log message via UDP', async () => {
        const logger = winston.createLogger({
            transports: [new UDPTransport({ host: '127.0.0.1', port: testPort })],
        });

        const logMessage = 'Test error message';
        logger.error(logMessage);

        const received = await receiveMessage(udpServer);
        expect(received).toContain(logMessage);
    });

    it('should send a warn log message via UDP', async () => {
        const logger = winston.createLogger({
            transports: [new UDPTransport({ host: '127.0.0.1', port: testPort })],
        });

        logger.warn('Test warn message');

        const received = await receiveMessage(udpServer);
        expect(received).toContain('Test warn message');
    });

    // -------------------------------------------------------------------------
    // Trailing line feed behaviour
    // -------------------------------------------------------------------------

    it('should append a trailing line feed by default', async () => {
        // Use printf format so we control the exact output and know it has no trailing newline
        // before the transport processes it.
        const rawFormat = winston.format.printf(({ message }) => message as string);
        const logger = winston.createLogger({
            format: rawFormat,
            transports: [new UDPTransport({ host: '127.0.0.1', port: testPort })],
        });

        logger.info('lf test');

        const received = await receiveMessage(udpServer);
        expect(received.endsWith(os.EOL)).toBe(true);
    });

    it('should NOT append a trailing line feed when trailingLineFeed is false', async () => {
        const rawFormat = winston.format.printf(({ message }) => message as string);
        const logger = winston.createLogger({
            format: rawFormat,
            transports: [
                new UDPTransport({ host: '127.0.0.1', port: testPort, trailingLineFeed: false }),
            ],
        });

        logger.info('no lf test');

        const received = await receiveMessage(udpServer);
        expect(received).toBe('no lf test');
        expect(received.endsWith(os.EOL)).toBe(false);
    });

    it('should use a custom trailingLineFeedChar when provided', async () => {
        const customChar = '\r\n';
        const rawFormat = winston.format.printf(({ message }) => message as string);
        const logger = winston.createLogger({
            format: rawFormat,
            transports: [
                new UDPTransport({
                    host: '127.0.0.1',
                    port: testPort,
                    trailingLineFeed: true,
                    trailingLineFeedChar: customChar,
                }),
            ],
        });

        logger.info('custom lf test');

        const received = await receiveMessage(udpServer);
        expect(received.endsWith(customChar)).toBe(true);
    });

    it('should strip trailing whitespace before appending the line feed char', async () => {
        const rawFormat = winston.format.printf(({ message }) => `${message}   `);
        const logger = winston.createLogger({
            format: rawFormat,
            transports: [
                new UDPTransport({
                    host: '127.0.0.1',
                    port: testPort,
                    trailingLineFeed: true,
                    trailingLineFeedChar: '\n',
                }),
            ],
        });

        logger.info('trailing spaces');

        const received = await receiveMessage(udpServer);
        // Transport should strip trailing spaces then append exactly \n
        expect(received).toBe('trailing spaces\n');
    });

    // -------------------------------------------------------------------------
    // Silent mode
    // -------------------------------------------------------------------------

    it('should not send any UDP message when silent is true', async () => {
        const logger = winston.createLogger({
            transports: [
                new UDPTransport({ host: '127.0.0.1', port: testPort, silent: true }),
            ],
        });

        logger.info('this should be silent');

        await expect(receiveMessage(udpServer, 300)).rejects.toThrow('Timed out');
    });

    // -------------------------------------------------------------------------
    // close() / resource cleanup
    // -------------------------------------------------------------------------

    it('should close the UDP socket without throwing', () => {
        const transport = new UDPTransport({ host: '127.0.0.1', port: testPort });
        expect(() => transport.close()).not.toThrow();
    });

    it('should be safe to call close() multiple times', () => {
        const transport = new UDPTransport({ host: '127.0.0.1', port: testPort });
        transport.close();
        expect(() => transport.close()).not.toThrow();
    });

    // -------------------------------------------------------------------------
    // Callback / event behaviour
    // -------------------------------------------------------------------------

    it('should invoke the log callback after sending', async () => {
        const transport = new UDPTransport({ host: '127.0.0.1', port: testPort });
        const logger = winston.createLogger({ transports: [transport] });

        const callbackCalled = new Promise<void>((resolve) => {
            transport.once('logged', () => resolve());
        });

        logger.info('callback test');

        await callbackCalled;
    });

    it('should emit the "logged" event after a successful send', async () => {
        const transport = new UDPTransport({ host: '127.0.0.1', port: testPort });
        const logger = winston.createLogger({ transports: [transport] });

        const logged = new Promise<void>((resolve) => {
            transport.once('logged', () => resolve());
        });

        logger.info('event test');

        await expect(logged).resolves.toBeUndefined();
    });
});
