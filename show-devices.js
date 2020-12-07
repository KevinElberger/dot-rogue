const HID = require('node-hid');

// Linux: choose driverType
// default is 'hidraw', can also be 'libusb'
if( process.argv[2] ) {
    var type = process.argv[2];
    console.log("driverType:",type);
    HID.setDriverType( type );
}

const device = new HID.HID(1118, 736);

device.on('data', function(data) {

});


