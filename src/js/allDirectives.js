import copy from './cpopyDirectives';
import debounce from './debounceDirectives';
import emoji from './emojiDirectives';
import lazyload from './lazyloadDirectives';
import longpress from './longpressDirectives';

const directives={
  copy,
  debounce,
  emoji,
  lazyload,
  longpress,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}