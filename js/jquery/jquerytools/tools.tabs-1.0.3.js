/**
 * tools.tabs 1.0.3 - Tabs done right.
 * 
 * Copyright (c) 2009 Tero Piirainen
 * http://flowplayer.org/tools/tabs.html
 *
 * Dual licensed under MIT and GPL 2+ licenses
 * http://www.opensource.org/licenses
 *
 * Launch  : November 2008
 * Date: ${date}
 * Revision: ${revision} 
 */  
(function($) {
		
	// static constructs
	$.tools = $.tools || {};
	
	$.tools.tabs = {
		version: '1.0.3',
		
		conf: {
			tabs: 'a',
			current: 'current',
			onBeforeClick: null,
			onClick: null, 
			effect: 'default',
			initialIndex: 0,			
			event: 'click',
			api:false,
			rotate: false
		},
		
		addEffect: function(name, fn) {
			effects[name] = fn;
		}
	};		
	
	
	var effects = {
		
		// simple "toggle" effect
		'default': function(i, done) { 
			this.getPanes().hide().eq(i).show();
			done.call();
		}, 
		
		/*
			configuration:
				- fadeOutSpeed (positive value does "crossfading")
				- fadeInSpeed
		*/
		fade: function(i, done) {
			var conf = this.getConf(), 
				 speed = conf.fadeOutSpeed,
				 pane = this.getCurrentPane();
							 
			if (speed) {
				pane.fadeOut(speed);	
			} else {
				pane.hide();	
			}

			this.getPanes().eq(i).fadeIn(conf.fadeInSpeed, done);	
		},
		
		// for basic accordions
		slide: function(i, done) {
			this.getCurrentPane().slideUp(200);
			this.getPanes().eq(i).slideDown(400, done);			 
		}, 

		// simple AJAX effect
		ajax: function(i, done)  {			
			this.getPanes().eq(0).load(this.getTabs().eq(i).attr("href"), done);	
		}
		
	};   	
	
	var w;
	
	// this is how you add effects
	$.tools.tabs.addEffect("horizontal", function(i, done) {
	
		// store original width of a pane into memory
		if (!w) { w = this.getPanes().eq(0).width(); }
		
		// set current pane's width to zero
		this.getCurrentPane().animate({width: 0}, function() { $(this).hide(); });
		
		// grow opened pane to it's original width
		this.getPanes().eq(i).animate({width: w}, function() { 
			$(this).show();
			done.call();
		});
		
	});	
	 

	function Tabs(tabs, panes, conf) { 
		
		var self = this, $self = $(this), current;

		// bind all callbacks from configuration
		$.each(conf, function(name, fn) {
			if ($.isFunction(fn)) { $self.bind(name, fn); }
		});
		
		
		// public methods
		$.extend(this, {				
			click: function(i) {
				
				var pane = self.getCurrentPane();				
				var tab = tabs.eq(i);												 
				
				if (typeof i == 'string' && i.replace("#", "")) {
					tab = tabs.filter("[href*=" + i.replace("#", "") + "]");
					i = Math.max(tabs.index(tab), 0);
				}
								
				if (conf.rotate) {
					var last = tabs.length -1; 
					if (i < 0) { return self.click(last); }
					if (i > last) { return self.click(0); }						
				}
				
				if (!tab.length) { 
					if (current >= 0) { return self; }
					i = conf.initialIndex;
					tab = tabs.eq(i);
				}				
				
				// possibility to cancel click action
				var e = $.Event("onBeforeClick");
				$self.trigger(e, [i]);				
				if (e.isDefaultPrevented()) { return; }

				
				// current tab is being clicked
				if (i === current) { return self; }																
								
				tab.addClass(conf.current);
				
				// call the effect
				effects[conf.effect].call(self, i, function() {

					// onClick callback
					$self.trigger("onClick", [i]);
					
				});				
	
				
				tabs.removeClass(conf.current);	
				tab.addClass(conf.current);
				current = i;
				return self;
			},
			
			getConf: function() {
				return conf;	
			},

			getTabs: function() {
				return tabs;	
			},
			
			getPanes: function() {
				return panes;	
			},
			
			getCurrentPane: function() {
				return panes.eq(current);	
			},
			
			getCurrentTab: function() {
				return tabs.eq(current);	
			},
			
			getIndex: function() {
				return current;	
			}, 
			
			next: function() {
				return self.click(current + 1);
			},
			
			prev: function() {
				return self.click(current - 1);	
			}, 
			
			bind: function(name, fn) {
				$self.bind(name, fn);
				return self;	
			},	
			
			onBeforeClick: function(fn) {
				return this.bind("onBeforeClick", fn);
			},
			
			onClick: function(fn) {
				return this.bind("onClick", fn);
			},
			
			unbind: function(name) {
				$self.unbind(name);
				return self;	
			}			
		
		});
		
		
		// setup click actions for each tab
		tabs.each(function(i) { 
			$(this).bind(conf.event, function(e) {
				self.click(i);
				return e.preventDefault();
			});			
		});

		// if no pane is visible --> click on the first tab
		if (location.hash) {
			self.click(location.hash);
		} else {
			self.click(conf.initialIndex);	
		}		
		
		// cross tab anchor link
		panes.find("a[href^=#]").click(function() {
			self.click($(this).attr("href"));		
		}); 
	}
	
	
	// jQuery plugin implementation
	$.fn.tabs = function(query, conf) {
		
		// return existing instance
		var el = this.eq(typeof conf == 'number' ? conf : 0).data("tabs");
		if (el) { return el; }

		if ($.isFunction(conf)) {
			conf = {onBeforeClick: conf};
		}
		
		// setup options
		var globals = $.extend({}, $.tools.tabs.conf), len = this.length;
		conf = $.extend(globals, conf);		

		
		// install tabs for each items in jQuery		
		this.each(function(i) {				
			var root = $(this); 
			
			// find tabs
			var els = root.find(conf.tabs);
			
			if (!els.length) {
				els = root.children();	
			}
			
			// find panes
			var panes = query.jquery ? query : root.children(query);
			
			if (!panes.length) {
				panes = len == 1 ? $(query) : root.parent().find(query);
			}			
			
			el = new Tabs(els, panes, conf);
			root.data("tabs", el);
			
		});		
		
		return conf.api ? el: this;		
	};		
		
}) (jQuery); 


