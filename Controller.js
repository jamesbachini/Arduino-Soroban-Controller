const { Board, Led } = require("johnny-five");
const StellarSdk = require('stellar-sdk');

const rpc = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
const contractId = 'CBD7GVRH7G52ZQWUJJBPSVPUEZWUBS4S3TGMOM7N2ZEFW7QWCQ2HHXSZ';
const eventsProcessed = [];
let firstRun = true;
let power = false;

// Initialize the board connection
const board = new Board({
    port: "COM3"
});

board.on("ready", async () => {
    console.log('Board ready...');
    runLoop();
});

// Main loop function to check events and toggle LED based on conditions
const runLoop = async () => {
    while (!power) {
        await checkEvents();
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // If power is true, turn LED on and off with delay
    const led = new Led(3);
    console.log('Turning On...');
    led.on();
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Turning Off...');
    led.off();
    power = false;

    // Restart loop after LED toggle
    runLoop();
};

// Function to check and fetch the latest events from the blockchain
const checkEvents = async () => {
    console.log('Checking Events...');
    const latestLedger = await rpc.getLatestLedger();

    // Fetch specific events based on contract and system filters
    const eventsResponse = await rpc.getEvents({
        startLedger: latestLedger.sequence - 8000,
        filters: [
            { type: "contract", contractIds: [contractId] },
            { type: "system", contractIds: [contractId] },
            { type: "diagnostic", contractIds: [contractId] },
        ],
    });

    processEvents(eventsResponse);
};

// Process each event and update power state based on specific conditions
const processEvents = async (eventsResponse) => {
    for (const event of eventsResponse.events) {
        if (!event.topic[0]) return;

        const topicString = event.topic[0]._value.toString();
        const alreadySeen = eventsProcessed.includes(event.id);

        eventsProcessed.push(event.id);

        // Set power to true if 'launch' event detected and not the first run
        if (!alreadySeen && topicString === 'launch' && !firstRun) {
            console.log('######### LAUNCH ##########');
            power = true;
        }

        firstRun = false;
    }
};
