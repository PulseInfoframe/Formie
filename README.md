# Formie

Formie lets you set up simple events based on changes to your form data.

### Data elements
<table>
	<tr>
		<th>Property</th>
		<th>Argument</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>data-formie-bind</td>
		<td>The id of the element we will bind to</td>
		<td>This will make the element the 'child' of the specified element</td>
	</tr>
	<tr>
		<th colspan='3'>
			Conditonal properties
		</th>
	</tr>
	<tr>
		<td>data-formie-equals</td>
		<td>The desired value</td>
		<td>This will return true when the parents value is equal to the desired value</td>
	</tr>
	<tr>
		<td>data-formie-greator-than</td>
		<td>The desired value</td>
		<td>This will return true when the parents value is greator than the desired value</td>
	</tr>
	<tr>
		<td>data-formie-equals</td>
		<td>The desired value</td>
		<td>This will return true when the parents value is less than the desired value</td>
	</tr>

</table>

### Example

Basic form example

```html
<form id='testform'>
	<!-- Parent element to "bind" to -->
	<select name='province'>
		<option value='ON'>Ontario</option>
		<option value='AB'>Alberta</option>
	</select>
	<!-- Dependant child element -->
	<select name='city-ontario' data-formie-bind='province' data-formie-equals='ON'>
		<option value='Toronto'>Toronto</option>
		<option value='London'>London</option>
	</select>
	<!-- Dependant child element -->
	<select name='city-alberta' data-formie-bind='province' data-formie-equals='ON'>
		<option value='Calgary'>Calgary</option>
		<option value='Victoria'>Victoria</option>
	</select>
</form>
```

```javascript
$(document).ready(function() {
	$('#testform').formie({
		// element is the child that called 'data-formie-bind' on another element
		// truthyness is the result of the comparator that that element contained eg: 'data-formie-equals'
		'action': function( element, truthyness ) {
			if( truthyness ) {
				console.log( 'Do something with ' + element );
			}
			else {
				console.log( 'Do something else with ' + element );
			}
		}
	});
});
```

The default 'action' will simply add the 'disabled' attribute to the element.
