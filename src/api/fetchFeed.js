import axios from "axios";

const PROXY_URL = 'https://allorigins.hexlet.app/get';

export function fetchFeed(url) {
    const urlWithoutCache = new URL(PROXY_URL);
    urlWithoutCache.searchParams.set('url', url);
    urlWithoutCache.searchParams.set('disable_cache', 'true');
    return axios.get(urlWithoutCache.href);
} 