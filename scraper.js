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

        // Extract text paragraphs
        $('p').each((i, el) => {
            const paragraph = $(el).text().trim();
            if (paragraph) {
                content.push(paragraph);
            }
        });

        // Extract image URLs
        $('img').each((i, el) => {
            const imgSrc = $(el).attr('src');
            if (imgSrc) {
                images.push(imgSrc);
            }
        });

        // Prepare the JSON data
        const articleData = {
            title,
            content,
            images
        };

        // Save to JSON file
        fs.writeFileSync(`${title}.json`, JSON.stringify(articleData, null, 2));
        console.log('Article data saved to article.json');
    } catch (error) {
        console.error(`Error fetching the article: ${error.message}`);
    }
}

// Usage
const url = 'https://en.wikipedia.org/wiki/Python_(programming_language)'; // Replace with the target URL
scrapeArticle(url);
