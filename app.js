const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

const url = "https://www.tiktok.com/@penguinsarecute07";

async function scrapeData() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Select the elements containing the counts
    const data = await page.evaluate(() => {
      const followingCount = document.querySelector('strong[data-e2e="following-count"]').innerText;
      const followersCount = document.querySelector('strong[data-e2e="followers-count"]').innerText;
      const likesCount = document.querySelector('strong[data-e2e="likes-count"]').innerText;
      
      return {
        followingCount,
        followersCount,
        likesCount
      };
    });

    await browser.close();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.get('/scrape', async (req, res) => {
  try {
    const data = await scrapeData();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error scraping data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
