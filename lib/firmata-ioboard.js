var Firmata = require("firmata").Board;

/**
 * Wraps the Firmata module
 */
function FirmataIOBoard(port, options, onReady) {
	if(typeof options === "function") {
		onReady = options;
		options = {};
	} else if(!options) {
		options = {};
	}

	// can't use instanceof on port as johnny-five's MockFirmata is not an instance of Firmata :(
	if(typeof port["analogWrite"] === "function") {
		this._firmata = port;
	} else {
		this._firmata = new Firmata(port, options, onReady);
	}

	/**
	 * Passthrough properties
	 */
	[
		"MODES", "I2C_MODES", "STEPPER", "HIGH", "LOW", "pins", "analogPins", "version",
		"firmware", "currentBuffer", "versionReceived", "sp", "reportVersionTimeoutId",
		"_events"
	].forEach(function(property) {
		this.__defineSetter__(property, function(value) {
			this._firmata[property] = value;
		}.bind(this));

		this.__defineGetter__(property, function() {
			return this._firmata[property];
		}.bind(this));
	}.bind(this));

	if(port instanceof Firmata && onReady) {
		onReady();
	}
}

/**
 * Firmata is the reference implementation so all interface methods are passthroughs.
 */
[
	"analogRead", "analogWrite", "servoWrite", "pinMode",
	"digitalWrite", "digitalRead", "queryCapabilities", "queryAnalogMapping", "queryPinState",
	"sendI2CConfig", "sendI2CWriteRequest", "sendI2CReadRequest", "setSamplingInterval",
	"reportAnalogPin", "reportDigitalPin", "pulseIn", "stepperConfig", "stepperStep", "reset",
	"sendOneWireConfig", "sendOneWireSearch", "sendOneWireAlarmsSearch", "sendOneWireRead", 
	"sendOneWireReset", "sendOneWireWrite", "sendOneWireDelay", "sendOneWireWriteAndRead"
].forEach(function(method) {
	FirmataIOBoard.prototype[method] = function() {
		this._firmata[method].apply(this._firmata, arguments);
		return this;
	};
});

/**
 * Passthough EventEmitter methods
 */
[
	"addListener", "on", "once", "removeListener", "setMaxListeners", "listeners", "emit", "listenerCount"
].forEach(function(method) {
	FirmataIOBoard.prototype[method] = function() {
		this._firmata[method].apply(this._firmata, arguments);
		return this;
	};
});

module.exports = FirmataIOBoard;
