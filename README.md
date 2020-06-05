# winston-UDP-transport
A simple winston transport for UDP in typescript.
Can be used with splunk, logstash or any UDP data inputs.

## Example

```ts
import {winston} from 'winston';
import {UDPTransport} from 'winston-udp-transport';
winston.createLogger({
    level:'info',
    transports: [
        new UDPTransport({
            host: 'localhost',
            port: 6666
        })
    ]
})
```

## API

* `class UDPTransport`

  * `options`
  * `options.host` UDP host
  * `options.port` UDP port
