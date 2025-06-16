import * as yup from 'yup'

export function validateFeedUrl (url, prevUrlList, translate) {

  yup.setLocale({
    string: {
      url: translate('errors.url'),
    },
    mixed: {
      required: translate('errors.required'),
      notOneOf: translate('errors.notOneOf'),
    },
  })

  const validator = yup
        .string()
        .url()
        .required()
        .notOneOf(prevUrlList)

  return validator.validate(url)
}
