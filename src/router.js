import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// importing views synchronously works...

import Home from './views/Home.vue'
import Foo from './views/Foo.vue'

// ...importing asynchronously to enable webpack code-splitting (i.e. lazy loading), however, does not work.
// all three of the below methods trigger the error: "module ./[id].server.js not found"
// (which is confusing, since both the server.js and renderer.js files are compiled to the same directory
// as the lazy chunks - so in theory it *should* be able to find those modules)
// these methods are described at https://router.vuejs.org/en/advanced/lazy-loading.html and http://vuejs.org/guide/components.html#Async-Components
// (remember to comment the manual imports above if uncommenting any of the following lines)

// const Home = () => System.import('./views/Home.vue')
// const Foo = () => System.import('./views/Foo.vue')

// const Home = (resolve) => require(['./views/Home.vue'], resolve)
// const Foo = (resolve) => require(['./views/Foo.vue'], resolve)

// const Home = (resolve) => {
//   require.ensure(['./views/Home.vue'], () => {
//     resolve(require('./views/Home.vue'))
//   })
// }
//
// const Foo = (resolve) => {
//   require.ensure(['./views/Foo.vue'], () => {
//     resolve(require('./views/Foo.vue'))
//   })
// }

// the following method of SSR lazy-loading sort of works - specifying a *boolean* variable
// definition in the webpack config using DefinePlugin to determine whether we're
// on the client or server - if we're in the server context, we don't split the chunk
// but despite rendering both client-side and server-side UI without an issue, vue bails hydration
// because of a DOM/VNode mismatch

// const Home = BROWSER_BUILD ? () => System.import('./views/Home.vue') : require('./views/Home.vue')
// const Foo = BROWSER_BUILD ? () => System.import('./views/Foo.vue') : require('./views/Foo.vue')

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: Home
  }, {
    path: '/foo',
    component: Foo
  }]
})
