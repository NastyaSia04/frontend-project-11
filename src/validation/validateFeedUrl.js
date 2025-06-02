import * as yup from 'yup';

export function validateFeedUrl (url, prevUrlList = []) {
    const errorTexts = {
        required: 'Поле обязательно для заполнения',
        url: 'Ссылка должна быть валидным URL',
        notOneOf: 'RSS уже существует'
    }

    const validator = yup 
                        .string()
                        .url(errorTexts.url)
                        .required(errorTexts.required)
                        .notOneOf(prevUrlList, errorTexts.notOneOf);

    return validator.validate(url);
}