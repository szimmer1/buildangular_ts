/// <reference path="../typings/tsd.d.ts" />

'use strict';

import _ = require('lodash');

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

interface EvalFn {
    (scope: Scope, passThrough?: any): any;
}

interface EvalObj {
    scope : Scope;
    expr : any;
}

interface ApplyFn {
    (scope: Scope): void;
}

export class Scope {
    /**
     * Class members
     */
    private $$watchers : WatchObj[];
    private $$watchInitFn : () => void;
    private $$asyncQueue : EvalObj[];

    /**
     * Ctor
     */
    constructor() {
        this.$$watchers = [];
        this.$$asyncQueue = [];
        this.$$watchInitFn = function() {};
    }

    /**
     * Private fns
     */
    private $$areEqual(val1: any, val2: any, valueEq?: boolean) : boolean {
        if (valueEq) {
            return _.isEqual(val1,val2);
        }
        else {
            return val1 === val2 || (val1 !== val1 && val2 !== val2); // accounts for case val1 = val2 = NaN
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
            if (!self.$$areEqual(oldVal, newVal, watcher.valueEq)) {
                watcher.last = watcher.valueEq ? _.cloneDeep(newVal) : newVal;
                watcher.listenerFn(newVal,
                    (oldVal === self.$$watchInitFn ? newVal : oldVal),
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
        var self = this;

        var watcher: WatchObj = {
            watchFn: watchFn,
            listenerFn: listenerFn || function() {},
            valueEq: !!valueEq,
            last: self.$$watchInitFn
        };

        this.$$watchers.push(watcher);
    }

    $digest(): void {
        var TTL: number = 10;
        var dirty: boolean;
        do {
            while (this.$$asyncQueue.length > 0) {
                var asyncTask = this.$$asyncQueue.shift();
                asyncTask.scope.$eval(asyncTask.expr);
            }
            if (TTL < 1) throw new Error("$digest TTL reached");
            dirty = this.$$digestOnce();
        } while (dirty && TTL--);
    }

    $eval(evalFn : EvalFn, passThrough? : any) : any {
        var self = this;

        return evalFn(self,passThrough);
    }

    $evalAsync(expr : any) : void {
        this.$$asyncQueue.push({scope: this, expr: expr})
    }

    $apply(applyFn : ApplyFn) : void {
        try {
            this.$eval(applyFn);
        } finally {
            this.$digest();
        }
    }
}
