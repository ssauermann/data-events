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

    var dom;

    module( "jQuery#dataevent", {
        setup: function() {
            dom = $( "#test-dataevent" );
        }
    } );

    test( "is chainable", function() {
        ok(
            dom.find( ".chain" ).dataevent( "activate", "test" ).addClass( "testing" ),
            "can be chained"
        );
    } );

    test( "can be called on some parent of data-at selector", function() {
        ok(
            dom.find( ".parentAt" ).dataevent( "activate", 90 ),
            "event is not failing"
        );
        notEqual(
            dom.find( ".parentAt circle" ).attr( "r" ),
            40,
            "value was changed"
        );
    } );

    test( "can be called on object with data-at selector", function() {
        ok(
            dom.find( ".directAt" ).dataevent( "activate", 90 ),
            "event is not failing"
        );
        notEqual(
            dom.find( ".directAt circle" ).attr( "r" ),
            40,
            "value was changed"
        );
    } );

    test( "direct value handler", function() {
        ok(
            dom.find( ".directValueSvg" ).dataevent( "activate", 50 ),
           "event without event handler is working"
        );
        equal(
            dom.find( ".directValueSvg circle" ).attr( "r" ),
            50,
            "value was set correctly"
        );
    } );

    test( "discrete value handler", function() {
        ok(
            dom.find( ".discreteValueSvg" ).dataevent( "activate", "on" ),
           "event with discrete event handler is working"
        );
        equal(
            dom.find( ".discreteValueSvg circle" ).attr( "fill" ),
            "green",
            "value was set correctly"
        );
        ok(
            dom.find( ".discreteValueSvg" ).dataevent( "activate", "off" ),
           "event with discrete event handler is working"
        );
        equal(
            dom.find( ".discreteValueSvg circle" ).attr( "fill" ),
            "red",
            "value was set correctly"
        );
    } );

    test( "functional value handler", function() {
        ok(
            dom.find( ".functionalValueSvg" ).dataevent( "activate", 120 ),
           "event with functional event handler is working"
        );
        equal(
            dom.find( ".functionalValueSvg circle" ).attr( "fill-opacity" ),
            0.2,
            "value was set correctly"
        );
    } );

    test( "multiple events", function() {
        ok(
            dom.find( ".multipleEventsSvg" ).dataevent( "activate", 50 ),
           "first event is working"
        );
        equal(
            dom.find( ".multipleEventsSvg circle" ).attr( "r" ),
            50,
            "value was set correctly"
        );
        ok(
            dom.find( ".multipleEventsSvg" ).dataevent( "other", 60 ),
           "second event is working"
        );
        equal(
            dom.find( ".multipleEventsSvg circle" ).attr( "r" ),
            60,
            "value was set correctly"
        );
    } );

    test( "cross reference", function() {
        ok(
            dom.find( ".crossReferenceSvg" ).dataevent( "activate", "on" ),
           "event is working"
        );
        equal(
            dom.find( ".crossReferenceSvg .orig" ).attr( "fill" ),
            "green",
            "value was set correctly for original circle"
        );
        equal(
            dom.find( ".crossReferenceSvg .ref" ).attr( "fill" ),
            "green",
            "value was set correctly for referencing circle"
        );
    } );

    test( "expected exceptions for invalid arguments", function() {
        throws(
            function() {
                dom.find( ".chain" ).dataevent( 15, "Hello" );
            },
            TypeError,
            "Exception: name is no string"
        );
    } );

    //--------------------------------------------------------------------------------------------

    module( "jQuery#dataevent-next", {
        setup: function() {
            dom = $( "#test-dataevent-next" );
        }
    } );

    test( "is chainable", function() {
        ok(
            dom.find( ".chain" ).dataevent( "activate" ).addClass( "testing" ),
            "can be chained"
        );
    } );

    test( "direct value cycle (on/off)", function() {
        ok(
            dom.find( ".directValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        notStrictEqual(
            typeof( dom.find( ".directValueSvg circle" ).attr( "hidden" ) ),
            "undefined",
            "attribute hidden is set"
        );
        ok(
            dom.find( ".directValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        strictEqual(
            typeof( dom.find( ".directValueSvg circle" ).attr( "hidden" ) ),
            "undefined",
            "attribute hidden is not set"
        );
    } );

    test( "discrete value cycle (permutation)", function() {
        ok(
            dom.find( ".discreteValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        equal(
            dom.find( ".discreteValueSvg circle" ).attr( "fill" ),
            "green",
            "attribute is set to green"
        );
        ok(
            dom.find( ".discreteValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        equal(
            dom.find( ".discreteValueSvg circle" ).attr( "fill" ),
            "red",
            "attribute is set to red"
        );
        ok(
            dom.find( ".discreteValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        equal(
            dom.find( ".discreteValueSvg circle" ).attr( "fill" ),
            "green",
            "attribute is set to green"
        );
    } );

    test( "functional value cycle (function call)", function() {
        ok(
            dom.find( ".functionalValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        equal(
            dom.find( ".functionalValueSvg circle" ).attr( "fill-opacity" ),
            "0.3",
            "attribute was incremented by 0.1"
        );
        ok(
            dom.find( ".functionalValueSvg" ).dataevent( "activate" ),
            "event is working"
        );
        equal(
            dom.find( ".functionalValueSvg circle" ).attr( "fill-opacity" ),
            "0.4",
            "attribute was incremented by 0.1"
        );
    } );

}( jQuery ) );
