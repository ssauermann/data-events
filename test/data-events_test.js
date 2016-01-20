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

    module( "jQuery#dataevent", {
        setup: function() {

            //Nothing to do right now
        }
    } );

    test( "is chainable", function() {
        ok( $( "#chain" ).dataevent( "activate", "test" ).addClass( "testing" ), "can be chained" );
    } );

    test( "can be called on some parent of data-at selector", function() {
        ok( $( "#parentAt" ).dataevent( "activate", 90 ), "event is not failing" );
        notEqual( $( "#parentAt circle" ).attr( "r" ), 40, "value was changed" );
    } );

    test( "can be called on object with data-at selector", function() {
        ok( $( "#directAt" ).dataevent( "activate", 90 ), "event is not failing" );
        notEqual( $( "#directAt circle" ).attr( "r" ), 40, "value was changed" );
    } );

    test( "direct value handler", function() {
        ok( $( "#directValueSvg" ).dataevent( "activate", 50 ),
           "event without event handler is working" );
        equal( $( "#directValueSvg circle" ).attr( "r" ), 50,
              "value was set correctly" );
    } );

    test( "discrete value handler", function() {
        ok( $( "#discreteValueSvg" ).dataevent( "activate", "on" ),
           "event with discrete event handler is working" );
        equal( $( "#discreteValueSvg circle" ).attr( "fill" ), "green", "value was set correctly" );
        ok( $( "#discreteValueSvg" ).dataevent( "activate", "off" ),
           "event with discrete event handler is working" );
        equal( $( "#discreteValueSvg circle" ).attr( "fill" ), "red", "value was set correctly" );
    } );

    test( "functional value handler", function() {
        ok( $( "#functionalValueSvg" ).dataevent( "activate", 120 ),
           "event with functional event handler is working" );
        equal( $( "#functionalValueSvg circle" ).attr( "fill-opacity" ), 0.2,
              "value was set correctly" );
    } );

    test( "multiple events", function() {
        ok( $( "#multipleEventsSvg" ).dataevent( "activate", 50 ),
           "first event is working" );
        equal( $( "#multipleEventsSvg circle" ).attr( "r" ), 50,
              "value was set correctly" );
        ok( $( "#multipleEventsSvg" ).dataevent( "other", 60 ),
           "second event is working" );
        equal( $( "#multipleEventsSvg circle" ).attr( "r" ), 60,
              "value was set correctly" );
    } );

    test( "cross reference", function() {
        ok( $( "#crossReferenceSvg" ).dataevent( "activate", "on" ),
           "event is working" );
        equal( $( "#crossReferenceSvg .orig" ).attr( "fill" ), "green",
              "value was set correctly for original circle" );
        equal( $( "#crossReferenceSvg .ref" ).attr( "fill" ), "green",
              "value was set correctly for referencing circle" );
    } );

}( jQuery ) );
