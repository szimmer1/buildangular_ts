'use strict';

interface WatchFn {
    (scope: Scope): void;
}

interface ListenerFn {
    (newValue?: any, oldValue?: any, scope?: Scope): void;
}

interface WatchObj {
    watchFn: WatchFn;
    listenerFn: ListenerFn;
    last: any;
}

class Scope {
    private $$watchers : WatchObj[];

    constructor() {
        this.$$watchers = [];
    }

    $watch(watchFn : WatchFn, listenerFn : ListenerFn) : void {
        var self: Scope = this;

        var watcher: WatchObj = {
            watchFn: watchFn,
            listenerFn: listenerFn,
            last: listenerFn(self)
        };
        this.$$watchers.push(watcher);
    }

    $digest() : void {
        var self: Scope = this,
            oldVal: any,
            newVal: any;

        self.$$watchers.forEach(function(watcher) {
            oldVal = watcher.last;
            newVal = watcher.watchFn(self);
            if (oldVal !== newVal) {
                oldVal = newVal;
                watcher.listenerFn();
            }
        })
    }
}
