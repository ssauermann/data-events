# data-events
Define event handlers for dom attributes inside html5 data attributes.

## How to use
- include jQuery
- include this script

### Basics
First of all you have to add the attribute 'data-at' to a dom object to create a group. All children of this dom object will be considered by the script and checked when a data-event update is triggered. [Cross references](#use-cross-references) only work within a group.

```html
<svg data-at>

</svg>
```

###Definition of a data-event:
A data-event consists of a string as event name and an object as event value. Such may be triggered by calling the function `dataevent` on a jQuery dom object.

```js
$('*').dataevent('eventName', 'eventValue');
```

### Binding a data-event
To bind a data-event to an attribute, add another attribute to the same dom object beginning with `data-@` followed by the attribute name. The value has to be a valid json and has to have one of the following formats.

#### Direct value handler
To assign the event value directly to the attribute when an event is triggered, define an object property with the key `"event"` and the event name as value.
```html
<svg data-at>
  <circle cx="50" cy="50" r="40" data-@r='{"event": "activate"}' />
</svg>
```

#### Discrete value handler
To map the event value to specified values, define additionally to the "event" property a `"handler"` property and assign a map (as an object) as value.
```html
<svg data-at>
  <circle cx="50" cy="50" r="40" fill="red"
          data-@fill='{"event": "activate", "handler": {"on": "green", "off": "red"} }'
  />
</svg>
```

#### Functional value handler
To do more complex calculations before assignment, you can add a function as the value of the `"handler"` property. Mask quotationmarks accordingly!
```html
<svg data-at>
  <circle cx="50" cy="50" r="40" fill-opacity="1"
          data-@fill-opacity='{"event": "activate", "handler": "function(event, val){return (val%100)/100;}" }'
  />
</svg>
```

#### Multiple events
Instead of one, multiple data-events may be bound via an array of strings.
```html
<svg data-at>
  <circle cx="50" cy="50" r="40" data-@r='{"event": ["activate", "other"] }' />
</svg>
```

#### Use cross-references
To reduce code duplications you can refer to another data-event. On the dom object which will be referenced, the attribute `data-id@` has to be set. As reference use this id and a data attribute:
```html
<svg data-at>
  <circle cx="30" cy="30" r="20" fill="red" data-id@="circleA"
          data-@fill='{"event": "activate", "handler": {"on": "green", "off": "red"} }'
  />
  <circle cx="60" cy="30" r="20" fill="red"
          data-@fill='{"id": "circleA", "attribute": "@fill"}'
  />
</svg>
```

### Example
```js
$(document).ready(function () {
  
  $('body').mousedown(function (e) {
      $('*').dataevent('activate', 'on');
  });
  
  $('body').mouseup(function (e) {
      $('*').dataevent('activate', 'off');
  });
  
});
```
```html
<svg height="400" width="400" data-at>
  <circle cx="50" cy="50" r="40" fill="red" data-id@="circleA"
          data-@fill='{"event": "activate", "handler": {"on": "green", "off": "red"}}' />
  <circle cx="120" cy="100" r="40" fill="blue" data-@fill='{"id": "circleA", "attribute": "@fill"}' />
</svg>
```
