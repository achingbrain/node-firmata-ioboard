var Firmata = require("firmata").Board;

/**
 * Wraps the Firmata module
 */
function FirmataIOBoard(usb, onReady) {
	this.firmata = new Firmata(usb, onReady);
}

/**
 * Firmata is the reference implementation so all interface methods are passthroughs.
 */
[
	"reportVersion", "queryFirmware", "analogRead", "analogWrite", "servoWrite", "pinMode",
	"digitalWrite", "digitalRead", "queryCapabilities", "queryAnalogMapping", "queryPinState",
	"sendI2CConfig", "sendI2CWriteRequest", "sendI2CReadRequest", "setSamplingInterval",
	"reportAnalogPin", "reportDigitalPin", "pulseIn", "stepperConfig", "stepperStep", "reset"
].forEach(function(method) {
	FirmataIOBoard.prototype[method] = function() {
		this.firmata[method].apply(this.firmata, arguments);
		return this;
	};
});

module.exports = FirmataIOBoard;
