# Formie

Formie lets you set up simple events based on changes to your form data.

### Options
* 'action' : a function that is called when the parent element has changed its value.

```javascript
$('#form').formie({
	'action_event': 
	// @param element: jQuery selector for the element that is to be updated
	// @param truthyness the value of the executed binding, ie false if binding conditions not met
	function(element, truthyness) {
		if( truthyness ) {
			element.removeAttr('disabled');
		}
		else {
			element.attr('disabled', 'disabled');
		}
	}
});
```

### Data tag options
#### data-formie-equals
equals will return true when the element specified by data-formie-bind's value is equal.

```html
<select name='province'>
	<option value='ON'>Ontario</option>
	<option value='AB'>Alberta</option>
</select>
<input type='text' data-formie-bind='province' data-formie-equals='ON' />
```

#### data-formie-not-equals, data-formie-greator-than, data-formie-less-than
Defined the same as equals.

#### data-formie-is-checked
Returns true with the specified element is checked.

```html
<input type='checkbox' name='signup-checkbox' value='signup' />
<input type='text' data-formie-is-checked='signup-checkbox' />
```

#### data-formie-value-in
Retruns true if the parents value is a set of values. Specified values should be comma delimted, like `'Value1,Value2'`

```html
<select name='province'>
	<option value='ON'>Ontario</option>
	<option value='AB'>Alberta</option>
	<option value='BC'>British Columbia</option>
	<option value='NS'>Nova Scotia</option>
</select>
<input type='text' data-formie-bind='province' data-value-in='AB,BC' />
```