<script>
// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
// import { required } from 'vuelidate/lib/validators'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import { mapActions } from 'vuex'
import { get, map } from 'lodash'
import ace from 'brace'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { render } from 'src/services/common/markdown/markdown'
import UPostPreview from 'src/components/post-preview/post-preview'

// edit contribution component.
export default {

  // component name.
  name: 'u-page-edit',

  // children components.
  components: {
    UPostPreview,
    ULayoutPage,
    UFileUploader
  },

  // component data.
  data () {
    return {
      // errors list (API returned, not frontend UX helper).
      errors: {},
      // temporary field for the repository selector field.
      projectSelector: null,
      // contribution data.
      contribution: {
        category: 'development',
        title: '',
        body: '',
        projectId: null,
        rewards: [0.5, 0.5],
        tags: []
      },
      editor: null,
      contentBackup: '',
      // rendered contribution preview (html).
      preview: null,
      // loading state indicator.
      loading: false,
      body: ''
    }
  },

  // component methods.
  methods: {

    // map steem store actions.
    ...mapActions('steem', [
      'updateComment'
    ]),

    // map contributions store actions.
    ...mapActions('contributions', [
      'getContribution',
      'searchGithubRepository'
    ]),

    // broadcast (save) the contribution / post on the blockchain.
    saveContribution () {
      return this.updateComment({
        title: get(this.contribution, 'title', null),
        content: get(this.contribution, 'body', ''),
        tags: get(this.contribution, 'tags', []),
        meta: {
          category: get(this.contribution, 'category', 'development'),
          projectId: get(this.contribution, 'projectId', null)
        }
      }).catch()
    },

    loadContribution () {
      // get author and permlink from route.
      const author = get(this.$route.params, 'author')
      const permlink = get(this.$route.params, 'permlink')

      // get contribution data from database.
      return this.getContribution({ author, permlink })
        .then((contributionData) => {
          // assign title.
          this.contribution.title = contributionData.title
          // assign contribution body.
          this.contribution.body = contributionData.body
          // contribution tags.
          this.contribution.tags = contributionData.tags
          // resolve the promise.
          return Promise.resolve(contributionData)
        })
    },

    // search github for repositories matching a given query.
    searchGithubRepos (query, done) {
      this.searchGithubRepository(query).then(done)
    },

    categoryOptions () {
      return map(categoryOptions, (option) => {
        option.label = option.label.toUpperCase()
        return option
      })
    },

    // set repository ID on the contribution data.
    setRepository (repository) {
      this.contribution.projectId = get(repository, 'id', null)
    }
  },

  // computed properties.
  computed: {

    // @TODO remove this.
    slug () {
      return this.slugify(this.project.name)
    },

    // categories list.
    categories () {
      return categories
    },

    editorStyle () {
      if (!this.isMobile && this.screenWidth > 992) {
        return {}
      }

      if (this.isMobile) {
        return {
          'height': (this.screenHeight - 62 - 48 - 30) + 'px',
          'max-height': (this.screenHeight - 62 - 48 - 30) + 'px',
          'overflow-y': 'auto'
        }
      }
    }
  },

  beforeDestroy () {
    this.editor.destroy()
    this.editor.container.remove()
  },

  mounted () {
    // load contribution from database.
    this.loadContribution()
      .then(contributionData => {
        // require a ton of plugins to initialize ace.
        require('emmet-core/emmet')
        require('brace/ext/emmet')
        require('brace/ext/language_tools')
        require('brace/ext/textarea')
        require('brace/mode/html')
        require('brace/mode/php')
        require('brace/mode/javascript')
        require('brace/mode/markdown')
        require('brace/theme/chrome')
        require('brace/ext/statusbar')
        require('brace/ext/searchbox')
        require('brace/ext/settings_menu')
        require('brace/ext/modelist')

        // create an ace editor instance.
        const editor = this.editor = ace.edit('editor-container')

        // Markdown snippets
        // @TODO needs refactor to a separate module.
        ace.define('ace/snippets/markdown', ['require', 'exports', 'module'], function (e, t, n) {
          'use strict'
          /* eslint-disable-next-line */
          t.snippetText = '# Markdown\nsnippet link\n\t[${1:text}](https://${2:address})\nsnippet image\n\t![${1:description}](https://${2:address})\n\nsnippet bold\n\t**${1:text}**\n\nsnippet code\n\t```${1:lang}\n\t${2:code}\n\t```\n\n'
          t.scope = 'markdown'
        })

        // editor scroll style.
        editor.$blockScrolling = Infinity
        // set markdown as the language for the editor.
        editor.getSession().setMode('ace/mode/markdown')
        // set chrome as the color theme.
        editor.setTheme('ace/theme/chrome')
        // init the editor content.
        editor.setValue(this.contribution.body, 1)

        // listen for editor changes, to update the preview.
        editor.on('change', () => {
          // assign the editor content as body.
          this.body = editor.getValue()
        })

        // set editor style options.
        editor.setOptions({
          fontFamily: 'Roboto Mono',
          fontSize: '12pt',
          showLineNumbers: true,
          // completion features are temporary disabled.
          enableEmmet: true,
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: false
        })
      })
  },

  // watch for body changes, to trigger rending the preview.
  watch: {
    body () {
      return render(this.body).then((result) => {
        this.preview = result
        return Promise.resolve(result)
      })
    }
  }
}
</script>

<style lang="stylus" src="./edit.styl"></style>

<template lang="pug" src="./edit.pug"></template>
