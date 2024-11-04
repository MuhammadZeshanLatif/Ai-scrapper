const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Function to scrape the article
async function scrapeArticle(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('h1').text().trim();
        const content = [];
        const images = [];
        const videos = [];

        // Extract text paragraphs
        $('p').each((i, el) => {
            const paragraph = $(el).text().trim();
            if (paragraph) {
                content.push(paragraph);
            }
        });

        // Extract image URLs, including potential lazy-loaded images
        $('img').each((i, el) => {
            let imgSrc = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy');
            if (imgSrc) {
                images.push(imgSrc);
            }
        });

        // Extract video URLs from <video> and <iframe> tags
        $('video').each((i, el) => {
            const videoSrc = $(el).attr('src');
            if (videoSrc) {
                videos.push(videoSrc);
            }
        });

        $('iframe').each((i, el) => {
            const iframeSrc = $(el).attr('src');
            if (iframeSrc && iframeSrc.includes('youtube.com') || iframeSrc.includes('vimeo.com')) {
                videos.push(iframeSrc);
            }
        });

        // Prepare the JSON data
        const articleData = {
            title,
            content,
            images,
            videos
        };

        // Save to JSON file
        const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        fs.writeFileSync(fileName, JSON.stringify(articleData, null, 2));
        console.log(`Article data saved to ${fileName}`);
    } catch (error) {
        console.error(`Error fetching the article: ${error.message}`);
    }
}

// Usage
const url = 'https://www.linkedin.com/pulse/prescription-revolution-how-create-patient-led-roi-shternin-%E5%A6%84%E6%84%8F-/?trackingId=eer7ysAHQSa4AnpS1ayOcw%3D%3D'; // Replace with the target URL
scrapeArticle(url);
