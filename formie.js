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
				if( $(element).data('formieBind') ) {
					var childElement = $(element);
					var formieData = childElement.data();
					var parentElement = $('[name="' + childElement.data('formieBind') + '"]' ).last();

					parentElement.bind('change.formie', createExpressionHandler( childElement, parentElement, formieData, settings.action ) );
				}
				else if( $(element).data('formieIsChecked') ) {
					var childElement = $(element);
					var formieData = childElement.data();
					var parentElement = $('[name="' + childElement.data('formieBind') + '"]' ).last();

					parentElement.bind('change.formie', createCheckedHandler( childElement, parentElement, formieData, settings.action ) );
				}
			});
		});
	};

	createExpressionHandler = function( childElement, parentElement, formieData, action ) {
		var comparator = '';
		var value = '';

		for( var p in formieData ) {
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

})( jQuery );

