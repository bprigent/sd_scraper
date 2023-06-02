const axios = require('axios');
const cheerio = require('cheerio');

const domains = require('../urls-list.js');

async function scrapeSitemap(domains) {
    let pages = [];

    for (let domain of domains) {
        let sitemapUrl = `${domain}/sitemap.xml`;
        try {
            let response = await axios.get(sitemapUrl);
            let $ = cheerio.load(response.data, { xmlMode: true });
            $('loc').each(function(i, elem) {
                if (i < 50) { // Limit to first 50 pages
                    pages.push($(this).text());
                }
            });
        } catch (error) {
            console.error(`Error scraping ${sitemapUrl}: ${error}`);
        }
    }
    return pages;
}

scrapeSitemap(domains)
    .then(pages => console.log(pages))
    .catch(err => console.error(err));
