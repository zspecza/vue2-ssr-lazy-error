import app from './app'

export default (context) => {
  // using app.$router instead of importing router itself works
  // (not sure why the hacker-news example imports the router module instead...)
  app.$router.push(context.url)
  return Promise.resolve(app)
}
