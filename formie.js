(function( $ ) {
	$.fn.formie = function( options ) {
		// Default settings
		var settings = $.extend({
			// Default action: disable the specified element.
			'action' : function( element, truthyness ) {
				console.log( element, truthyness );
				if( truthyness ) {
					element.removeAttr('disabled');
				}
				else {
					element.attr('disabled', 'disabled');
				}
			}
		}, options);

		// Plugin code goes here to respect chaining.
		return this.each(function() {
			$(this).find(':input').each(function( index, element ) {
				var parentElement;
				if( $(element).data('formieBind') ) {
					parentElement = $('[name="' + $(element).data('formieBind') + '"]' ).last();
					parentElement.bind('change.formie', createBoundHandler( $(element), parentElement, settings.action ) ).change();
				}
				else if( $(element).data('formieIsChecked') ) {
					parentElement = $('[name="' + $(element).data('formieIsChecked') + '"]' ).last();
					parentElement.bind('change.formie', createCheckedHandler( $(element), parentElement, settings.action ) ).change();
				}
				else if( $(element).data('formieValueIn') ) {
					parentElement = $('[name="' + $(element).data('formieValueIn') + '"]' ).last();
					parentElement.bind('change.formie', createValueInHandler( $(element), parentElement, settings.action ) ).change();
				}
			});
		});
	};

	createBoundHandler = function( childElement, parentElement, action ) {
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

		switch( comparator ) {
			case '=':
				return function() { action( childElement, parentElement.val() == value ); };
			case '!=':
				return function() { action( childElement, parentElement.val() != value ); };
			case '>':
				return function() { action( childElement, parentElement.val() > value ); };
			case '<':
				return function() { action( childElement, parentElement.val() < value ); };
			case 'value_in':
				return createValueInAction( childElement, parentElement, action );
		}
	};
	
	createCheckedHandler = function( childElement, parentElement, action ) {
		return function() { action( childElement, parentElement.attr('checked') == 'checked' ); };
	};

	createValueInAction = function( childElement, parentElement, action ) {
		var valueInArray = childElement.data('formieValueIn');
		var splitString = valueInArray.split(',');
		console.log( parentElement.val() );
		return function() { action( childElement, $.inArray( parentElement.val(), splitString ) > -1 ); };
	};

})( jQuery );

