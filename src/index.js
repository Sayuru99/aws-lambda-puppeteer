'use strict';

const axios = require('axios');
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
  let browser = null;

  try {
    // Launch headless Chrome browser
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Fetch data from the provided API endpoint
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = response.data;

    // Convert posts array to JSON string
    const jsonData = JSON.stringify(posts, null, 2);

    // Return JSON data as response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Sample Posts', data: JSON.parse(jsonData) }, null, 2),
    };
  } catch (error) {
    console.error('Error:', error);

    // Close the browser if it's still open
    if (browser !== null) {
      await browser.close();
    }

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
