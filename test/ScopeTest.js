var Scope = require('../js/Scope.js').Scope;

describe('Scope', function() {

    it('should make a Scope object', function () {
        var scope = new Scope();
        scope.propertyA = "foobar";

        expect(scope.propertyA).toBe("foobar");
    });

    describe('digest', function () {

        var scope;

        beforeEach(function () {
            scope = new Scope();
        });

        it('calls listener fn of a watch on first $digest', function () {
            var watchFn = function () {
                return 'wat';
            };
            var listenerFn = jasmine.createSpy();
            scope.$watch(watchFn, listenerFn);

            scope.$digest();

            expect(listenerFn).toHaveBeenCalled();
        });

        it('calls the watch fn with scope as arg', function () {
            var watchFn = jasmine.createSpy();
            scope.$watch(watchFn, function () {
            });

            scope.$digest();

            expect(watchFn).toHaveBeenCalledWith(scope);
        });

        it('only calls the listener fn when watch is dirty', function () {
            var counter = 0;
            scope.propA = "foo";

            scope.$watch(function (scope) {
                return scope.propA;
            }, function () {
                counter++;
            });

            scope.$digest();

            expect(counter).toBe(1);

            scope.propA = "bar";

            scope.$digest();

            expect(counter).toBe(2);

            scope.$digest();

            expect(counter).toBe(2);
        });

        it('first oldVal of watch shouldn\'t be NaN', function () {
            var oldVal;
            scope.propA = "foobar";

            scope.$watch(
                function (scope) {
                    return scope.propA;
                },
                function (newVal, old, scope) {
                    oldVal = old;
                }
            );

            scope.$digest();
            expect(oldVal).toBe("foobar");
        });

        it('can have a watch w/o listenerFn', function () {
            var watchFn = jasmine.createSpy();

            scope.$watch(watchFn);
            scope.$digest();

            expect(watchFn).toHaveBeenCalled();
        });

        it('should dirty check scope properties that are modified in listener fns', function () {
            scope.name = "Shahar Zimmerman";

            scope.$watch(function (scope) {
                return scope.firstName;
            }, function (n) {
                if (n) scope.initial = n.charAt(0) + '.';
            });

            scope.$watch(function (scope) {
                return scope.name;
            }, function (n) {
                scope.firstName = n.slice(0, scope.name.indexOf(' '))
            });

            scope.$digest();
            expect(scope.initial).toBe("S.");
        });

        it('should kill a circular $digest loop after 10 iterations', function () {
            var counter = 0;
            scope.A = scope.B = 0;

            scope.$watch(function (scope) {
                return scope.A;
            }, function () {
                scope.B++
            });

            scope.$watch(function (scope) {
                return scope.B;
            }, function () {
                scope.A++;
            });

            expect((function () {
                scope.$digest();
            })).toThrow();
        });

        it('should watch arrays and objects if 3rd arg is truthy', function () {
            var counter = 0;
            scope.A = [1, 2, 4];

            scope.$watch(function (scope) {
                return scope.A;
            }, function (n) {
                counter++;
            }, true);

            scope.$digest();
            expect(counter).toBe(1);

            scope.A.push(3);

            scope.$digest();
            expect(counter).toBe(2);
        });

        it('should not detect NaN as dirty value', function () {
            var counter = 0;
            scope.n = NaN;
            scope.$watch(function (scope) {
                return scope.n;
            }, function (n, o) {
                counter++;
            });

            scope.$digest();
            expect(counter).toBe(1);

            scope.$digest();
            expect(counter).toBe(1);
        });
    });

    describe('$eval', function () {

        var scope, counter;

        beforeEach(function () {
            scope = new Scope();
            counter = 0;
        });

        it('should execute fn on the scope', function () {
            scope.a = 33;
            var res = scope.$eval(function (scope) {
                return scope.a;
            });
            expect(res).toBe(33);
        });

        it('should pass through 2nd arg', function () {
            scope.a = 33;
            var res = scope.$eval(function ($scope, arg) {
                return scope.a + arg;
            }, 2);
            expect(res).toBe(35);
        });
    });

        describe('$apply', function () {

            var scope, counter;

            beforeEach(function () {
                scope = new Scope();
                counter = 0;
            });

            it('should $apply by $eval fn and $digest until clean', function () {
                scope.a = 10;

                scope.$watch(function (scope) {
                    return scope.a;
                }, function (n, o) {
                    counter++;
                });

                scope.$digest();
                expect(counter).toBe(1);

                scope.$apply(function (scope) {
                    scope.a += 1;
                });

                expect(scope.a).toBe(11);
                expect(counter).toBe(2);

            })
        });

        describe('$evalAsync', function() {

            var scope, counter;

            beforeEach(function () {
                scope = new Scope();
                counter = 0;
            });

            it('should not eval immediately', function() {
                var evald = false,
                    evaldImmediate = false;

                scope.A = [1,2,3];
                scope.$watch(function(scope) {
                    return scope.A;
                }, function(n,o,scope) {
                    scope.$evalAsync(function(scope) {
                        evald = true;
                    });
                    evaldImmediate = evald;
                }, true);

                scope.$digest();
                expect(evald).toBe(true);
                expect(evaldImmediate).toBe(false);
            })

        });

});