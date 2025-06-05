import { validateFeedUrl } from "./validation/validateFeedUrl";
import onChange from 'on-change';
import { fetchFeed } from "./api/fetchFeed";
import { parseRss } from "./parsers/parseRSS";

const toggleVisibility = (element, force = false) => {
    element.classList.toggle('hidden', force);
}

const drawFeeds = (feed) => { 
    console.log('feeds', feed)
    // const el = elements.feedTemplate.content.cloneNode(true); 
    // el.querySelector('h3').textContent = feed.
    // elements.feedsContainer.append(el);
}

export default function view(state, translate) {
    const elements = {
        input: document.querySelector('#url-input'),
        form: document.querySelector('.rss-form'),
        error: document.querySelector('.feedback'),
        feedsAndPostsContainer: document.querySelector('.feeds-and-posts'),
        feedItemTemplate: document.querySelector('#feedItem'), 
        feedsContainer: document.querySelector('.feeds-list'),
        postsContainer: document.querySelector('.posts-list')
    }

    toggleVisibility(elements.feedsAndPostsContainer, true);

    const clearError = () => {
        elements.error.textContent = '';
    };

    function renderFeeds(state) {
        if (state.feeds.length > 0) {
            toggleVisibility(elements.feedsContainer, false);
            drawFeeds(state.feeds);
        } else {
            toggleVisibility(elements.feedsContainer, true);
        }
    } 

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const value = elements.input.value;

        validateFeedUrl(value, state.feeds, translate)
        .then(() => fetchFeed(value))
        .then(({data}) => {  
            const { feed, posts } = parseRss(data.contents);
            console.log('parsed', feed, posts);
            state.feeds.push(feed, posts);
            clearError();
        })
        .catch(err => {  
            elements.error.textContent = err.message;
        });
    })

    return onChange(state, (path) => {
        switch(path) {
            case 'feeds':
                renderFeeds(state);
                break;
                default:
                break;
        }
    });
}