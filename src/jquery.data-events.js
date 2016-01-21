/**
 * Data events jQuery Plugin.
 *
 * @class DataEvents
 */
( function( $ ) {
    "use strict";

    /*
    Options for current call
    */
    var opts;

    /**
    * Logs an object to the console if debug mode is set via options.
    *
    * @private
    * @method log
    * @param {Object} o - Object to log
    */
    function log ( o ) {
        if ( opts.debug ) {
            console.log( o );
        }
    }

    /**
    * Returns the data/reference id of an element.
    *
    * @private
    * @method getDataId
    * @param {Object} e - DOM element to get the data id from
    * @return {Object} - Data id
    * @example
    *       data-id@='abc12' -> 'abc12'
    */
    function getDataId( e ) {
        return e.data( opts.refAttr );
    }

    //{@name: value1, @other: value2}
    /**
    * Returns a object of all data attributes beginning with an @
    * and their values of a given dom element.
    * This requires jQuery (>=1.4.4).
    *
    * @private
    * @method getAttributes
    * @param {Object} e - DOM element to get the attributes from
    * @return {Object} - Returns all HTML5 custom data attributes as an object:
    * @example
    *       <div id='prod' data-id='10' data-cat='toy' data-cid='42'>Foo bar</div>
    *       -> { "id":10, "cat":"toy", "cid":42 }
    */
    function getAttributes( e ) {

        var dataDict = e.data();

        //Filter data attributes for @ character
        $.each( dataDict, function( key ) {
            if ( key.indexOf( opts.dataPrefix ) !== 0 ) {
                delete dataDict[ key ];
            }
        } );

        return dataDict;

    }

    //[[dom1, {@name: value1}], [dom2, {@name: value2, @other: value3}]]
    /**
    * Returns an array of all @-data attribute objects of each child.
    *
    * @private
    * @method getChildAttributes
    * @param {Object} e - DOM element to get children from
    * @return {Object} - Array with children
    */
    function getChildAttributes( e ) {

        var arry = [];

        e.children().andSelf().each( function() {
            arry.push( [ $( this ), getAttributes( $( this ) ) ] );
        } );

        return arry;

    }

    /**
    * Resolve cross references and validates structure
    *
    * @private
    * @method resolveReference
    * @param {Object} childAttr - references to resolve
    * @return {Object} - resolved references
    */
    function resolveReference( childAttr ) {

        //[[dom1, {@name: value1}], [dom2, {@name: value2, @other: value3}]]
        $.each( childAttr, function( i, arry ) {
            if ( arry.length < 2 ) {
                throw "Missing data: [dom, attribute]";
            }

            //Var dom = arry[0],
              var attr = arry[ 1 ];

            //{@name: value2, @other: value3}
            $.each( attr, function( k, v ) {

                if ( typeof ( v ) !== "object" ) {
                    console.error( attr );
                    throw "Format has to be: data-@name={event, handler}" +
                        "or {id, attribute} for a reference'";
                }

                var cyclicTest = [ v ],

                    /**
                    * Search for reference until finding a non reference.
                    *
                    * @private
                    * @method searchForReference
                    * @param {Object} ref - reference to resolve
                    * @return {Object} - value of resolved reference
                    */
                    searchForReference = function( ref ) {

                        log( "Resolving reference for: " );
                        log( ref );

                        //Filter valid references
                        var validIds = $.grep( childAttr, function( arry ) {

                                var id = getDataId( arry[ 0 ] );
                                return ( id === ref.id );

                            } ),
                            refAttribute;

                        if ( validIds.length === 0 ) {
                            throw "Reference id not found: " + ref.id;
                        }
                        if ( validIds.length > 1 ) {
                            throw "Reference id is ambigous: " + ref.id;
                        }

                        //Get referenced attribute
                        refAttribute = validIds[ 0 ][ 0 ].data( ref.attribute );

                        //Found another reference or am I done?
                        if ( typeof ( refAttribute.event ) !== "undefined" ) {

                            log( "Resolved to: " );
                            log( refAttribute );

                            return refAttribute;
                        }

                        //--> another reference
                        log( refAttribute );

                        //Test for cyclic dependencies
                        if ( $.inArray( refAttribute, cyclicTest ) ) {
                            throw "References are cyclic";
                        }

                        //Continue search
                        searchForReference( refAttribute );
                    };

                //If attribute is a reference
                if ( typeof ( v.event ) === "undefined" ) {

                    //Replace reference with resolved value
                    attr[ k ] = searchForReference( v );
                }

            } );
        } );

        return childAttr;
    }

    /**
    * Handle an event with the given handler and value on an dom.
    *
    * @private
    * @method handleEvent
    * @param {Object} dom - jQuery object of current html element
    * @param {string} attributename - Name of the attribute changing
    * @param {string} event - Name of the triggered event
    * @param {Object} handler - Handler to execute
    * @param {Object} value - Value of the triggered event
    */
    function handleEvent( dom, attributename, event, handler, value ) {
        log( "Handling event:" );
        log( dom );
        log( attributename );
        log( handler );
        log( value );

        var resultValue;

        if ( typeof ( handler ) === "object" ) {
            resultValue = handler[ value ];
        } else if ( typeof ( handler ) === "undefined" ) {
            resultValue = value;
        } else {
            resultValue = eval( "(" + handler + ")" )( event, value );
        }

        if ( typeof ( resultValue ) === "undefined" ) {
            throw "Handler is invalid: " + handler;
        }

        //Camel case format of jquery to dashed format helloWorld -> hello-world
        dom.attr( attributename.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase(), resultValue );
    }

    /**
    * Execute an event with the given value on an dom element.
    *
    * @private
    * @method executeEvent
    * @param {Object} at - jQuery dom to execute on
    * @param {string} event - Name of the triggered event
    * @param {Object} eventValue - Value of the triggered event
    */
    function executeEvent( at, event, eventValue ) {
        log( "Executing event:" );
        log( event );
        log( eventValue );

        //Filter events from each object
        $.each( at, function( i, domAt ) {
            $.each( domAt[ 1 ], function( key, value ) {

                 //Multiple events given as array
                if ( typeof ( value.event ) === "object" ) {
                    $.each( value.event, function( i, val ) {
                        if ( val === event ) {
                            handleEvent( domAt[ 0 ], key.substring( 1 ),
                                        value.event, value.handler, eventValue );
                        }
                    } );
                } else {

                    //Single event given as string
                    if ( value.event === event ) {
                        handleEvent( domAt[ 0 ], key.substring( 1 ),
                                    value.event, value.handler, eventValue );
                    }
                }
            } );
        } );

        /*
        //Remove empty objects
        return $.grep( at, function( o ) {
            return $.isEmptyObject( o );
        } );
        */

    }

    /**
    * Not yet implemented.
    *
    * @private
    * @method executeEventCycle
    * @param {Object} at - jQuery dom to execute on
    * @param {string} event - Name of the triggered event
    */
    function executeEventCycle( at, event ) {
        throw "not yet implemented: " + at + event;
    }

    /**
    * Extends the default options with user defined ones for current method call.
    *
    * @private
    * @method extendOptions
    * @param {Object} options - User defined options
    */
    function extendOptions( options ) {

        //Extending default options with provided ones if necessary
        if ( typeof( options ) !== "undefined" ) {
            opts = $.extend( {}, $.fn.dataevent.defaults, options );
        } else {
            opts = $.fn.dataevent.defaults;
        }
    }

    /**
    * Update all dom elements which should be managed.
    *
    * @method $.fn.dataevent
    * @param {string} event - Name of the triggered event
    * @param {Object} value - Value of the triggered event
    * @param {Object} options - Overwrite default configuration
    * @return {Object} description
    */
    $.fn.dataevent = function( event, value, options ) {

        //Check for valid arguments
        if ( typeof( event ) !== "string" ) {
            throw new TypeError( "Event name has to be a String" );
        }

        if ( typeof( value ) === "undefined" ) {
            throw new TypeError( "An event value has to be supplied." +
                                "To cycle through states use dataevent.next()"
                               );
        }

        extendOptions( options );

        this.find( opts.selector ).andSelf().each( function() {
            executeEvent( resolveReference( getChildAttributes( $( this ) ) ), event, value );
        } );

        return this;
    };

    /**
    * Switch a status of an handler to the next state.
    *
    * @chainable
    * @method $.fn.dataevent.next
    * @param {string} event - Name of the triggered event
    * @param {Object} [options] - Overwrite default configuration
    * @return {Object} description
    */
    $.fn.dataevent.next = function( event, options ) {

        //Check for valid arguments
        if ( typeof( event ) !== "string" ) {
            throw new TypeError( "Event name has to be a String" );
        }

        extendOptions( options );

        this.find( opts.selector ).andSelf().each( function() {
            executeEventCycle( resolveReference( getChildAttributes( $( this ) ) ), event );
        } );

        return this;
    };

    /**
    * Default configuration of this plugin.
    *
    * @property $.fn.dataevent.defaults
    * @type {Object}
    */
    $.fn.dataevent.defaults = {
        selector: "[data-at]",
        dataPrefix: "@",
        refAttr: "id@",
        debug: false
    };

}( jQuery ) );
