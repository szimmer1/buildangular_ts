describe('Scope tests', function() {

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
            var listenerFn = jasmine.createSpy();
            scope.propA = "foo";

            scope.$watch(function(scope) {
                return scope.propA;
            }, listenerFn);

            scope.$digest();

            expect(listenerFn).not.toHaveBeenCalled();

            scope.propA = "bar";

            scope.$digest();

            expect(listenerFn).toHaveBeenCalled();
        });

    })

});