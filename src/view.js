import { validateFeedUrl } from "./validation/validateFeedUrl";


export default function view(state, translate) {
    const elements = {
        input: document.querySelector('#url-input'),
        form: document.querySelector('.rss-form'),
        error: document.querySelector('.feedback')
    }

    const clearError = () => {
        elements.error.textContent = '';
    };

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const value = elements.input.value;

        validateFeedUrl(value, state.feeds, translate).then(() => {
            state.feeds.push(value);
            clearError();
        }).catch(err => {  
            elements.error.textContent = err.message;
        });
    })
}