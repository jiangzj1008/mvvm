class MVVM {
    constructor(options) {
        this.$options = options || {}
        this._data = this.$options.data
        let me = this
        let keys = Object.keys(this._data)
        keys.forEach(function(key) {
            // 通过 vm.xxx 来获取 vm._data.xxx
            me._proxyData(key)
        })
        this._initComputed()
        observe(this._data, this)
        this.$compile = new Compile(options.el || document.body, this)
    }
    $watch(key, cb, options) {
        new Watcher(this, key, cb)
    }
    _proxyData(key, setter, getter) {
        let me = this
        setter = setter ||
            Object.defineProperty(me, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return me._data[key]
                },
                set: function proxySetter(newVal) {
                    me._data[key] = newVal
                }
            })
    }
    _initComputed() {
        let me = this
        let computed = this.$options.computed
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function() {}
                })
            })
        }
    }
}