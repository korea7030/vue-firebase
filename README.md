# vue-firebase

## project start
```bash
$ yarn serve
```

## project build
```bash
$ yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## algolia
```bash
$ firebase functions:config:set algolia.app_id=yourAppId algolia.api_key=yourAdminKey algolia.search_key=SearchKey
```

### serve
```bash
$ firebase functions:config:get > .runtimeconfig.json
$ firebase serve
```

## algolia search key

**.env.local**
```
VUE_APP_ALGOLIA_APP_ID=your-id
VUE_APP_ALGOLIA_SEARCH_KEY=your-search-key
```