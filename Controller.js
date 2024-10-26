
const {Board, Led} = require("johnny-five");

let power = false;

const board = new Board({
    port: "COM3"
});

board.on("ready", async () => {
    console.log('Board ready...');
    while (power == false) {
        await new Promise(r => setTimeout(r, 1000));
    }
    const led = new Led(3);
    console.log('Turning On...');
    led.on();
    await new Promise(r => setTimeout(r, 3000));
    console.log('Turning Off...');
    led.off();
});


setTimeout(() => {
    power = true;
}, 5000);
