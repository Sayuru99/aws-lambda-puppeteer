import dotenv from "dotenv";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { TwitterApi } from "twitter-api-v2";

dotenv.config();

const scrapeArticles = async () => {
  const url = "https://www.searchspaceai.com/press-releases";
  const articleSelector =
    "#news-releases-list > div.row.mt-4 > div.col-md-8.col-lg-9 > div";
  const titleSelector = "div > div > h6 > a";
  const dateSelector =
    "div > div > div.d-flex.flex-column.flex-sm-row.date-company > p:nth-child(1) > span";
  const pageInputSelector =
    "#news-releases-list > div.d-flex.justify-content-end.my-4 > nav > div > span.p-inputnumber.p-component.p-inputwrapper.p-inputwrapper-filled.p-inputwrapper-focus.p-p-paginator-page-input input";

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const targetDates = [today, yesterday];

  const scrapedData = [];
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      await page.waitForSelector(articleSelector);

      const articles = await page.evaluate(
        (articleSel, titleSel, dateSel, dates) => {
          return Array.from(document.querySelectorAll(articleSel))
            .map((el) => {
              const titleEl = el.querySelector(titleSel);
              const dateEl = el.querySelector(dateSel);
              const date = dateEl?.textContent.trim();
              if (dates.includes(date) && titleEl) {
                return {
                  title: titleEl.textContent.trim(),
                  url: titleEl.href,
                  date,
                };
              }
              return null;
            })
            .filter(Boolean);
        },
        articleSelector,
        titleSelector,
        dateSelector,
        targetDates
      );

      scrapedData.push(...articles);

      hasMorePages = await page.evaluate((inputSelector) => {
        const input = document.querySelector(inputSelector);
        const maxPage = input?.max || 1;
        return input && parseInt(input.value, 10) < parseInt(maxPage, 10);
      }, pageInputSelector);

      if (hasMorePages) {
        currentPage++;
        await page.evaluate(
          (inputSelector, page) => {
            const input = document.querySelector(inputSelector);
            input.value = page;
            input.dispatchEvent(new Event("change", { bubbles: true }));
          },
          pageInputSelector,
          currentPage
        );
        await page.waitForTimeout(1000);
      }
    }

    console.log("Scraping complete:", scrapedData);
  } catch (error) {
    console.error("Error during scraping:", error.message);
  } finally {
    if (browser) await browser.close();
  }

  return scrapedData;
};

const postTweets = async (articles) => {
  const client = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
  });

  const checkRateLimit = async () => {
    try {
      const rateLimitStatus = await client.v2.get(
        "application/rate_limit_status"
      );
      const remainingRequests =
        rateLimitStatus.resources.statuses["/statuses/update"].remaining;
      const resetTimestamp =
        rateLimitStatus.resources.statuses["/statuses/update"].reset;

      if (remainingRequests === 0) {
        const waitTime = resetTimestamp - Math.floor(Date.now() / 1000);
        console.log(
          `Waiting for ${waitTime} seconds until rate limit resets...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
      }
    } catch (error) {
      console.error("Error checking rate limit:", error);
    }
  };

  for (const article of articles) {
    const tweetContent = `${article.title}\n${article.url}`;

    await checkRateLimit();

    try {
      await client.v2.tweet(tweetContent);
      console.log(`Tweet posted: ${tweetContent}`);
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  }
};

export const lambdaHandler = async (event, context) => {
  console.log("Starting scraper...");
  const articles = await scrapeArticles();

  if (articles.length === 0) {
    console.log("No articles found for today or yesterday.");
    return;
  }

  console.log(`Scraped ${articles.length} articles. Now posting tweets...`);
  await postTweets(articles);
  console.log("All done!");
};
