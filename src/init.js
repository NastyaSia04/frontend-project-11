import view from "./view";
import model from './model';
import i18next from "i18next";
import ru from './locales/ru';

export default function init() {

    const i18n = i18next.createInstance();

    i18n.init({
        lng: 'ru',
        resources: {
            ru,
        }
    })
    console.log('init');

    const state = {
        feeds: [],
    }

    const listeners = {
        "feeds": (newFeeds) => {
            console.log('feeds changed', newFeeds);
        }
    }

    const translate = (key) => {
        return i18n.t(key);
    }

    const watchedState = model(state, listeners);

    view(watchedState, translate)
}