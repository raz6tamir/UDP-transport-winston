[![buddy pipeline](https://app.buddy.works/leotolk/udp-transport-winston/pipelines/pipeline/261114/badge.svg?token=4a23dc9261273453374dd1f99c6e1ab45c44d7aa12ee1cb0ec8aedb7a88124d3 "buddy pipeline")](https://app.buddy.works/leotolk/udp-transport-winston/pipelines/pipeline/261114)
![npm](https://img.shields.io/npm/v/udp-transport-winston)
![NPM](https://img.shields.io/npm/l/udp-transport-winston)


# UDP-transport-winston
A simple [winston](https://github.com/winstonjs/winston) transport for UDP in typescript.

Working with winston@3.

Can be used with [splunk](https://docs.splunk.com/Documentation/Splunk/8.0.4/Data/Monitornetworkports), [logstash (ELK)](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-udp.html) or any other UDP data inputs.

## Usage
### Installing
using npm:
```
npm install winston udp-transport-winston --save
```
using yarn:
```
yarn add winston udp-transport-winston
```

### Example

```TypeScript
import { winston } from 'winston';
import { UDPTransport } from 'udp-transport-winston';

const logger: winston.Logger = winston.createLogger({
    level: 'info',
    transports: [
        new UDPTransport({
            host: 'localhost',
            port: 1234
        })
    ]
});
```
or
```TypeScript
import { winston } from 'winston';
import { UDPTransport } from 'udp-transport-winston';

const logger: winston.Logger = winston.createLogger({
    level: 'info'
});

logger.add(new UDPTransport({
    host: 'localhost',
    port: 1234
}));
```

## API

* `class UDPTransport`
  * `constructor(options:TransportOptions)`
    * `options.host:string` UDP host
    * `options.port:number` UDP port
    * (optional) `options.trailingLineFeed:boolean` if to make single line
    * (optional) `options.trailingLineFeedChar:string` character to separate messages
    * (optional) Inherited transport options: `options.format`, `options.level`, `options.silent`, `options.handleExceptions`
    
