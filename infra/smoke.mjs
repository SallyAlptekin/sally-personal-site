// Post-deploy LIVE smoke tests for sallyalptekin.com.  node infra/smoke.mjs
const checks = [];
async function check(name, fn) {
  try {
    await fn();
    checks.push([true, name]);
  } catch (e) {
    checks.push([false, `${name} — ${e.message}`]);
  }
}
const UA = { 'user-agent': 'sallyalptekin-smoke' };

await check('sallyalptekin.com serves 200 + content', async () => {
  const r = await fetch('https://sallyalptekin.com', { headers: UA });
  if (r.status !== 200) throw new Error(`status ${r.status}`);
  if (!(await r.text()).includes('Sally Tang Alptekin')) throw new Error('name not in HTML');
});
await check('www.sallyalptekin.com serves 200', async () => {
  const r = await fetch('https://www.sallyalptekin.com', { headers: UA });
  if (r.status !== 200) throw new Error(`status ${r.status}`);
});
await check('unknown path returns 404', async () => {
  const r = await fetch('https://sallyalptekin.com/nope-does-not-exist', { headers: UA });
  if (r.status !== 404) throw new Error(`status ${r.status}`);
});

let ok = 0;
for (const [pass, name] of checks) {
  console.log(`${pass ? '✓' : '✗'} ${name}`);
  if (pass) ok++;
}
console.log(`\n${ok}/${checks.length} live checks passed`);
process.exit(ok === checks.length ? 0 : 1);
