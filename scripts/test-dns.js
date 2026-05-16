const dns = require('dns');
const util = require('util');
const resolveSrv = util.promisify(dns.resolveSrv);

async function checkDns() {
  const hostname = '_mongodb._tcp.ab-pet-grooming.fgu8ozc.mongodb.net';
  console.log(`Resolving SRV for: ${hostname}`);
  try {
    const addresses = await resolveSrv(hostname);
    console.log("SRV Records:", addresses);
  } catch (error) {
    console.error("DNS Resolution failed:", error.message);
  }
}

checkDns();
