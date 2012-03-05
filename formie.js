(function( $ ) {
	$.fn.formie = function( options ) {
		// Default settings
		var settings = $.extend({
			// Default action: disable the specified element.
			'action' : function( element, truthyness ) {
				console.log( truthyness );
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
					parentElement.bind('change.formie', createExpressionHandler( $(element), parentElement, settings.action ) );
				}
				else if( $(element).data('formieIsChecked') ) {
					parentElement = $('[name="' + $(element).data('formieIsChecked') + '"]' ).last();
					parentElement.bind('change.formie', createCheckedHandler( $(element), parentElement, settings.action ) );
				}
			});
		});
	};

	createExpressionHandler = function( childElement, parentElement, action ) {
		var comparator = '';
		var value = '';
		var data = childElement.data();

		for( var p in data ) {
			switch( p ) {
				case 'formieEquals':
					comparator = '=';
					value = formieData[p];
					break;
				case 'formieGreatorThan':
					comparator = '>';
					value = formieData[p];
					break;
				case 'formieLessThan':
					comparator = '<';
					value = formieData[p];
					break;
			}
		}

		console.log( childElement, parentElement );
		return createExpressionCallback( childElement, parentElement, value, comparator, action );
	};
	
	createExpressionCallback = function( childElement, parentElement, value, comparator, action ) {
		console.log( comparator );
		switch( comparator ) {
			case '=':
				return function() { action( childElement, parentElement.val() == value ); };
			case '>':
				return function() { action( childElement, parentElement.val() > value ); };
			case '<':
				return function() { action( childElement, parentElement.val() < value ); };
		}
	};

	createCheckedHandler = function( childElement, parentElement, action ) {
		return function() { action( childElement, parentElement.attr('checked') == 'checked' ); };
	};

})( jQuery );

