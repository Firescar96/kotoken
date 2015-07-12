// Stylable scrollbars detection
Modernizr.addTest('cssscrollbar', function() {

	var bool,

		styles = "#modernizr{overflow: scroll; width: 4 }#" +
			Modernizr._prefixes
				.join("scrollbar{width:}"+' #modernizr::')
				.split('#')
				.slice(1)
				.join('#') + "scrollbar{width:}";

	Modernizr.testStyles(styles, function(node) {
		bool = 'scrollWidth' in node && node.scrollWidth == 4;
	});

	return bool;

});
