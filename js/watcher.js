class Watcher {
    constructor(vm, expOrFn, cb) {
        this.cb = cb
        this.vm = vm
        this.expOrFn = expOrFn
        this.depIds = {}
        this.getter = typeof expOrFn === 'function' ? expOrFn : this.parseGetter(expOrFn)
        this.value = this.get()
    }
    update() {
        this.run()
    }
    run() {
        let value = this.get()
        let oldVal = this.value
        if (value !== oldVal) {
            this.value = value
            this.cb.call(this.vm, value, oldVal)
        }
    }
    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this)
            this.depIds[dep.id] = dep
        }
    }
    get() {
        // 通过属性的 getter ，向 dep 里面添加 watcher
        // target 相当于是否添加的开关
        Dep.target = this
        let value = this.getter.call(this.vm, this.vm)
        Dep.target = null
        return value
    }
    parseGetter(exp) {
        if (/[^\w.$]/.test(exp)) {
            return
        }
        let exps = exp.split('.')
        let fn = function (obj) {
            for (let i = 0, len = exps.length; i < len; i++) {
                if (!obj) {
                    return
                }
                obj = obj[exps[i]]
            }
            return obj
        }
        return fn
    }
}