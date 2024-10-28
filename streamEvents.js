/*
  This is just a test script to check that paging events from an RPC node works
*/

const StellarSdk = require('stellar-sdk');
const rpc = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');

const contractId = 'CBD7GVRH7G52ZQWUJJBPSVPUEZWUBS4S3TGMOM7N2ZEFW7QWCQ2HHXSZ';

const eventsProcessed = [];
let firstRun = true;

const processEvents = async (eventsResponse) => {
    for (const event of eventsResponse.events) {
        //console.log('Event ID: ', event.id);
        //console.log(`Topics: `, event.topic);
        if (!event.topic[0]) return;
        const topicString = event.topic[0]._value.toString();
        //console.log('topicString: ', topicString);
        const alreadySeen = eventsProcessed.includes(event.id);
        eventsProcessed.push(event.id);
        if (!alreadySeen && topicString == 'launch' && firstRun == false) {
          console.log('######### go ##########');
        }
        firstRun = false;
    }
}

const checkEvents = async () => {
  console.log('Checking Events...')
  const latestLedger = await rpc.getLatestLedger();
  const eventsResponse = await rpc.getEvents({
    startLedger: latestLedger.sequence - 8000,
    filters: [
      {
        type: "contract",
        contractIds: [contractId],
      },
      {
        type: "system",
        contractIds: [contractId],
      },
      {
        type: "diagnostic",
        contractIds: [contractId],
      },
    ],
  });
  processEvents(eventsResponse);
}

setInterval(() => {
  checkEvents();
}, 5000);
