class EventListenerManifest {
  constructor(logHistory){
    this._listeners = [];
    this._config = {
      logHistory: false
    };
    if (typeof logHistory === 'boolean'){
      this._config.logHistory = logHistory;
    }
    if (this._config.logHistory){
      this._history = [];
      this.printHistory = () => {
        this.history.forEach(log => {
          console.log(`[${log.timestamp.toTimeString().split(' ')[0]}] ${log.action.toUpperCase()}: ${log.listener.name} (on${log.listener.event})`)
        });
      }
    }
  }

  get list() {
    return this._listeners.slice();
  }
  get history() {
    return this._config.logHistory ? this._history.slice() : undefined;
  }

  add(name, elem, ev, cb){
    if (name === undefined || elem === undefined || ev === undefined || cb === undefined) {
      throw new Error('EventListenerManifest.addListener requires 4 arguments: name:String, element:HTMLElement, event:String, callback:function')
    }
    // ev = event name (e.g. click, mouseover, keydown, scroll, wheel)
    // cb = function to call on event trigger

    // check if name already exists, continue if name is unique
    if (this._listeners.some(l => l.name === name)) {
      console.error(`EventListenerManifest: Listener name '${name}' already exists.`)
    } else {
      const listener = this._newListener(name, elem, ev, cb);
      if (this._config.logHistory){
        this._history.push(this._newLog('add', listener));
      }
      this._listeners.push(listener);
      elem.addEventListener(ev, cb);
    }
  }

  remove(name){
    const search = this._listeners.filter(l => l.name === name);
    if (search.length > 0){
      const listener = search[0];
      if (this._config.logHistory){
        this._history.push(this._newLog('del', listener));
      }
      listener.element.removeEventListener(listener.event, listener.callback);
      this._listeners.splice(this._listeners.indexOf(listener), 1);
    } else {
      console.error(`EventListenerManifest: Listener name '${name}' does not exist`);
    }
  }

  // HELPERS

  _newListener(name, elem, ev, cb) {
    return {
      name,
      element: elem,
      event: ev,
      callback: cb
    }
  }

  _newLog(action, listener) {
    return {
      action,
      listener,
      timestamp: new Date()
    }
  }
}

module.exports = EventListenerManifest;
