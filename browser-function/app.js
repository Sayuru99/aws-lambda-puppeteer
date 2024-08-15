const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function launchBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  return browser;
}

exports.lambdaHandler = async (event, context) => {
  let browser;
  try {
    browser = await launchBrowser();
    
    const page = await browser.newPage();

    await page.goto('https://github.com', { waitUntil: 'load' });

    // Example 1: Screenshot the entire page
    const screenshot = await page.screenshot();
    console.log('Screenshot captured successfully.');

    // Example 2: PDF Generation (Uncomment to use)
    /*
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px',
      },
    });
    console.log('PDF generated successfully.');
    */

    // Example 3: Extract Text from the Page (Uncomment to use)
    /*
    const pageTitle = await page.title();
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page title:', pageTitle);
    console.log('Extracted text:', pageText);
    */

    // Example 4: Screenshot of a Specific Element (Uncomment to use)
    /*
    const element = await page.$('header');
    const elementScreenshot = await element.screenshot();
    console.log('Element screenshot captured successfully.');
    */

    return {
      statusCode: 200,
      body: screenshot.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred',
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
