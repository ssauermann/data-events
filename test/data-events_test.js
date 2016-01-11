( function( $ ) {
    "use strict";
    /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
    */

    module( "jQuery#data_events", {
        setup: function() {
            this.svg = $( "svg" );
        }
    } );

    test( "is chainable", function() {
        ok( $( "svg" ).dataevent( "activate", "test" ).addClass( "testing" ), "can be chained" );

    } );

}( jQuery ) );
