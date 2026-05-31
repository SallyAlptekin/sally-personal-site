// Harden sallyalptekin.com: WAF geo-block + Bot Fight Mode. DRY-RUN by default; --apply to write.
//   node infra/secure.mjs          # preview
//   node infra/secure.mjs --apply  # execute
import {
  loadToken,
  requireValidToken,
  getZones,
  upsertPhaseRule,
  enableBotFightMode,
  parseArgs,
  COUNTRY_BLOCK,
  SALLY_ZONE,
} from './lib.mjs';

const { apply } = parseArgs();
const token = loadToken();
await requireValidToken(token);

const zone = (await getZones(token)).find((z) => z.name === SALLY_ZONE);
if (!zone) {
  console.error(`❌ ${SALLY_ZONE} not visible to this token.`);
  process.exit(1);
}

const expression = `(ip.geoip.country in {${COUNTRY_BLOCK.map((c) => `"${c}"`).join(' ')}})`;
const rule = {
  ref: 'geo_block',
  description: `Cloudflare firewall rule to help secure the site (geo-block: ${COUNTRY_BLOCK.join(', ')})`,
  expression,
  action: 'block',
  enabled: true,
};

console.log(`\n=== Secure ${SALLY_ZONE} — ${apply ? 'APPLY' : 'DRY-RUN'} ===`);
console.log('WAF geo-block:', expression);
console.log('Bot Fight Mode: enable (challenges bad bots; allows verified crawlers like Googlebot)');
if (!apply) {
  console.log('\n(dry-run — re-run with --apply to make changes)');
  process.exit(0);
}

await upsertPhaseRule(token, zone.id, 'http_request_firewall_custom', rule, { apply: true });
console.log('✓ WAF geo-block rule applied');
try {
  await enableBotFightMode(token, zone.id);
  console.log('✓ Bot Fight Mode enabled');
} catch (e) {
  console.log('⚠ Bot Fight Mode not set via API:', e.message);
  console.log('  → enable it in the dashboard: Security → Bots → Bot Fight Mode.');
}
console.log('\n✓ sallyalptekin.com secured.');
