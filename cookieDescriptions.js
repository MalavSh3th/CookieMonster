// Category metadata used for badges/legends, plus a fallback classifier
// for cookies that aren't in cookieDatabase.js.

const cookieCategories = {
  Necessary: { label: "Necessary", color: "#2e7d32", blurb: "Required for core functionality such as security, fraud prevention, or load balancing. Minimal privacy impact." },
  Functional: { label: "Functional", color: "#1565c0", blurb: "Remembers settings or login state to provide a smoother experience. Usually first-party and low risk." },
  Analytics: { label: "Analytics", color: "#f9a825", blurb: "Collects pseudonymous usage data (pages visited, time on site) to help the site owner understand traffic." },
  Advertising: { label: "Advertising", color: "#c62828", blurb: "Builds a profile of your interests/behavior to target and measure ads, often shared with ad networks across sites." },
  Social: { label: "Social Media", color: "#6a1b9a", blurb: "Set by embedded social widgets or login buttons; can link your activity on this site to your social media identity." },
  Unknown: { label: "Unknown", color: "#616161", blurb: "Not recognized from common tracker/service lists. Inspect the name, domain, and value for clues." }
};

// Best-effort guess for cookies with no exact/pattern match in the database.
// Matches on whole tokens (split on non-alphanumeric characters) instead of
// raw substrings, so e.g. "ga" doesn't match inside "language" or "image".
function classifyCookieByName(name) {
  const lower = name.toLowerCase();
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);
  const hasToken = (...words) => words.some(w => tokens.includes(w));
  const includesAny = (...subs) => subs.some(s => lower.includes(s));

  if (includesAny("consent", "gdpr", "ccpa", "optout")) {
    return { category: "Necessary", provider: null, description: "Likely stores your cookie/privacy consent choice so the banner doesn't reappear." };
  }
  if (hasToken("csrf", "xsrf") || includesAny("requestverificationtoken")) {
    return { category: "Necessary", provider: null, description: "Likely a security token used to prevent cross-site request forgery (CSRF) attacks." };
  }
  if (hasToken("session", "sid", "sessid", "phpsessid", "sess", "ci")) {
    return { category: "Functional", provider: null, description: "Likely maintains your logged-in or session state with the server." };
  }
  if (hasToken("auth", "token", "access", "login", "rememberme", "jwt")) {
    return { category: "Functional", provider: null, description: "Likely used for authentication or to keep you signed in." };
  }
  if (hasToken("cart", "basket", "checkout", "order")) {
    return { category: "Functional", provider: null, description: "Likely tracks items in your shopping cart or checkout progress." };
  }
  if (hasToken("lang", "locale", "region", "currency", "tz", "timezone")) {
    return { category: "Functional", provider: null, description: "Likely stores a language, region, or currency preference." };
  }
  if (hasToken("theme", "pref", "preferences", "settings", "ui")) {
    return { category: "Functional", provider: null, description: "Likely stores a UI preference or setting you chose on this site." };
  }
  if (hasToken("ads", "ad", "marketing", "promo", "campaign", "affiliate", "clickid", "gclid", "fbclid")) {
    return { category: "Advertising", provider: null, description: "Name suggests an advertising/marketing or click-attribution cookie used to measure campaigns." };
  }
  if (hasToken("track", "analytics", "stat", "stats", "metrics", "telemetry")) {
    return { category: "Analytics", provider: null, description: "Name suggests it tracks behavior or usage metrics for analytics purposes." };
  }
  if (hasToken("uid", "userid", "user", "visitor", "client", "guest")) {
    return { category: "Unknown", provider: null, description: "Likely stores an internal user/visitor identifier; exact purpose depends on the site." };
  }
  if (hasToken("aws", "alb", "elb")) {
    return { category: "Necessary", provider: "AWS", description: "Likely managed by AWS load balancing to keep requests routed to the same backend server." };
  }
  if (name.length <= 4) {
    return { category: "Unknown", provider: null, description: "Short, likely encoded or internal-use cookie with no recognizable name pattern." };
  }
  return { category: "Unknown", provider: null, description: "Not recognized from common tracker or service lists." };
}

// Single entry point used by popup.js: exact match -> pattern match -> heuristic guess.
function lookupCookieInfo(name) {
  if (cookieDatabase[name]) return cookieDatabase[name];
  for (const rule of cookiePatterns) {
    if (rule.test.test(name)) return rule.info;
  }
  return classifyCookieByName(name);
}
