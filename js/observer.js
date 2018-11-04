class Observer {
    constructor(data) {
        this.data = data
        this.init()
    }
    init() {
        this.walk(this.data)
    }
    walk(data) {
        const self = this
        const keys = Object.keys(data)
        keys.forEach((key) => {
            // 分别取监听每一个属性的变化，每一个属性单独维护一个 dep
            // 每个 dep 有一个 watcher list
            // 属性的改变会使得 watcher list 里面的每一个 watcher update
            self.convert(key, data[key])
        })
    }
    convert(key, val) {
        this.defineReactive(this.data, key, val)
    }
    defineReactive(data, key, val) {
        const dep = new Dep()
        let childObj = observe(val)

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: () => {
                if (Dep.target) {
                    dep.depend()
                }
                return val
            },
            set: (newVal) => {
                if (newVal === val) {
                    return
                }
                val = newVal
                childObj = observe(newVal)
                dep.notify()
            },
        })
    }
}

const observe = (val, vm) => {
    if (!val || typeof val !== 'object') {
        return
    }
    return new Observer(val)
}

let uid = 0

class Dep {
    constructor() {
        this.id = uid++
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if (index > -1) {
            this.subs.splice(index, 1)
        }
    }
    depend() {
        // Dep.target 是一个 watcher
        Dep.target.addDep(this)
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update()
        })
    }
}

// Dep.target = null
