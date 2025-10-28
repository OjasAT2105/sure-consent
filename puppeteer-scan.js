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

// Function to categorize cookies based on their names
function categorizeCookie(cookieName) {
  const name = cookieName.toLowerCase();

  // Essential cookies (strictly necessary for website functionality)
  if (
    name.includes("session") ||
    name.includes("login") ||
    name.includes("auth") ||
    name.includes("token") ||
    name.includes("csrf") ||
    name.includes("security") ||
    name.includes("cart") ||
    name.includes("checkout") ||
    name.includes("user") ||
    name.includes("pref") ||
    name.includes("setting") ||
    name.includes("lang") ||
    name.includes("locale") ||
    name.includes("currency") ||
    name.includes("gdpr") ||
    name.includes("consent") ||
    name.includes("cookie") ||
    name.includes("sureconsent")
  ) {
    return "Essential Cookies";
  }

  // Analytics cookies
  if (
    name.includes("ga") ||
    name.includes("google") ||
    name.includes("analytics") ||
    name.includes("utm") ||
    name.includes("gtag") ||
    name.includes("gtm") ||
    name.includes("matomo") ||
    name.includes("piwik") ||
    name.includes("_ga") ||
    name.includes("_gid") ||
    name.includes("_gat")
  ) {
    return "Analytics Cookies";
  }

  // Marketing/Advertising cookies
  if (
    name.includes("ad") ||
    name.includes("ads") ||
    name.includes("advert") ||
    name.includes("facebook") ||
    name.includes("fb") ||
    name.includes("twitter") ||
    name.includes("linkedin") ||
    name.includes("instagram") ||
    name.includes("pinterest") ||
    name.includes("youtube") ||
    name.includes("tiktok") ||
    name.includes("taboola") ||
    name.includes("outbrain") ||
    name.includes("doubleclick") ||
    name.includes("taboola") ||
    name.includes("criteo") ||
    name.includes("yahoo") ||
    name.includes("bing") ||
    name.includes("gclid") ||
    name.includes("fbclid") ||
    name.includes("msclkid")
  ) {
    return "Marketing Cookies";
  }

  // Functional cookies
  if (
    name.includes("theme") ||
    name.includes("layout") ||
    name.includes("design") ||
    name.includes("custom") ||
    name.includes("personal") ||
    name.includes("preference") ||
    name.includes("config") ||
    name.includes("widget") ||
    name.includes("embed") ||
    name.includes("video") ||
    name.includes("audio") ||
    name.includes("map") ||
    name.includes("social") ||
    name.includes("share") ||
    name.includes("comment") ||
    name.includes("rating") ||
    name.includes("review")
  ) {
    return "Functional Cookies";
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
