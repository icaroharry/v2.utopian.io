describe('MainLayout.vue', () => {
  it('Has a title that is the name', () => {
    browser.url(`/en`)
    const title = browser.getTitle()
    expect(title).toBe('Utopian')
  })
})

