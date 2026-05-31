// READ-ONLY recon for sallyalptekin.com. Verifies the token, finds her zone, and
// dumps DNS + WAF + Bot Fight Mode status.  node infra/recon.mjs
import {
  loadToken,
  loadAccountId,
  verifyToken,
  getZones,
  getDnsRecords,
  getPhaseRules,
  getBotFightMode,
  SALLY_ZONE,
} from './lib.mjs';

const token = loadToken();
console.log('token length', token.length, '| account id', loadAccountId() ? 'present' : 'absent');
let v;
try {
  v = await verifyToken(token);
} catch (e) {
  console.error('\n❌ Token verification FAILED:', e.message);
  process.exit(1);
}
console.log(`✓ token valid (status: ${v.status})`);

const zone = (await getZones(token)).find((z) => z.name === SALLY_ZONE);
if (!zone) {
  console.error(`\n❌ ${SALLY_ZONE} not visible to this token (scoped token may exclude it).`);
  process.exit(1);
}
console.log(`\n=== ${SALLY_ZONE} (${zone.id}) | plan=${zone.plan} | status=${zone.status} ===`);

const dns = await getDnsRecords(token, zone.id);
console.log(`DNS records: ${dns.length} (MX=${dns.filter((d) => d.type === 'MX').length})`);
for (const d of dns.sort((a, b) => (a.type + a.name).localeCompare(b.type + b.name))) {
  console.log(`  ${d.type.padEnd(6)} ${d.name.padEnd(28)} ${(d.proxied ? '[proxied] ' : '[dns-only]')} ${String(d.content).slice(0, 60)}`);
}
const waf = await getPhaseRules(token, zone.id, 'http_request_firewall_custom');
console.log(`WAF custom rules: ${waf.length}`);
waf.forEach((r) => console.log(`  - [${r.action}] ${r.description || r.ref}`));
const bot = await getBotFightMode(token, zone.id);
console.log('Bot Fight Mode:', bot.fight_mode === undefined ? JSON.stringify(bot) : bot.fight_mode);

console.log('\n✓ recon complete (read-only, nothing changed).');
