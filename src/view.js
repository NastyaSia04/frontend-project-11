import onChange from 'on-change'

const toggleHidden = (element, force = false) => {
  element.classList.toggle('d-none', force)
}

const drawFeed = (elements, feed) => {
  const el = elements.feedItemTemplate.content.cloneNode(true)
  el.querySelector('h3').textContent = feed.title
  el.querySelector('p').textContent = feed.description
  elements.feedsList.append(el)
}

const drawPost = (elements, post, alreadyViewed) => {
  const el = elements.postItemTemplate.content.cloneNode(true)
  // postid undefined
  const li = el.querySelector('li')
  li.dataset.postid = post.id
  const link = el.querySelector('a')
  link.href = post.link
  link.textContent = post.title
  link.dataset.id = post.id
  if (alreadyViewed) {
    link.classList.add('fw-normal', 'link-secondary')
  }
  const button = el.querySelector('button')
  button.dataset.id = post.id
  elements.postsList.append(el)
}

const drawFeeds = (elements, feeds) => {
  elements.feedsList.innerHTML = ''
  feeds.forEach(feed => drawFeed(elements, feed))
}

const drawPosts = (elements, posts, openedPosts) => {
  posts.forEach(post => drawPost(elements, post, openedPosts.includes(post.id)))
}

const renderModal = (post, elements) => {
  if (!post) {
    return
  }
  elements.modalTitle.textContent = post.title
  elements.modalBody.textContent = post.description
  elements.modalLink.href = post.link
}

const toggleOpenedPosts = (postsIds, elements) => {
  console.log('new opened postsids', postsIds)
  postsIds.forEach((postId) => {
    console.log('finding', `[data-postId="${postId}"]`)
    const postElement = elements.postsList.querySelector(`[data-postid="${postId}"] > a`)
    console.log(postElement)
    postElement.classList.add('fw-normal', 'link-secondary')
  })
}

export default function view(state, listeners, translate) {
  const elements = {
    input: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    feedsAndPostsContainer: document.querySelector('.feeds-and-posts'),
    feedItemTemplate: document.querySelector('#feedItem'),
    postItemTemplate: document.querySelector('#postItem'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    feedsList: document.querySelector('.feeds-list'),
    postsList: document.querySelector('.posts-list'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
  }

  toggleHidden(elements.feedsContainer, true)
  toggleHidden(elements.postsContainer, true)

  function renderFeeds(feeds) {
    const feedsExists = feeds.length > 0
    toggleHidden(elements.feedsContainer, !feedsExists)

    if (feedsExists) {
      drawFeeds(elements, feeds)
    }
  }

  function renderPosts(posts, openedPosts) {
    const postsExists = posts.length > 0
    toggleHidden(elements.postsContainer, !postsExists)

    if (postsExists) {
      drawPosts(elements, posts, openedPosts)
    }
  }

  const watchedState = onChange(state, function (path, value) {
    switch (path) {
      case 'feeds':
        renderFeeds(value, elements)
        break
      case 'posts':
        console.log('openedPosts', this.openedPosts)
        renderPosts(value, this.openedPosts)
        break
      case 'openedPosts':
        toggleOpenedPosts(value, elements)
        break
      case 'openedPostId':
        renderModal(this.posts.find(post => post.id === +value), elements)
        break
      default:
        break
    }
  })

  elements.postsList.addEventListener('click', (e) => {
    const link = e.target.closest('a')
    if (link) {
      const id = link.dataset.id
      watchedState.openedPosts.push(id)
    }

    const button = e.target.closest('button')
    if (button) {
      const id = button.dataset.id
      watchedState.openedPosts.push(id)
      watchedState.openedPostId = id
    }
  })

  const showSuccess = () => {
    elements.feedback.textContent = translate('success')
    elements.feedback.classList.add('text-success')
    elements.feedback.classList.remove('text-danger')
    elements.input.value = ''
  }

  const showError = (errorMsg) => {
    elements.feedback.textContent = errorMsg
    elements.feedback.classList.add('text-danger')
    elements.feedback.classList.remove('text-success')
  }

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()

    const value = elements.input.value

    listeners.onCreateFeed(watchedState, value)
      .then(showSuccess)
      .catch(err => showError(err.message))
  })

  return watchedState
}
