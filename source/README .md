# Vue with TDD

Working on the course from Udemy here

## Project setup
```
npm install
```

#### Add to package.json:
```
  "jest": {
    "moduleFileExtensions": [
      "js",
      "vue"
    ],
    "transform": {
      ".*\\.(vue)$": "@vue/vue3-jest",
      ".*\\.(js)$": "babel-jest"
    },
    "testEnvironment": "jsdom",
    "testEnvironmentOptions": {
      "customExportConditions": ["node", "node-addons"]
    }
  }
```
and:
```
  "scripts": {
    // ...
    "test": "jest --watch"
  },
```

#### Add to .eslintrc.js:
```
env: {
  // ...
  jest: true, 
},
```

#### Dependencies(just in case)
```
npm install --save-dev jest babel-jest @vue/vue3-jest@28 jest-environment-jsdom 
npm install --save-dev @testing-library/vue @testing-library/user-event @testing-library/jest-dom
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
