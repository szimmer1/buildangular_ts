describe('Scope', function() {

    it('should make a Scope object', function() {
        var scope = new Scope();
        scope.propertyA = "foobar";

        expect(scope.propertyA).toBe("foobar");
    });

    describe('digest', function() {

        var scope;

        beforeEach(function() {
            scope = new Scope();
        });

        it('calls listener fn of a watch on first $digest', function() {
            var watchFn = function() { return 'wat'; };
            var listenerFn = jasmine.createSpy();
            scope.$watch(watchFn, listenerFn);

            scope.$digest();

            expect(listenerFn).toHaveBeenCalled();
        });

        it('calls the watch fn with scope as arg', function() {
            var watchFn = jasmine.createSpy();
            scope.$watch(watchFn, function() { });

            scope.$digest();

            expect(watchFn).toHaveBeenCalledWith(scope);
        });

        it('only calls the listener fn when watch is dirty', function() {
            var counter = 0;
            scope.propA = "foo";

            scope.$watch(function(scope) {
                return scope.propA;
            }, function() {
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

        it('first oldVal of watch shouldn\'t be NaN', function() {
            var oldVal;
            scope.propA = "foobar";

            scope.$watch(
                function(scope) {return scope.propA;},
                function(newVal, old, scope) {oldVal = old;}
            );

            scope.$digest();
            expect(oldVal).toBe("foobar");
        });

        it('can have a watch w/o listenerFn', function() {
            var watchFn = jasmine.createSpy();

            scope.$watch(watchFn);
            scope.$digest();

            expect(watchFn).toHaveBeenCalled();
        });

        it('should dirty check scope properties that are modified in listener fns', function() {
            scope.name = "Shahar Zimmerman";

            scope.$watch(function(scope) {
                return scope.firstName;
            }, function(n) {
                if (n) scope.initial = n.charAt(0) + '.';
            });

            scope.$watch(function(scope) {
                return scope.name;
            }, function(n) {
                scope.firstName = n.slice(0, scope.name.indexOf(' '))
            });

            scope.$digest();
            expect(scope.initial).toBe("S.");
        });

        it('should kill a circular $digest loop after 10 iterations', function() {
            var counter = 0;

            scope.$watch(function(scope) {
                return scope.A;
            }, function() {
                scope.B++
            });

            scope.$watch(function(scope) {
                return scope.B;
            }, function() {
                scope.A++;
            });

            expect((function() { scope.$digest(); })).toThrow();
        });

        it('should watch arrays and objects if 3rd arg is truthy', function() {
            var counter = 0;
            scope.A = [1,2,4];

            scope.$watch(function(scope) {
                return scope.A;
            }, function(n) {
                counter++;
            }, true);

            scope.$digest();
            expect(counter).toBe(1);

            scope.A.push(3);

            scope.$digest();
            expect(counter).toBe(2);
        })
    })

});