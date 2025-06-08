export function parseRss(rss) { 
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
 