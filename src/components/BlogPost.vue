<template>
  <transition name="post">
    <article v-if="allReady" class="post">
      <header class="post__header">
        <h2 class="post__title">{{ title }}</h2>

        <h3 class="post__meta"><router-link class="post__tag"
          :to="`/topic/${kebabify(tag)}`">{{ tag }}</router-link>
          <span class="post__sep"></span>
          <time>{{ prettyDate(published) }}</time>
        </h3>

        <blockquote class="post__subtitle">{{ description }}</blockquote>
      </header>

      <section class="post__body rte" v-html="content"></section>
    </article>
  </transition>
</template>

<script>
import VueDisqus from 'vue-disqus/VueDisqus'
import { kebabify, prettyDate } from '../helpers'

export default {
  name: 'blog-post',
  resource: 'BlogPost',
  components: { VueDisqus },
  props: { post: String },

  data() {
    return {
      title: '',
      tag: '',
      content: '',
      published: '',
      description: '',
      commentsReady: false,
      ready: false
    }
  },

  computed: {
    allReady() {
      return this.ready && this.post;
    }
  },

  watch: {
    post(to, from) {
      if (to === from || !this.post) return;

      this.commentsReady = false
      this.$getResource('post', to)
        .then(this.showComments)
        .then(() => {
          this.ready = true;
        });
    }
  },

  methods: {
    kebabify,
    prettyDate,
    showComments() {
      // This is injected by prerender-spa-plugin on build time, we don't prerender disqus comments.
      if (window.__PRERENDER_INJECTED &&
          window.__PRERENDER_INJECTED.prerendered) {
        return;
      }

      setTimeout(() => {
        this.commentsReady = true
      }, 1000)
    }
  },

  mounted() {
    if (!this.post) {
      this.ready = true;
      return;
    }

    this.$getResource('post', this.post)
      .then(this.showComments)
      .then(() => {
        this.ready = true;
      });
  }
}
</script>
