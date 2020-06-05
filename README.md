# UDP-transport-winston
A simple [winston](https://github.com/winstonjs/winston) transport for UDP in typescript.

Can be used with [splunk](https://docs.splunk.com/Documentation/Splunk/8.0.4/Data/Monitornetworkports), [logstash (ELK)](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-udp.html) or any other UDP data inputs.

## Usage
### Installing
```
npm install udp-transport-winston --save`
```
```
yarn add udp-transport-winston
```

### Example

```TypeScript
import {winston, Logger} from 'winston';
import {UDPTransport} from 'winston-udp-transport';

const logger:Logger = winston.createLogger({
    level:'info',
    transports: [
        new UDPTransport({
            host: 'localhost',
            port: 6666
        })
    ]
});
```
or
```TypeScript
import {winston, Logger} from 'winston';
import {UDPTransport} from 'winston-udp-transport';

const logger:Logger = winston.createLogger({
    level:'info'
});

logger.add(new UDPTransport({
    host: 'localhost',
    port: 6666
}))
```

## API

* `class UDPTransport`
  * `constructor(options:TransportOptions)`
    * `options.host` UDP host
    * `options.port` UDP port
    * (optional) `options.trailingLineFeed` trailingLineFeed
    * (optional) `options.trailingLineFeedChar` trailingLineFeedChar
    * (optional) Inherited transport options: `options.format`, `options.level`, `options.silent`, `options.handleExceptions`
    
