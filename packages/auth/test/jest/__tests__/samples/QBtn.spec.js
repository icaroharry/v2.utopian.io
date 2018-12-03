import { mount, createLocalVue } from '@vue/test-utils'
import QBUTTON from './QBtn-demo.vue'
import Quasar, { Qbtn } from 'quasar'

describe('Render, build and wire up a quasar component', () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, { components: ['QBtn']})
  const wrapper = mount(QBUTTON, {
    localVue
  })
  const vm = wrapper.vm

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('has a created hook', () => {
    expect(typeof vm.increment).toBe('function')
  })

  it('sets the correct default data', () => {
    expect(typeof vm.counter).toBe('number')
    const defaultData = QBUTTON.data()
    expect(defaultData.counter).toBe(0)
  })

  it('correctly updates data when button is pressed', () => {
    // technically this is an integration test
    // but could also be seen as "proof that the button was created" and works correctly
    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.counter).toBe(1)
  })
})






/* eslint-disable */
/**
 * @jest-environment jsdom
 */
/*
import { mountQuasar } from '~/test/jest/utils'
import QBUTTON from './QBtn-demo.vue'
import { QBtn } from 'quasar'


describe('Render, build and wire up a quasar component', () => {
  const wrapper = mountQuasar(QBUTTON, {
    components: ['QBtn']
  })
  const vm = wrapper.vm

  it('inits', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('has a created hook', () => {
    expect(typeof vm.increment).toBe('function')
  })

  it('sets the correct default data', () => {
    expect(typeof vm.counter).toBe('number')
    const defaultData = QBUTTON.data()
    expect(defaultData.counter).toBe(0)
  })

  it('correctly updates data when button is pressed', () => {
    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.counter).toBe(1)
  })
})
*/
