// {
//     "contents": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><rss xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:content=\"http://purl.org/rss/1.0/modules/content/\" xmlns:atom=\"http://www.w3.org/2005/Atom\" version=\"2.0\"><channel><title><![CDATA[Lorem ipsum feed for an interval of 5 seconds with 5 item(s)]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Thu, 05 Jun 2025 15:21:13 GMT</lastBuildDate><pubDate>Thu, 05 Jun 2025 15:21:10 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2025-06-05T15:21:10Z]]></title><description><![CDATA[Tempor non magna proident reprehenderit in exercitation culpa dolore laboris cupidatat occaecat aute fugiat.]]></description><link>http://example.com/test/1749136870</link><guid isPermaLink=\"true\">http://example.com/test/1749136870</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Thu, 05 Jun 2025 15:21:10 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2025-06-05T15:21:05Z]]></title><description><![CDATA[Duis mollit duis pariatur aute labore et veniam qui elit eiusmod laboris deserunt adipisicing.]]></description><link>http://example.com/test/1749136865</link><guid isPermaLink=\"true\">http://example.com/test/1749136865</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Thu, 05 Jun 2025 15:21:05 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2025-06-05T15:21:00Z]]></title><description><![CDATA[Culpa ut occaecat non sunt.]]></description><link>http://example.com/test/1749136860</link><guid isPermaLink=\"true\">http://example.com/test/1749136860</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Thu, 05 Jun 2025 15:21:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2025-06-05T15:20:55Z]]></title><description><![CDATA[Est Lorem dolore do ad deserunt id irure culpa aliqua.]]></description><link>http://example.com/test/1749136855</link><guid isPermaLink=\"true\">http://example.com/test/1749136855</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Thu, 05 Jun 2025 15:20:55 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2025-06-05T15:20:50Z]]></title><description><![CDATA[Sunt sint nulla id esse adipisicing nostrud commodo culpa nulla.]]></description><link>http://example.com/test/1749136850</link><guid isPermaLink=\"true\">http://example.com/test/1749136850</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Thu, 05 Jun 2025 15:20:50 GMT</pubDate></item></channel></rss>",
//     "status": {
//         "url": "http://lorem-rss.herokuapp.com/feed?length=5&unit=second&interval=5",
//         "content_type": "application/rss+xml; charset=utf-8",
//         "content_length": 2647,
//         "http_code": 200,
//         "response_time": 199
//     }
// }


export function parseRss(rss) {
    console.log("init", rss)
    const parsed = new DOMParser().parseFromString(rss, "application/xml");
    const error = parsed.querySelector('parsererror');

    if (error) {
        const errorObj = new Error(error.textContent);
        errorObj.name = "XMLParseError";
        throw errorObj;
    }

    const feed = {
        title: parsed.querySelector('channel title').textContent,
        description: parsed.querySelector('channel description').textContent,
    }

    const posts = [...parsed.querySelectorAll('item')].map(post => ({
        title: post.querySelector('title').textContent,
        description: post.querySelector('description').textContent,
        link: post.querySelector('link').textContent,
        pubDate: post.querySelector('pubDate').textContent,
    }))
 
    return {feed, posts};
}
 