import onChange from 'on-change';
import { parseRss } from "./parsers/parseRSS";

const toggleHidden = (element, force = false) => {
    element.classList.toggle('d-none', force);
}

const drawFeed = (elements, feed) => {
    const el = elements.feedItemTemplate.content.cloneNode(true);
    el.querySelector('h3').textContent = feed.title;
    el.querySelector('p').textContent = feed.description;
    elements.feedsContainer.append(el);
}

const drawPost = (elements, post) => {
    const el = elements.postItemTemplate.content.cloneNode(true);
    const link = el.querySelector('a');
    link.href = post.link;
    link.textContent = post.title;
    const button = el.querySelector('button');
    button['data-id'] = post.id;
    button.addEventListener('click', () => {
        // TODO 
    })
    elements.postsContainer.append(el);
}

const drawFeeds = (elements, feeds) => {
    feeds.forEach(feed => drawFeed(elements, feed)); 
}

const drawPosts = (elements, posts) => {
    posts.forEach(post => drawPost(elements, post));
}


const updateData = (state) => {
    const { feeds, posts } = state;

    Promise.all(
        feeds.map(feed => fetchFeed(feed.url).then(({ data }) => {
            const { posts } = parseRss(data.contents);
            const prevPosts = posts.filter;
        }))
    )
}

export default function view(state, listeners, translate) {
    const elements = {
        input: document.querySelector('#url-input'),
        form: document.querySelector('.rss-form'),
        error: document.querySelector('.feedback'),
        feedsAndPostsContainer: document.querySelector('.feeds-and-posts'),
        feedItemTemplate: document.querySelector('#feedItem'),
        postItemTemplate: document.querySelector('#postItem'),
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
        feedsList: document.querySelector('.feeds-list'),
        postsList: document.querySelector('.posts-list')
    }

    toggleHidden(elements.feedsContainer, true);
    toggleHidden(elements.postsContainer, true);

    function renderFeeds(feeds) {
        console.log('renderFeeds', feeds);
        const feedsExists = feeds.length > 0;
        toggleHidden(elements.feedsContainer, !feedsExists);

        if (feedsExists) {
            drawFeeds(elements, feeds);
        }
    }

    function renderPosts(posts) {
        console.log('renderPosts', posts);
        const postsExists = posts.length > 0;
        toggleHidden(elements.postsContainer, !postsExists);

        if (postsExists) {
            drawPosts(elements, posts);
        }  
    }

    const watchedState = onChange(state, (path, value) => { 
        switch (path) {
            case 'feeds':
                renderFeeds(value, elements);
                break;
            case 'posts':
                renderPosts(value, elements);
                break;
            default:
                break;
        }
    });

  


    const clearError = () => {
        elements.error.textContent = '';
    };

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const value = elements.input.value;

        listeners.onCreateFeed(watchedState,value)
            .then(clearError)
            .catch(err => {
                elements.error.textContent = err.message;
            });
    })

   return watchedState;
}