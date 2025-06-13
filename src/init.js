import view from "./view";
import model from './model';
import i18next from "i18next";
import ru from './locales/ru';
import { validateFeedUrl } from "./validation/validateFeedUrl";
import { fetchFeed } from "./api/fetchFeed";
import { parseRss } from "./parsers/parseRSS";


const updateData = (state) => { 
    const { feeds, posts: oldPostsAll } = state;

    Promise.all(
        feeds.map(feed => fetchFeed(feed.url).then(({ data }) => {
            const { posts } = parseRss(data.contents);
            const oldPostsFromFeed = oldPostsAll.filter(post => post.feedId === feed.id);
            const newPosts = posts.filter(post => !oldPostsFromFeed.find(p => p.link === post.link)); 
            if (newPosts.length > 0) {
                const newPostsWithIds = newPosts.map((post, i) => ({ ...post, feedId: feed.id, id: state.posts.length + i }));
                state.posts.unshift(...newPostsWithIds);
            }
        }))
    ).finally(() => setTimeout(updateData, 5000, state));
}

export default function init() {

    const i18n = i18next.createInstance();

    i18n.init({
        lng: 'ru',
        resources: {
            ru,
        }
    }); 

    const state = {
        feeds: [],
        posts: [],
        openedPosts: [],
        openedPostId: null
    }

    const listeners = {
        onCreateFeed: (watchedState, url) => {
            return validateFeedUrl(url, watchedState.feeds, translate)
                .then(() => fetchFeed(url))
                .then(({ data }) => {
                    const { feed, posts } = parseRss(data.contents);
                    const feedWithId = { ...feed, id: watchedState.feeds.length, url };
                    const postsWithId = posts.map((post, i) => ({ ...post, feedId: feedWithId.id, id: watchedState.posts.length + i }));
                    watchedState.feeds.push(feedWithId);
                    watchedState.posts.push(...postsWithId);
                })
        }
    }

    const translate = (key) => {
        return i18n.t(key);
    } 

    const watchedState = view(state, listeners, translate);

    setTimeout(updateData, 5000, watchedState);
}