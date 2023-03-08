"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPTransport = void 0;
var dgram = require("dgram");
var default_transport_options_1 = require("./constants/default-transport-options");
var Transport = require("winston-transport");
var UDPTransport = /** @class */ (function (_super) {
    __extends(UDPTransport, _super);
    function UDPTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.udpTransportOptions = {
            host: options.host,
            port: options.port,
            trailingLineFeed: options.trailingLineFeed || default_transport_options_1.DEFAULT_TRANSPORT_OPTIONS.trailingLineFeed,
            trailingLineFeedChar: options.trailingLineFeedChar || default_transport_options_1.DEFAULT_TRANSPORT_OPTIONS.trailingLineFeedChar,
        };
        _this.client = dgram.createSocket('udp4');
        _this.client.unref();
        return _this;
    }
    UDPTransport.prototype.log = function (info, callback) {
        var _this = this;
        if (this.silent) {
            return callback(null, true);
        }
        this.sendLog(info[Symbol.for('message')], function (err) {
            _this.emit('logged', !err);
            callback(err, !err);
        });
    };
    UDPTransport.prototype.close = function () {
        this.client.disconnect();
    };
    UDPTransport.prototype.sendLog = function (message, callback) {
        if (this.udpTransportOptions.trailingLineFeed) {
            message = message.replace(/\s+$/, '') + this.udpTransportOptions.trailingLineFeedChar;
        }
        var buffer = Buffer.from(message);
        /* eslint-disable @typescript-eslint/no-empty-function */
        this.client.send(buffer, 0, buffer.length, this.udpTransportOptions.port, this.udpTransportOptions.host, callback || function () { });
        /* eslint-enable @typescript-eslint/no-empty-function */
    };
    return UDPTransport;
}(Transport));
exports.UDPTransport = UDPTransport;
//# sourceMappingURL=udp-transport.js.map