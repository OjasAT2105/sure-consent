const puppeteer = require("puppeteer-core");
const fs = require("fs");
const { execSync } = require("child_process");

// Function to find Chrome executable
function findChromeExecutable() {
  const possiblePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Users\\" +
      process.env.USERNAME +
      "\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];

  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }

  // Try to find Chrome using 'which' command (Unix-like systems)
  try {
    const result = execSync(
      "which google-chrome || which chromium-browser || which chromium",
      { encoding: "utf8" }
    );
    return result.trim();
  } catch (error) {
    // Return null if not found
    return null;
  }
}

// Function to categorize cookies based on their names using comprehensive mapping
function categorizeCookie(cookieName) {
  const name = cookieName.toLowerCase();

  // 🧱 Essential Cookies
  // Used for authentication, security, session handling, or core website operation
  const essentialKeywords = [
    "session",
    "wp_session",
    "wordpress_",
    "woocommerce_",
    "cart",
    "checkout",
    "csrf",
    "token",
    "auth",
    "secure_auth",
    "phpsessid",
    "logged_in",
    "login",
    "sessid",
    "wp-settings",
    "wp-saving-post",
    "nonce",
    "xsrf",
    "laravel_session",
    "jsessionid",
    "connect.sid",
    "cookie_consent",
    "cf_clearance", // Cloudflare security
    "__cf_bm", // Cloudflare bot management
    "cf_chl_", // Cloudflare challenge
    "shield_",
    "wpnonce",
    "site_session",
    "auth_token",
    "x_auth_",
    "csrf_token",
    "session_id",
  ];
  if (essentialKeywords.some((keyword) => name.includes(keyword))) {
    return "Essential Cookies";
  }

  // ⚙️ Functional Cookies
  // Used for remembering user preferences, language, UI settings, or personalization
  const functionalKeywords = [
    "lang",
    "locale",
    "theme",
    "mode",
    "timezone",
    "pref_",
    "remember",
    "viewed",
    "currency",
    "settings",
    "customization",
    "user_pref",
    "accessibility",
    "font_size",
    "site_lang",
    "display",
    "consent_choice",
    "contrast",
    "color_scheme",
    "sound",
    "volume",
    "sidebar",
    "layout",
    "cookies_accepted",
    "ui_theme",
    "last_visited",
    "preferred_language",
  ];

  if (functionalKeywords.some((keyword) => name.includes(keyword))) {
    return "Functional Cookies";
  }

  // 📊 Analytics Cookies
  // Used by tracking and analytics tools to measure site performance or user behavior
  const analyticsKeywords = [
    "_ga",
    "_ga_",
    "_gid",
    "_gat",
    "_gcl",
    "_gac",
    "_gac_gb_",
    "utm_",
    "analytics",
    "collect",
    "_hj",
    "hubspotutk",
    "_clck",
    "_clsk",
    "_uetsid",
    "_uetvid",
    "amplitude_id",
    "mixpanel",
    "_vwo",
    "_vis_opt",
    "_pk",
    "_snowplow",
    "matomo",
    "adobe_analytics",
    "_sf",
    "_ym",
    "yandex_metrika",
    "_fbp_analytic",
    "_gaexp",
    "_gaexp_rc",
    "ga4",
    "gtag",
    "_hjid",
    "_hjSession",
    "_hjIncludedInSessionSample",
    "_hjAbsoluteSessionInProgress",
    "_hjTLDTest",
    "_hjFirstSeen",
    "_hjSessionUser",
    "ajs_",
    "heap_",
    "segment_",
    "clarity",
    "_cltk",
    "_clskid",
    "cluid",
    "ms_clarity",
    "quantserve",
    "statcounter",
    "_sc_",
    "pendo_",
    "mixpanel_",
    "kissmetrics",
    "plausible_",
    "simple_analytics",
    "umami_",
    "vercel_analytics",
  ];
  if (analyticsKeywords.some((keyword) => name.includes(keyword))) {
    return "Analytics Cookies";
  }

  // 🎯 Marketing Cookies
  // Used for ad personalization, retargeting, social media tracking, and affiliate campaigns
  const marketingKeywords = [
    "fb_",
    "fbp",
    "fr",
    "tr",
    "pixel",
    "ads",
    "adwords",
    "gclid",
    "doubleclick",
    "affiliate",
    "trk_",
    "campaign",
    "marketing",
    "_uet",
    "_uetsid",
    "_uetvid",
    "_gcl_aw",
    "_gcl_dc",
    "linkedin_insight",
    "li_gc",
    "liap",
    "twitter_ads",
    "_tt_enable_cookie",
    "tt_sessionid",
    "outbrain",
    "taboola",
    "bing_",
    "criteo",
    "_scid",
    "sc_fb",
    "tiktok_ads",
    "ttclid",
    "_ttp",
    "tldid",
    "snaptr",
    "pinterest_",
    "_pinterest_ct_",
    "_pinterest_sess",
    "reddit_",
    "rtd_",
    "sm_",
    "_gads",
    "_gpi",
    "ga_audiences",
    "_gcl_au",
    "adroll_",
    "optimizely",
    "mc_anon_id",
    "marketo",
    "_mkto",
    "pardot",
    "_uetmsclkid",
    "msclkid",
    "ig_did",
    "ig_nrcb",
    "ig_fb",
    "meta_pixel",
    "li_fat_id",
    "bcookie",
    "UserMatchHistory",
    "AnalyticsSyncHistory",
    "personalization_id",
  ];

  if (marketingKeywords.some((keyword) => name.includes(keyword))) {
    return "Marketing Cookies";
  }

  // Default to uncategorized
  return "Uncategorized Cookies";
}

async function scanMultipleUrls(urls) {
  console.log(
    "Starting Puppeteer multi-page cookie scan for",
    urls.length,
    "URLs"
  );

  // Find Chrome executable
  const executablePath = findChromeExecutable();

  if (!executablePath) {
    throw new Error(
      "Chrome/Chromium browser not found. Please install Chrome or Chromium."
    );
  }

  const browser = await puppeteer.launch({
    executablePath: executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const allCookies = new Map(); // Use Map to avoid duplicates

    // Scan each URL
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`Scanning URL ${i + 1}/${urls.length}: ${url}`);

      const page = await browser.newPage();

      // Set a realistic user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      // Enable request interception to capture cookies from requests
      await page.setRequestInterception(true);

      const requestCookies = new Set();

      page.on("request", (request) => {
        const cookies = request.headers()["cookie"];
        if (cookies) {
          cookies.split(";").forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            if (name) {
              // Categorize the cookie based on its name
              const category = categorizeCookie(name);

              // Store cookie with source URL information
              const cookieKey = `${name}__${request.url()}`;
              allCookies.set(cookieKey, {
                name: name,
                value: value || "",
                domain: new URL(request.url()).hostname,
                path: "/",
                expires: null,
                category: category,
                note: `Detected via request headers on ${request.url()}`,
              });
            }
          });
        }
        request.continue();
      });

      try {
        // Go to the page
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Simulate some user interactions to trigger dynamic cookie setting
        await page.evaluate(() => {
          // Scroll to trigger lazy loading
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(1000);

        // Click some common elements if they exist
        try {
          await page.click('button:not([type="submit"])', { timeout: 1000 });
          await page.waitForTimeout(1000);
        } catch (e) {
          // Ignore if no clickable buttons found
        }

        // Get all cookies from the page
        const pageCookies = await page.cookies();

        // Add cookies from page.cookies()
        pageCookies.forEach((cookie) => {
          // Categorize the cookie based on its name
          const category = categorizeCookie(cookie.name);

          const cookieKey = `${cookie.name}__${cookie.domain}${cookie.path}`;
          allCookies.set(cookieKey, {
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            expires:
              cookie.expires === -1
                ? null
                : new Date(cookie.expires * 1000).toISOString(),
            category: category,
            note: "Detected via Puppeteer page.cookies()",
          });
        });
      } catch (error) {
        console.error(`Error scanning ${url}:`, error.message);
      } finally {
        await page.close();
      }
    }

    console.log(`Found ${allCookies.size} unique cookies`);
    await browser.close();

    // Convert Map to Array
    return Array.from(allCookies.values());
  } catch (error) {
    console.error("Puppeteer scan error:", error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

// Handle multiple URLs from command line
const urls = process.argv.slice(2);
if (urls.length > 0) {
  scanMultipleUrls(urls)
    .then((cookies) => {
      // Write results to a file that PHP can read
      fs.writeFileSync("puppeteer-results.json", JSON.stringify(cookies));
      console.log("Scan completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Scan failed:", error);
      process.exit(1);
    });
} else {
  console.error("No URLs provided");
  process.exit(1);
}
