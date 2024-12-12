const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Function to scrape Instagram profiles
async function scrapeInstagram(keyword) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let emailResults = [];

    try {
        // Navigate to Instagram search page
        await page.goto(`https://www.instagram.com/explore/tags/${keyword}/`, { waitUntil: 'domcontentloaded' });

        // Simulate scrolling to load more posts
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));

        // Extract profile links
        const links = await page.evaluate(() => {
            let profileLinks = [];
            const anchors = document.querySelectorAll('a');
            anchors.forEach(anchor => {
                const href = anchor.href;
                if (href.includes('/p/') && !profileLinks.includes(href)) {
                    profileLinks.push(href);
                }
            });
            return profileLinks.slice(0, 5); // Limit to first 5 profiles
        });

        // Loop through each profile and extract the bio
        for (let link of links) {
            await page.goto(link, { waitUntil: 'domcontentloaded' });

            const email = await page.evaluate(() => {
                const bioText = document.querySelector('div.-vDIv span')?.textContent || '';
                const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
                const match = bioText.match(emailPattern);
                return match ? match[0] : null;
            });

            if (email) {
                emailResults.push(email);
            }

            if (emailResults.length >= 5) { // Limit the result to 5 emails
                break;
            }
        }

        return emailResults;
    } catch (error) {
        console.error(error);
        return [];
    } finally {
        await browser.close();
    }
}

// API endpoint to handle Instagram search
app.post('/search', async (req, res) => {
    const { keyword } = req.body;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const emails = await scrapeInstagram(keyword);
        res.json({ emails });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during the search' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
