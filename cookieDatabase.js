// Known cookies, keyed by exact name. Each entry describes what the cookie
// is for and who reads the data it stores.
//
// category: "Necessary" | "Functional" | "Analytics" | "Advertising" | "Social" | "Unknown"
const cookieDatabase = {
  // --- Google Analytics / Tag Manager ---
  "_ga": { category: "Analytics", provider: "Google Analytics", description: "Stores a persistent, anonymized client ID used to distinguish you across visits for traffic and behavior analytics." },
  "_gid": { category: "Analytics", provider: "Google Analytics", description: "Stores a per-day client ID used to distinguish users for analytics." },
  "_gat": { category: "Analytics", provider: "Google Analytics", description: "Used to throttle the rate of requests sent to Google Analytics." },
  "_gcl_au": { category: "Advertising", provider: "Google Ads", description: "Used by Google Ads conversion linker to track ad click conversions across pages on this site." },
  "_gcl_aw": { category: "Advertising", provider: "Google Ads", description: "Stores Google Ads click information so a later conversion (e.g. purchase) can be attributed to the ad click." },
  "_gcl_dc": { category: "Advertising", provider: "Google Ads", description: "Stores Google Ads/Campaign Manager click information used for conversion attribution." },
  "__utma": { category: "Analytics", provider: "Google Analytics (legacy)", description: "Legacy Google Analytics cookie that distinguished unique users and sessions." },
  "__utmb": { category: "Analytics", provider: "Google Analytics (legacy)", description: "Legacy Google Analytics cookie used to determine new sessions/visits." },
  "__utmc": { category: "Analytics", provider: "Google Analytics (legacy)", description: "Legacy Google Analytics cookie used together with __utmb to detect when a session ends." },
  "__utmt": { category: "Analytics", provider: "Google Analytics (legacy)", description: "Legacy Google Analytics cookie used to throttle request rate." },
  "__utmz": { category: "Analytics", provider: "Google Analytics (legacy)", description: "Legacy Google Analytics cookie that stored how you arrived at the site (search engine, campaign, link)." },
  "__utmv": { category: "Analytics", provider: "Google Analytics (legacy)", description: "Legacy Google Analytics cookie used to store custom visitor segmentation data." },

  // --- Google Ads / DoubleClick / general Google ---
  "IDE": { category: "Advertising", provider: "Google DoubleClick", description: "Used by Google's ad network to register and report what ads you've seen, for retargeting and ad performance measurement." },
  "DSID": { category: "Advertising", provider: "Google DoubleClick", description: "Identifies a logged-in user for cross-device ad targeting and measurement." },
  "test_cookie": { category: "Advertising", provider: "Google DoubleClick", description: "Short-lived cookie used to check whether your browser supports cookies at all for ad delivery." },
  "ANID": { category: "Advertising", provider: "Google", description: "Used by Google to personalize ads shown across Google services and partner sites." },
  "NID": { category: "Functional", provider: "Google", description: "Stores preferences (like language, search settings) and is also used to help measure and personalize Google ads." },
  "1P_JAR": { category: "Advertising", provider: "Google", description: "Used by Google to carry out ad targeting, measure ad performance, and personalize content." },
  "AID": { category: "Advertising", provider: "Google", description: "Used by Google for cross-device advertising measurement." },
  "TAID": { category: "Advertising", provider: "Google", description: "Used by Google to link activity across devices for advertising purposes." },
  "CONSENT": { category: "Necessary", provider: "Google", description: "Stores your cookie/privacy consent choice for Google services." },
  "SOCS": { category: "Necessary", provider: "Google", description: "Stores your cookie consent settings selected on a Google service." },
  "OTZ": { category: "Analytics", provider: "Google", description: "Aggregated analytics cookie used by Google to estimate visitor numbers." },
  "PREF": { category: "Functional", provider: "Google / YouTube", description: "Stores your preferences such as preferred language, video player settings, and search filters." },
  "YSC": { category: "Functional", provider: "YouTube", description: "Maintains session state for embedded YouTube videos (e.g. which videos you've watched)." },
  "VISITOR_INFO1_LIVE": { category: "Functional", provider: "YouTube", description: "Estimates your network bandwidth on pages with embedded YouTube videos to choose video quality." },
  "VISITOR_PRIVACY_METADATA": { category: "Necessary", provider: "YouTube", description: "Stores privacy/consent metadata for embedded YouTube content." },
  "GPS": { category: "Advertising", provider: "YouTube", description: "Registers a unique ID on mobile devices to enable location-based ad targeting for embedded video." },
  "SID": { category: "Functional", provider: "Google account", description: "Authentication cookie that keeps you signed in to your Google account and helps protect against unauthorized access." },
  "SSID": { category: "Functional", provider: "Google account", description: "Works with SID to help confirm your identity and keep your Google account session secure." },
  "HSID": { category: "Functional", provider: "Google account", description: "Used together with SID to verify your identity and protect your Google account from theft." },
  "SAPISID": { category: "Functional", provider: "Google account", description: "Used to authenticate requests to Google APIs on your behalf while signed in." },
  "APISID": { category: "Functional", provider: "Google account", description: "Stores a token used to personalize Google content and ads for your signed-in account." },
  "LOGIN_INFO": { category: "Functional", provider: "YouTube", description: "Stores information about your login state for YouTube." },

  // --- Meta / Facebook ---
  "_fbp": { category: "Advertising", provider: "Meta (Facebook)", description: "Set by the Meta Pixel to identify browsers for the purpose of ad delivery and measurement, shared with Meta." },
  "_fbc": { category: "Advertising", provider: "Meta (Facebook)", description: "Stores information about a Facebook ad click so a later conversion can be attributed to that ad." },
  "fr": { category: "Advertising", provider: "Meta (Facebook)", description: "Used by Meta to deliver, measure, and improve the relevance of ads, including on other sites you visit." },
  "datr": { category: "Social", provider: "Meta (Facebook)", description: "Identifies the browser for fraud prevention and security purposes on Facebook-connected features." },
  "sb": { category: "Social", provider: "Meta (Facebook)", description: "Used by Facebook for browser identification and security checks." },
  "c_user": { category: "Social", provider: "Meta (Facebook)", description: "Stores your Facebook user ID while logged in, used by embedded Facebook widgets/login." },
  "xs": { category: "Social", provider: "Meta (Facebook)", description: "Session-related cookie used by Facebook to keep you authenticated." },
  "presence": { category: "Social", provider: "Meta (Facebook)", description: "Used by Facebook to track online/active status for chat-related features." },

  // --- Microsoft / Bing / Clarity ---
  "MUID": { category: "Advertising", provider: "Microsoft", description: "Unique identifier used by Microsoft (Bing/Microsoft Advertising) to recognize your browser across sites for ad targeting." },
  "MUIDB": { category: "Advertising", provider: "Microsoft", description: "Variant of the Microsoft advertising identifier cookie." },
  "MSPTC": { category: "Advertising", provider: "Microsoft", description: "Used by Microsoft to correlate identifiers across Microsoft domains for advertising." },
  "ANON": { category: "Advertising", provider: "Microsoft", description: "Stores an anonymous identifier used by Microsoft advertising services." },
  "NAP": { category: "Advertising", provider: "Microsoft", description: "Used by Microsoft advertising for ad targeting/measurement." },
  "_clck": { category: "Analytics", provider: "Microsoft Clarity", description: "Persists a unique visitor ID across sessions for Microsoft Clarity session-recording analytics." },
  "_clsk": { category: "Analytics", provider: "Microsoft Clarity", description: "Connects multiple page views by a single user into a single session recording in Microsoft Clarity." },
  "_uetsid": { category: "Advertising", provider: "Microsoft (UET)", description: "Microsoft Advertising Universal Event Tracking cookie that collects browsing behavior to serve relevant ads." },
  "_uetvid": { category: "Advertising", provider: "Microsoft (UET)", description: "Microsoft Advertising cookie used to track visitors across visits/devices for retargeted ads." },

  // --- LinkedIn ---
  "bcookie": { category: "Social", provider: "LinkedIn", description: "Browser identifier cookie used by LinkedIn for analytics and to recognize your browser." },
  "bscookie": { category: "Social", provider: "LinkedIn", description: "Secure browser identifier used by LinkedIn, typically alongside single sign-on." },
  "lidc": { category: "Functional", provider: "LinkedIn", description: "Used by LinkedIn for routing and load-balancing your requests to the correct data center." },
  "li_sugr": { category: "Advertising", provider: "LinkedIn", description: "Used by LinkedIn for browser identifier syncing for advertising purposes." },
  "UserMatchHistory": { category: "Advertising", provider: "LinkedIn Ads", description: "Used by LinkedIn Ads for ad retargeting and matching you across LinkedIn's ad partners." },
  "AnalyticsSyncHistory": { category: "Analytics", provider: "LinkedIn", description: "Stores when a sync with the AnalyticsSyncHistory endpoint last occurred for LinkedIn analytics." },
  "li_gc": { category: "Necessary", provider: "LinkedIn", description: "Stores your consent preferences for non-essential LinkedIn cookies." },

  // --- Twitter / X ---
  "personalization_id": { category: "Advertising", provider: "X (Twitter)", description: "Unique ID used by X (Twitter) to personalize content and ads, including off X.com." },
  "guest_id": { category: "Advertising", provider: "X (Twitter)", description: "Identifies a logged-out browser to X (Twitter) for ad and content measurement." },
  "ct0": { category: "Necessary", provider: "X (Twitter)", description: "CSRF protection token used by X (Twitter) to secure requests." },
  "auth_token": { category: "Functional", provider: "X (Twitter)", description: "Keeps you authenticated/logged in to X (Twitter)." },
  "twid": { category: "Functional", provider: "X (Twitter)", description: "Stores your X (Twitter) user ID while logged in." },

  // --- TikTok ---
  "_ttp": { category: "Advertising", provider: "TikTok Pixel", description: "Used by the TikTok Pixel to identify your browser across visits for ad delivery and conversion measurement." },
  "_tt_enable_cookie": { category: "Advertising", provider: "TikTok Pixel", description: "Indicates the TikTok Pixel is allowed to set tracking cookies in your browser." },

  // --- Pinterest ---
  "_pinterest_sess": { category: "Social", provider: "Pinterest", description: "Maintains your Pinterest session/login state." },
  "_pinterest_ct_ua": { category: "Advertising", provider: "Pinterest", description: "Used by the Pinterest Tag to measure and target ads based on your activity." },
  "_routing_id": { category: "Necessary", provider: "Pinterest", description: "Used to route your requests to the correct backend server." },

  // --- Snapchat ---
  "_scid": { category: "Advertising", provider: "Snapchat Pixel", description: "Unique ID set by the Snapchat Pixel used to match your activity to ad campaigns." },
  "sc_at": { category: "Functional", provider: "Snapchat", description: "Keeps you authenticated with Snapchat-connected features." },

  // --- Hotjar ---
  "_hjid": { category: "Analytics", provider: "Hotjar", description: "Stores a unique user ID for Hotjar so repeat visits can be tied to the same session-recording profile." },
  "_hjIncludedInSessionSample": { category: "Analytics", provider: "Hotjar", description: "Tells Hotjar whether this browser is included in a session-recording sample." },
  "_hjAbsoluteSessionInProgress": { category: "Analytics", provider: "Hotjar", description: "Used by Hotjar to detect the start of a new session for behavior analytics/heatmaps." },
  "_hjFirstSeen": { category: "Analytics", provider: "Hotjar", description: "Marks whether this is the first session for this browser, used by Hotjar analytics." },

  // --- AdRoll ---
  "__adroll": { category: "Advertising", provider: "AdRoll", description: "Identifies your browser for AdRoll's cross-site retargeting advertising." },
  "__adroll_fpc": { category: "Advertising", provider: "AdRoll", description: "First-party AdRoll cookie used to track and retarget you with ads across sites." },
  "__ar_v4": { category: "Advertising", provider: "AdRoll", description: "AdRoll retargeting cookie used to show you ads based on pages you've visited." },

  // --- HubSpot ---
  "hubspotutk": { category: "Analytics", provider: "HubSpot", description: "Tracks your identity across visits for HubSpot's marketing analytics and contact attribution." },
  "__hstc": { category: "Analytics", provider: "HubSpot", description: "Main HubSpot analytics cookie that tracks visitor sessions and source/referral data." },
  "__hssc": { category: "Analytics", provider: "HubSpot", description: "Tracks sessions for HubSpot analytics, expiring after periods of inactivity." },
  "__hssrc": { category: "Analytics", provider: "HubSpot", description: "Used by HubSpot to determine if you've restarted your browser, to reset session cookies." },
  "__hsfp": { category: "Analytics", provider: "HubSpot", description: "Used by HubSpot to track page views and content engagement." },

  // --- Stripe ---
  "__stripe_mid": { category: "Necessary", provider: "Stripe", description: "Used by Stripe for fraud prevention on payment forms; persists to recognize returning devices." },
  "__stripe_sid": { category: "Necessary", provider: "Stripe", description: "Short-lived Stripe cookie used for fraud prevention during checkout." },

  // --- Cloudflare ---
  "__cf_bm": { category: "Necessary", provider: "Cloudflare", description: "Bot-management cookie used by Cloudflare to distinguish humans from bots and protect the site from abuse." },
  "cf_clearance": { category: "Necessary", provider: "Cloudflare", description: "Indicates you've passed a Cloudflare security/bot challenge so future requests aren't blocked." },
  "__cflb": { category: "Necessary", provider: "Cloudflare", description: "Used by Cloudflare load balancing to route you consistently to the same backend." },
  "_cfuvid": { category: "Necessary", provider: "Cloudflare", description: "Used alongside Cloudflare bot management to distinguish individual users behind a shared IP." },

  // --- Shopify ---
  "_shopify_y": { category: "Analytics", provider: "Shopify", description: "Used by Shopify analytics to track visitors across the storefront." },
  "_shopify_s": { category: "Analytics", provider: "Shopify", description: "Session-scoped Shopify analytics cookie." },
  "_shopify_sa_p": { category: "Advertising", provider: "Shopify", description: "Used by Shopify to attribute orders to marketing campaigns/referrals." },
  "cart": { category: "Functional", provider: "Shopify", description: "Stores the contents of your shopping cart." },
  "secure_customer_sig": { category: "Functional", provider: "Shopify", description: "Authenticates you as a logged-in customer on a Shopify storefront." },

  // --- Consent management ---
  "OptanonConsent": { category: "Necessary", provider: "OneTrust", description: "Stores your cookie consent preferences so the consent banner reflects your previous choices." },
  "OptanonAlertBoxClosed": { category: "Necessary", provider: "OneTrust", description: "Records that you've closed the cookie consent banner so it doesn't reappear." },
  "CookieConsent": { category: "Necessary", provider: "Cookiebot", description: "Stores your cookie consent preferences for this site." },
  "cookieconsent_status": { category: "Necessary", provider: null, description: "Stores whether you've accepted or declined this site's cookie banner." },
  "CookieControl": { category: "Necessary", provider: "Civic Cookie Control", description: "Stores your cookie consent preferences." },
  "euconsent-v2": { category: "Necessary", provider: "IAB Europe TCF", description: "Stores your consent signal under the IAB Transparency & Consent Framework, shared with ad vendors to indicate what you've allowed." },

  // --- Generic session / auth / security ---
  "PHPSESSID": { category: "Functional", provider: null, description: "Identifies your server-side session on a PHP-based website (login state, form data, etc.)." },
  "JSESSIONID": { category: "Functional", provider: null, description: "Identifies your server-side session on a Java-based website." },
  "ASP.NET_SessionId": { category: "Functional", provider: null, description: "Identifies your server-side session on an ASP.NET-based website." },
  "connect.sid": { category: "Functional", provider: null, description: "Identifies your server-side session on a Node.js/Express-based website." },
  "csrftoken": { category: "Necessary", provider: null, description: "Security token used to verify requests originated from this site, preventing cross-site request forgery (CSRF) attacks." },
  "XSRF-TOKEN": { category: "Necessary", provider: null, description: "Security token used to verify requests originated from this site, preventing cross-site request forgery (CSRF) attacks." },
  "_csrf": { category: "Necessary", provider: null, description: "Security token used to verify requests originated from this site, preventing CSRF attacks." },
  "__RequestVerificationToken": { category: "Necessary", provider: "ASP.NET", description: "Anti-forgery token used by ASP.NET to validate that form submissions came from this site." },

  // --- WordPress ---
  "wordpress_test_cookie": { category: "Necessary", provider: "WordPress", description: "Checks whether your browser supports cookies; required for login to work." },

  // --- AWS / Akamai infrastructure ---
  "AWSALB": { category: "Necessary", provider: "AWS", description: "Used by AWS Application Load Balancer to route your requests to the same backend server for the duration of a session." },
  "AWSALBCORS": { category: "Necessary", provider: "AWS", description: "CORS-enabled variant of the AWS load balancer routing cookie." },
  "AWSELB": { category: "Necessary", provider: "AWS", description: "Used by AWS Elastic Load Balancer to keep your session routed to the same backend server." },
  "aws-waf-token": { category: "Necessary", provider: "AWS", description: "Used by AWS WAF to verify your browser passed bot/abuse checks." },
  "ak_bmsc": { category: "Necessary", provider: "Akamai", description: "Bot-management cookie used by Akamai to distinguish humans from automated traffic." },
  "bm_sv": { category: "Necessary", provider: "Akamai", description: "Used by Akamai bot management as part of validating legitimate browser sessions." },
  "bm_mi": { category: "Necessary", provider: "Akamai", description: "Used by Akamai bot management to help identify the session/device." }
};

// Pattern-based matches for cookie families that embed an ID/property
// number in their name (so an exact-name lookup would never match).
const cookiePatterns = [
  { test: /^_ga_[A-Z0-9]+$/, info: { category: "Analytics", provider: "Google Analytics 4", description: "Property-specific GA4 cookie used to persist session and engagement state for this site's Analytics property." } },
  { test: /^_gac_/, info: { category: "Advertising", provider: "Google Ads", description: "Stores Google Ads campaign click information for a specific ad account, used for conversion attribution." } },
  { test: /^_dc_gtm_/, info: { category: "Analytics", provider: "Google Tag Manager", description: "Used by Google Tag Manager to control the rate at which Analytics requests are sent." } },
  { test: /^_hjSession/, info: { category: "Analytics", provider: "Hotjar", description: "Stores your current Hotjar session-recording/heatmap data for this visit." } },
  { test: /^intercom-(session|id|device-id)-/, info: { category: "Functional", provider: "Intercom", description: "Identifies you to the Intercom chat/support widget so conversations persist across visits." } },
  { test: /^wordpress_logged_in_/, info: { category: "Functional", provider: "WordPress", description: "Indicates you're logged in to this WordPress site and which account." } },
  { test: /^wordpress_sec_/, info: { category: "Necessary", provider: "WordPress", description: "Secure authentication cookie used by WordPress admin areas." } },
  { test: /^wp-settings-/, info: { category: "Functional", provider: "WordPress", description: "Stores your WordPress admin UI preferences (panel layout, etc.)." } },
  { test: /^__Secure-/, info: { category: "Functional", provider: "Google account", description: "Secure-prefixed Google account authentication cookie used to keep you signed in." } }
];
