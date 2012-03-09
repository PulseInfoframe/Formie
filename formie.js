(function( $ ) {
	$.fn.formie = function( options ) {
		// Default settings
		var settings = $.extend({
			// Default action: disable the specified element.
			'action_event' : function( element, truthyness ) {
				if( truthyness ) {
					element.removeAttr('disabled');
				}
				else {
					element.attr('disabled', 'disabled');
				}
			},
			'clear_event': function( element ) {
				element.val('');
			},
			'clear-values': true
		}, options);

		// Plugin code goes here to respect chaining.
		return this.each(function() {
			$(this).find(':input').each(function( index, element ) {
				var parentElement;
				if( $(element).data('formieBind') ) {
					parentElement = $('[name="' + $(element).data('formieBind') + '"]' ).last();
					parentElement.bind('change.formie', createBoundHandler( $(element), parentElement, settings.action_event, settings.clear_event ) ).change();
				}
				else if( $(element).data('formieIsChecked') ) {
					parentElement = $('[name="' + $(element).data('formieIsChecked') + '"]' ).last();
					parentElement.bind('change.formie', createCheckedHandler( $(element), parentElement, settings.action_event, settings.clear_event ) ).change();
				}
				else if( $(element).data('formieValueIn') ) {
					parentElement = $('[name="' + $(element).data('formieValueIn') + '"]' ).last();
					parentElement.bind('change.formie', createValueInHandler( $(element), parentElement, settings.action_event, settings.clear_event ) ).change();
				}
			});
		});
	};

	createBoundHandler = function( childElement, parentElement, action, clear ) {
		var comparator = '';
		var value = '';
		var data = childElement.data();

		for( var p in data ) {
			switch( p ) {
				case 'formieEquals':
					comparator = '=';
					value = data[p];
					break;
				case 'formieNotEquals':
					comparator = '!=';
					value = data[p];
					break;
				case 'formieGreatorThan':
					comparator = '>';
					value = data[p];
					break;
				case 'formieLessThan':
					comparator = '<';
					value = data[p];
					break;
				case 'formieValueIn':
					comparator = 'value_in';
					value = data[p];
					break;
			}
		}

		var expression;
		switch( comparator ) {
			case '=':
				expression = function() { return parentElement.val() == value; };
				break;
			case '!=':
				expression = function() { return parentElement.val() != value; };
				break;
			case '>':
				expression = function() { return parentElement.val() > value; };
				break;
			case '<':
				expression = function() { return parentElement.val() < value; };
				break;
			case 'value_in':
				return createValueInAction( childElement, parentElement, action, clear );
		}

		return createCallbacks( childElement, expression, action, clear );
	};
	
	createCheckedHandler = function( childElement, parentElement, action, clear ) {
		expression = function() {
			return parentElement.attr('checked') == 'checked';
		};
		return createCallbacks( childElement, expression, action, clear );
	};

	createValueInAction = function( childElement, parentElement, action, clear ) {
		var valueInArray = childElement.data('formieValueIn');
		var splitString = valueInArray.split(',');
		expression = function() {
			return $.inArray( parentElement.val(), splitString ) > 1;
		};
		return createCallbacks( childElement, expression, action, clear );
	};

	createCallbacks = function( childElement, expression, action, clear ) {
		return function() {
			action( childElement, expression() );
			clear( childElement );
		};
	};

})( jQuery );

