import onChange from 'on-change';

export default (initialState, listeners = {}) => {
    return onChange(initialState, (path, value) => {
        listeners[path]?.(value);
    })
}