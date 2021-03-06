/*global $:false console:false */
(function( $ ) {
	'use strict';
	$.fn.formie = function( options ) {
		// Default settings
		var settings = $.extend({
			// Default action: disable the specified element.
			'action_event' : function( element, truthyness ) {
				if( truthyness ) {
					element.prop('disabled', false);
				}
				else {
					element.prop('disabled', true);
				}
			},
			'clear_event': function( element ) {
				if( element.prop('type') == 'checkbox' ) {
					element.prop('checked', false);
				}
				else {
					element.val('');
				}
			}
		}, options);

		// Plugin code goes here to respect chaining.
		return this.each(function() {
			$('[data-formie-bind]').each(function( index, element ) {
				var action_event = settings.action_event;
				var clear_event = settings.clear_event;

				if( $(element).data('formieActionEvent') ) {
					action_event = settings[ $(element).data('formieActionEvent') ];
					if( action_event === undefined ) {
						console.log( $(element).data('formieActionEvent') + ' was not defined in settings.');
						return;
					}
				}
				if( $(element).data('formieClearEvent') ) {
					clear_event = settings[ $(element).data('formieClearEvent') ];
					if( clear_event === undefined ) {
						console.log( $(element).data('formieClearEvent') + ' was not defined in settings.');
						return;
					}
				}

				var parentElement;
				if( $(element).data('formieBind') ) {
					parentElement = $('[name="' + $(element).data('formieBind') + '"]' ).last();
					parentElement.on('change.formie', createBoundHandler( $(element), parentElement, action_event, clear_event ) ).change();
				}
				else if( $(element).data('formieValueIn') ) {
					parentElement = $('[name="' + $(element).data('formieValueIn') + '"]' ).last();
					parentElement.on('change.formie', createValueInHandler( $(element), parentElement, action_event, clear_event ) ).change();
				}
			});
			$('[data-formie-is-checked]').each(function( index, element) {

				var action_event = settings.action_event;
				var clear_event = settings.clear_event;

				if( $(element).data('formieActionEvent') ) {
					action_event = settings[ $(element).data('formieActionEvent') ];
					if( action_event === undefined ) {
						console.log( $(element).data('formieActionEvent') + ' was not defined in settings.');
						return;
					}
				}
				if( $(element).data('formieClearEvent') ) {
					clear_event = settings[ $(element).data('formieClearEvent') ];
					if( clear_event === undefined ) {
						console.log( $(element).data('formieClearEvent') + ' was not defined in settings.');
						return;
					}
				}

				var parentElement = $('[name="' + $(element).data('formieIsChecked') + '"]' ).last();
				parentElement.on('change.formie', createCheckedHandler( $(element), parentElement, action_event, clear_event ) ).change();
			});
		});
	};

	var createBoundHandler = function( childElement, parentElement, action, clear ) {
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
				return createValueInHandler( childElement, parentElement, action, clear );
		}

		return createCallbacks( childElement, expression, action, clear );
	};

	var createCheckedHandler = function( childElement, parentElement, action, clear ) {
		var expression = function() {
			return parentElement.prop('checked') === true;
		};
		return createCallbacks( childElement, expression, action, clear );
	};

	var createValueInHandler = function( childElement, parentElement, action, clear ) {
		var valueInArray = childElement.data('formieValueIn');
		var splitString = valueInArray.split(',');
		var expression = function() {
			return $.inArray( parentElement.val(), splitString ) >= 0;
		};
		return createCallbacks( childElement, expression, action, clear );
	};

	var createCallbacks = function( childElement, expression, action, clear ) {
		return function() {
			action( childElement, expression() );
			if( !expression() ) {
				clear( childElement );
			}
		};
	};

})( jQuery );

