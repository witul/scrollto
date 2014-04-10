(function($, window, document) {
	"use strict";

	var pluginName = 'scrollTo',
		defaults = {
			duration: 1500,
			easing: 'swing',
			fixed: null
		},
	scrollTo = function(element, options) {
		var cache = {
			$html_body: $('html,body'),
			$window: $(window),
			$document: $(document)
		},
		state = {},
			registerHandlers = function() {

				//click on <a> with anchor
				cache.links.on('click', triggerScroll);
			},
			calculateDistance = function($el) {

			},
			parseScrollOptions = function() {

			},
			prepareAnimationData = function(external_data) {

				if ($.isPlainObject(external_data)) {
					return $.extend({}, options, external_data);
				}
				else
					return options;
			},
			//scrolling
			scroll = function(position, opts, $context) {
				if (position !== cache.$document.scrollTop()) {

					$('body').trigger("scrollStart.scrollTo", opts);
					cache.$html_body.stop().animate({scrollTop: position}, opts, function() {
						//call scrollStop event
						$('body').trigger("scrollStop.scrollTo");
					});
				}
				return true;
			},
			//prepare and scroll to
			triggerScroll = function(e) {
				var $trigger = $(e.currentTarget);

				var $destination = $($trigger.attr('href'));
				var destination_position;
				var animation_data = prepareAnimationData($trigger.data('scrollto'));
				//if target doesn't exists, just return true and call default event
				if ($trigger.attr('href') != '#' && $destination.length < 1) {
					return true;
				}
				//else do scrolling
				e.preventDefault();

				//if exists position parameter, go to it instead of element
				if ($trigger.attr('href') == '#')
					destination_position = 0;
				else if (animation_data.position !== undefined) {
					destination_position = animation_data.position;
				}
				else {
					//destination position
					destination_position = $destination.offset().top;
				}
				//we are currently scrolled to target
				if (destination_position === cache.$document.scrollTop()) {
					return false;
				}
				//scroll operation
				scroll(destination_position, prepareAnimationData($trigger.data('scrollto')), $trigger);
				return false;
			},
			scrollTo = function(dest, opts) {

				//go to current position
				if ($.isNumeric(dest)) {
					scroll(dest, prepareAnimationData(opts), cache.$window);
				}
				else if ($(dest).length > 0) {
					scroll(dest, prepareAnimationData(opts), cache.$window);
				}
			},
			config = function(opts) {
				$.extend(options, opts);
			},
			init = function() {
				cache.links = $('a[href^="#"][data-scrollto]');
				registerHandlers();
				return this;
			},
			destroy = function() {
				cache.links.unbind('click');
			};

		return{
			init: init,
			config: config,
			scrollTo: scrollTo
		};
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$(this).data('plugin_' + pluginName)) {
				options = $.extend({}, defaults, options);
				$(this).data('plugin_' + pluginName, new scrollTo(this, options).init());
			}
		});
	};
	$.fn[pluginName].defaults = defaults;
	$(document).on('ready', function() {
		$("body").scrollTo();
		$('#scroll-top').click(function() {
			$("body").data('plugin_scrollTo').scrollTo(0);
		});
	});
})(jQuery, window, document);