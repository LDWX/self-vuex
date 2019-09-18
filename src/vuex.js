'use strict'

let Vue = null
const myforEach = (obj, callback) => {
  Object.keys(obj).forEach(key => callback(key, obj[key]))
}

class Store {
  constructor(options) {
    let { state = {}, getters = {}, actions = {}, mutations = {} } = options
    this.getters = {}
    this.mutations = {}
    this.actions = {}

    console.log('state: ', state)
    this._vm = new Vue({
      data: {
        state
      }
    })

    this.modules = new ModulesCollections(options)
    console.log('modules: ', this.modules)

    installModules(this, state, [], this.modules.root)

    const {commit, dispatch} = this
    this.commit = type => {
      commit.call(this, type)
    }
    this.dispatch = type => {
      dispatch.call(this, type)
    }
  }

  get state() {
    return this._vm.state
  }

  commit(type) {
    this.mutations[type].forEach( fn => fn())
  }
  dispatch(type) {
    this.actions[type].forEach( fn => fn())
  }

  test() {
    console.log('this is test')
  }
}


class ModulesCollections {
  constructor(options) {
    this.register([], options)
  }
  register(path, rawModule) {
    let newModule = {
      _raw: rawModule,
      _children: {},
      state: rawModule.state
    }
    debugger
    if(path.length === 0) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce( (root, current) => {
        return root._children[current]
      }, this.root)
      parent._children[path[path.length - 1]] = newModule
    }
    if(rawModule.modules) {
      myforEach(rawModule.modules, (childName, module) => {
        this.register(path.concat(childName), module)
      })
    }
  }
}

function installModules(store, rootState, path, rootModule) {
  if (path.length) {
    let parent = path.slice(0, -1).reduce( (root, current) => {
      return root[current]
    }, rootState)

    Vue.set(parent, path[path.length - 1], rootModule.state)
  }
  //设置getter
  if (rootModule._raw.getters) {
    myforEach(rootModule._raw.getters, (getterName, getterFn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => getterFn(rootModule.state)
      })
    })
  }
  //在根模块设置actions
  if(rootModule._raw.actions) {
    myforEach(rootModule._raw.actions, (actionName, actionFn) => {
      let entry = store.actions[actionName] || (store.actions[actionName] = [])
      entry.push(() => {
        const commit = store.commit
        const state = rootModule.state
        actionFn.call(store, {state, commit})
      })
    })
  }
  //在根模块设置mutaions
  if(rootModule._raw.mutations) {
    myforEach(rootModule._raw.mutations, (mutationName, mutationFn) => {
      let entry = store.mutations[mutationName] || (store.mutations[mutationName] = [])
      entry.push(() => {
        mutationFn.call(store, rootModule.state)
      })
    })
  }

  myforEach(rootModule._children, (childName, module) => {
    installModules(store, rootState, path.concat(childName), module)
  })
}



const install = _Vue => {
  if (Vue === _Vue) {
    return
  }
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if(this.$options && this.$options.store) {
        this.$store = this.$options.store
      }else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    }
  })
}

export default {install, Store}