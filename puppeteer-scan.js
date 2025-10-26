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
              // Store cookie with source URL information
              const cookieKey = `${name}__${request.url()}`;
              allCookies.set(cookieKey, {
                name: name,
                value: value || "",
                domain: new URL(request.url()).hostname,
                path: "/",
                expires: null,
                category: "Uncategorized",
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
            category: "Uncategorized",
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
