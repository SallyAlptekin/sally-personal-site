// Shared helpers for Sally's Cloudflare provisioning — SCOPED TO sallyalptekin.com ONLY.
// Token resolves from ../cf_creds (Sally's own scoped token) or the CLOUDFLARE_API_TOKEN
// env var (used for the initial setup with an account-wide token). Never references
// Kenan's zones/Workers.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CREDS_PATH = fileURLToPath(new URL('../cf_creds', import.meta.url));
const API = 'https://api.cloudflare.com/client/v4';

export const SALLY_ZONE = 'sallyalptekin.com';
export const COUNTRY_BLOCK = ['CN', 'RU', 'KP', 'IR', 'BY'];

function credsRaw() {
  try {
    return existsSync(CREDS_PATH) ? readFileSync(CREDS_PATH, 'utf8') : '';
  } catch {
    return '';
  }
}

export function loadToken() {
  const raw = credsRaw();
  if (raw) {
    const bearer = raw.match(/Bearer\s+([A-Za-z0-9_-]{20,})/);
    if (bearer) return bearer[1];
    const lines = raw.split(/\r?\n/);
    const idx = lines.findIndex((l) => /Your API Token/i.test(l));
    if (idx >= 0 && lines[idx + 1] && lines[idx + 1].trim()) return lines[idx + 1].trim();
    const runs = [...raw.matchAll(/[A-Za-z0-9_-]{20,}/g)].map((m) => m[0]).sort((a, b) => b.length - a.length);
    if (runs[0]) return runs[0];
  }
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  throw new Error('No API token — add sally-personal-site/cf_creds or set CLOUDFLARE_API_TOKEN');
}

export function loadAccountId() {
  const m = credsRaw().match(/\b[0-9a-f]{32}\b/);
  if (m) return m[0];
  return process.env.CLOUDFLARE_ACCOUNT_ID || null;
}

export async function cf(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`${method} ${path} -> HTTP ${res.status} (non-JSON)`);
  }
  if (!json.success) {
    const errs = (json.errors || []).map((e) => `${e.code} ${e.message}`).join('; ');
    const err = new Error(`${method} ${path} -> HTTP ${res.status}: ${errs || 'unknown error'}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

export async function verifyToken(token, accountId = loadAccountId()) {
  if (accountId) {
    try {
      const r = await cf(`/accounts/${accountId}/tokens/verify`, { token });
      return r.result;
    } catch {
      /* fall back to user-token verify */
    }
  }
  const r = await cf('/user/tokens/verify', { token });
  return r.result;
}

export async function getZones(token, accountId = loadAccountId()) {
  const q = accountId ? `&account.id=${accountId}` : '';
  const r = await cf(`/zones?per_page=50${q}`, { token });
  return r.result.map((z) => ({ id: z.id, name: z.name, plan: z.plan?.name, status: z.status }));
}

export async function getDnsRecords(token, zoneId) {
  const r = await cf(`/zones/${zoneId}/dns_records?per_page=400`, { token });
  return r.result;
}

const RULE_FIELDS = ['ref', 'description', 'expression', 'action', 'action_parameters', 'enabled'];
function sanitizeRule(r) {
  const out = {};
  for (const f of RULE_FIELDS) if (r[f] !== undefined) out[f] = r[f];
  if (out.enabled === undefined) out.enabled = true;
  return out;
}

export async function getPhaseRules(token, zoneId, phase) {
  try {
    const r = await cf(`/zones/${zoneId}/rulesets/phases/${phase}/entrypoint`, { token });
    return r.result?.rules || [];
  } catch (e) {
    if (e.status === 404) return [];
    throw e;
  }
}

export async function upsertPhaseRule(token, zoneId, phase, rule, { apply }) {
  const existing = await getPhaseRules(token, zoneId, phase);
  const others = existing.filter((x) => x.ref !== rule.ref).map(sanitizeRule);
  const merged = [...others, sanitizeRule(rule)];
  if (apply) {
    await cf(`/zones/${zoneId}/rulesets/phases/${phase}/entrypoint`, { method: 'PUT', token, body: { rules: merged } });
  }
  return { existingCount: existing.length, preservedOthers: others.length };
}

// Bot Fight Mode (free) — challenges automated traffic but allows VERIFIED bots
// (Googlebot, Bingbot, etc.), so search indexing is unaffected.
export async function enableBotFightMode(token, zoneId) {
  return cf(`/zones/${zoneId}/bot_management`, { method: 'PUT', token, body: { fight_mode: true } });
}
export async function getBotFightMode(token, zoneId) {
  try {
    const r = await cf(`/zones/${zoneId}/bot_management`, { token });
    return r.result || {};
  } catch (e) {
    return { error: e.message };
  }
}

export function parseArgs() {
  return { apply: process.argv.slice(2).includes('--apply') };
}

export async function requireValidToken(token, accountId = loadAccountId()) {
  try {
    await verifyToken(token, accountId);
  } catch (e) {
    console.error('\n❌ Cloudflare token is invalid:', e.message);
    console.error('   → Add a valid token to sally-personal-site/cf_creds (or set CLOUDFLARE_API_TOKEN).\n');
    process.exit(1);
  }
}
