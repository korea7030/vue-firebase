# vue-firebase

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
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