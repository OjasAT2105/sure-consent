const puppeteer = require("puppeteer-core");
const fs = require("fs");
const { execSync } = require("child_process");

// Function to find Chrome/Chromium executable
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

async function scanCookies(url) {
  console.log("Starting Puppeteer cookie scan for:", url);

  // Find Chrome executable
  const executablePath = findChromeExecutable();

  if (!executablePath) {
    throw new Error(
      "Chrome/Chromium browser not found. Please install Chrome or Chromium."
    );
  }

  console.log("Using Chrome executable:", executablePath);

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
        // Parse cookies from request headers
        cookies.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=");
          if (name) {
            requestCookies.add(name);
          }
        });
      }
      request.continue();
    });

    // Go to the page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Get all cookies from the page
    const pageCookies = await page.cookies();

    // Combine cookies from both sources
    const allCookies = [];

    // Add cookies from page.cookies()
    pageCookies.forEach((cookie) => {
      allCookies.push({
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

    // Add cookies from request headers (if not already present)
    for (const cookieName of requestCookies) {
      const existingCookie = allCookies.find((c) => c.name === cookieName);
      if (!existingCookie) {
        allCookies.push({
          name: cookieName,
          value: "",
          domain: new URL(url).hostname,
          path: "/",
          expires: null,
          category: "Uncategorized",
          note: "Detected via request headers",
        });
      }
    }

    console.log(`Found ${allCookies.length} cookies`);

    await browser.close();

    // Write results to a file that PHP can read
    fs.writeFileSync("puppeteer-results.json", JSON.stringify(allCookies));

    return allCookies;
  } catch (error) {
    console.error("Puppeteer scan error:", error);
    await browser.close();
    throw error;
  }
}

// Get URL from command line arguments
const url = process.argv[2] || "http://localhost";

scanCookies(url)
  .then((cookies) => {
    console.log("Scan completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Scan failed:", error);
    process.exit(1);
  });
