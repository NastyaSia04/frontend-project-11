import view from "./view";
import model from './model';
import i18next from "i18next";
import ru from './locales/ru';
import { validateFeedUrl } from "./validation/validateFeedUrl";
import { fetchFeed } from "./api/fetchFeed";
import { parseRss } from "./parsers/parseRSS";

export default function init() {

    const i18n = i18next.createInstance();

    i18n.init({
        lng: 'ru',
        resources: {
            ru,
        }
    });

    console.log('init');

    const state = {
        feeds: [],
        posts: [],
    }

    const listeners = {
        onCreateFeed: (watchedState, url) => {
            return validateFeedUrl(url, watchedState.feeds, translate)
                .then(() => fetchFeed(url))
                .then(({ data }) => {
                    const { feed, posts } = parseRss(data.contents);
                    const feedWithId = { ...feed, id: watchedState.feeds.length };
                    const postsWithId = posts.map((post, i) => ({ ...post, feedId: feedWithId.id, id: watchedState.posts.length + i }));
                    watchedState.feeds.push(feedWithId);
                    watchedState.posts.push(...postsWithId);
                })
        }
    }

    const translate = (key) => {
        return i18n.t(key);
    } 

    view(state, listeners, translate)
}