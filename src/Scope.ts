/// <reference path="../typings/tsd.d.ts" />

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
    valueEq: boolean;
    last: any;
}

class Scope {
    /**
     * Class members
     */
    private $$watchers : WatchObj[];

    /**
     * Ctor
     */
    constructor() {
        this.$$watchers = [];
    }

    /**
     * Private fns
     */
    private $$areEqual(val1: any, val2: any, valueEq?: boolean) : boolean {
        if (valueEq) {
            return _.isEqual(val1,val2);
        }
        else {
            return val1 === val2;
        }
    }

    private $$digestOnce() : boolean {
        var self: Scope = this,
            oldVal: any,
            newVal: any;
        var dirty: boolean = false;

        self.$$watchers.forEach(function(watcher) {
            oldVal = watcher.last;
            newVal = watcher.watchFn(self);
            if (oldVal !== newVal) {
                watcher.last = newVal;
                watcher.listenerFn(newVal,
                    (oldVal !== oldVal ? newVal : oldVal),
                        self);
                dirty = true;
            }
        });

        return dirty;
    }

    /**
     * Public fns
     */
    $watch(watchFn : WatchFn, listenerFn : ListenerFn, valueEq?: boolean) : void {
        var watcher: WatchObj = {
            watchFn: watchFn,
            listenerFn: listenerFn || function() {},
            valueEq: !!valueEq,
            last: NaN
        };

        this.$$watchers.push(watcher);
    }

    $digest(): void {
        var TTL: number = 10;
        var dirty: boolean;
        do {
            if (TTL < 1) throw new Error("$digest TTL reached");
            dirty = this.$$digestOnce();
        } while (dirty && TTL--);
    }
}
