const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Import urls from urls.js
const urls = require('./urls.js');

let types = {};

urls.forEach((url, i) => {
    axios.get(url)
        .then(response => {
            const dom = new JSDOM(response.data);
            const scriptTags = [...dom.window.document.head.getElementsByTagName('script')];
            const jsonScripts = scriptTags.filter(tag => tag.type === 'application/ld+json');
            if (jsonScripts.length > 0) {
                count++;
                jsonScripts.forEach(script => {
                    try {
                        const jsonData = JSON.parse(script.textContent);
                        if ('@type' in jsonData) {
                            const type = jsonData['@type'];
                            types[type] = types[type] ? types[type] + 1 : 1;
                        }
                    } catch (e) {
                        console.error(`Failed to parse script content in ${url}. Error: ${e.message}`);
                    }
                });
            }

            // Log progress
            console.log(`Processed ${i + 1} of ${urls.length} URLs. Current count: ${count}`);
        })
        .catch(error => {
            console.error(`Failed to fetch or parse ${url}. Error: ${error.message}`);
        });
});

// After all URLs processed, you can handle the "types" object as needed.