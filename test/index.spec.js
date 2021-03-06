/**
 * @jest-environment node
 */
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'
import { JSDOM } from 'jsdom'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null
describe('Index page', () => {
  // Init Nuxt.js and create a server listening on localhost:4000
  beforeEach(async () => {
    const rootDir = resolve(__dirname, '..')
    let config = {}
    try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
    config.rootDir = rootDir // project folder
    config.dev = false // production build
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(4000, 'localhost')
  }, 30000)
  
  // Example of testing only generated html
  test('Route / exits and render HTML', async () => {
    let context = {}
    const { html } = await nuxt.renderRoute('/', context)
    expect(html.includes('Nuxt Chat')).toBeTruthy()
  })

  // Example of testing via dom checking
  test('Route / exits and render HTML with CSS applied', async () => {
    const context = {}
    const { html } = await nuxt.renderRoute('/', context)
    const { window } = new JSDOM(html).window
    const element = window.document.querySelector('.red')
    expect(element).not.toBeNull()
    expect(element.textContent).toEqual('Nuxt Chat')
    expect(element.className).toEqual('red')
    expect(window.getComputedStyle(element).color).toEqual('red')
  })

  // Close server and ask nuxt to stop listening to file changes
  afterEach(() => {
    nuxt.close()
  })
})
