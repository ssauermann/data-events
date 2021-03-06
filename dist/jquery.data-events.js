/*! Data Events - v0.1.0 - 2016-01-18
* https://github.com/ssauermann/data-events
* Copyright (c) 2016 S. Sauermann; Licensed MIT */
( function( $ ) {
    "use strict";
    var debug = false;

    /*
    Returns reference id of element
    data-id@='abc12' -> 'abc12'
    */
    function getDataId( e ) {
        return e.data( "id@" );
    }

    /*
     Returns a object of all data attributes beginning with an @ and
     their values of a given dom element
     {@name: value1, @other: value2}
     */
    function getAttributes( e ) {
        /*
         Returns all HTML5 custom data attributes as an object:
         <div id='prod' data-id='10' data-cat='toy' data-cid='42'>blah</div>
         -> { "id":10, "cat":"toy", "cid":42 }
         jQuery (>=1.4.4)
         */
        var dataDict = e.data();

        //Filter data attributes for @ character
        $.each( dataDict, function( key ) {
            if ( key.indexOf( "@" ) !== 0 ) {
                delete dataDict[ key ];
            }
        } );

        return dataDict;

    }

    /*
    Returns an array of all @-data attribute objects of each child
    [[dom1, {@name: value1}], [dom2, {@name: value2, @other: value3}]]
    */
    function getChildAttributes( e ) {

        var arry = [];

        e.find( "*" ).each( function() {
            arry.push( [ $( this ), getAttributes( $( this ) ) ] );
        } );

        return arry;

    }

    /*
    Resolve cross references and validates structure
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

                //Search for reference until finding a non reference
                    searchForReference = function( ref ) {

                        if ( debug ) {
                            console.log( "Resolving reference for: " );
                            console.log( ref );
                        }

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
                            if ( debug ) {
                                console.log( "Resolved to: " );
                                console.log( refAttribute );
                            }
                            return refAttribute;
                        }

                        //--> another reference
                        if ( debug ) {
                            console.log( refAttribute );
                        }

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

    /*
    Handle an event and update the attribute with the calculated value
    */
    function handleEvent( dom, attributename, event, handler, value ) {
        if ( debug ) {
            console.log( "Handling event:" );
            console.log( dom );
            console.log( attributename );
            console.log( handler );
            console.log( value );
        }

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

    /*
    Execute an event with the given value on an dom element
    */
    function executeEvent( at, event, eventValue ) {
        if ( debug ) {
            console.log( "Executing event:" );
            console.log( event );
            console.log( eventValue );
        }

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

        //Remove empty objects
        return $.grep( at, function( o ) {
            return $.isEmptyObject( o );
        } );

    }

    /*
    Update all dom elements which should be managed
    */
    $.fn.dataevent = function update( event, value ) {

        this.find( "[data-at]" ).each( function() {
            var dom = $( this );

            executeEvent( resolveReference( getChildAttributes( dom ) ), event, value );

        } );

        return this;
    };

}( jQuery ) );
