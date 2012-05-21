/**
 * jQuery TOOLS plugin :: scrollable.navigator 1.0.2
 * 
 * Copyright (c) 2009 Tero Piirainen
 * http://flowplayer.org/tools/scrollable.html#navigator
 *
 * Dual licensed under MIT and GPL 2+ licenses
 * http://www.opensource.org/licenses
 *
 * Launch  : September 2009
 * Date: ${date}
 * Revision: ${revision} 
 */
(function($) {
		
	var t = $.tools.scrollable; 
	t.plugins = t.plugins || {};
	
	t.plugins.navigator = {
		version: '1.0.2',
		
		conf: {
			navi: '.navi',
			naviItem: null,		
			activeClass: 'active',
			indexed: false,
			api: false,
			idPrefix: null
		}
	};		
		
	// jQuery plugin implementation
	$.fn.navigator = function(conf) {

		var globals = $.extend({}, t.plugins.navigator.conf), ret;
		if (typeof conf == 'string') { conf = {navi: conf}; }
		
		conf = $.extend(globals, conf);
		
		this.each(function() {
			
			var api = $(this).scrollable(),
				 root = api.getRoot(), 
				 navi = root.data("finder").call(null, conf.navi), 
				 els = null, 
				 buttons = api.getNaviButtons();
			
			if (api) { ret = api; }
			
			api.getNaviButtons = function() {
				return buttons.add(navi);	
			}; 
				
			// generate new entries
			function reload() {
				
				if (!navi.children().length || navi.data("navi") == api) {
					
					navi.empty();
					navi.data("navi", api);
					
					for (var i = 0; i < api.getPageAmount(); i++) {		
						navi.append($("<" + (conf.naviItem || 'a') + "/>"));
					}
					
					els = navi.children().each(function(i) {
						var el = $(this);
						el.click(function(e) {
							api.setPage(i);							
							return e.preventDefault();
						});
						
						// possible index number
						if (conf.indexed)  { el.text(i); }
						if (conf.idPrefix) { el.attr("id", conf.idPrefix + i); }
					});
					
					
				// assign onClick events to existing entries
				} else {
					
					// find a entries first -> syntaxically correct
					els = conf.naviItem ? navi.find(conf.naviItem) : navi.children();
					
					els.each(function(i)  {
						var el = $(this);
						
						el.click(function(evt) {
							api.setPage(i);
							return evt.preventDefault();						
						});
						
					});
				}
				
				// activate first entry
				els.eq(0).addClass(conf.activeClass); 
				
			}
			
			// activate correct entry
			api.onStart(function(e, index) {
				var cls = conf.activeClass;				
				els.removeClass(cls).eq(api.getPageIndex()).addClass(cls);
			});
			
			api.onReload(function() {
				reload();		
			});
			
			reload();			
			
			// look for correct navi item from location.hash
			var el = els.filter("[href=" + location.hash + "]");	
			if (el.length) { api.move(els.index(el)); }			
			
			
		});		
		
		return conf.api ? ret : this;
		
	};
	
})(jQuery);			
