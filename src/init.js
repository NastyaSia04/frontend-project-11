import view from "./view";
import model from './model';


export default function init() {
    console.log('init');

    const state = {
        feeds: [],
    }

    const listeners = {
        "feeds": (newFeeds) => {
            console.log('feeds changed', newFeeds);
        }
    }

    const watchedState = model(state, listeners);

    view(watchedState)
}