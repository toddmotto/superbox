/**
 * SuperBox v2.0.0
 * 
 * The lightbox reimagined. Fully responsive HTML5 image galleries.
 * 
 * Latest version: https://github.com/toddmotto/superbox
 * 
 * Copyright 2013 Todd Motto <http://www.toddmotto.com> / Adam Merrifield <http://seydesign.com>
 * 
 * Licensed under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 */
;(function($) {

	$.fn.SuperBox = function(options) {

		/**
		 * OPTIONS
		 */
		var settings = $.extend({
			background : null,
			border : null,
			xColor : null,
			xShadow : 'none'
		}, options);

		/**
		 * DECLARATIONS
		 */
		var sbShow = $('<div class="superbox-show superbox-X"/>'),
			sbImg = $('<img src="" class="superbox-current-img"/>'),
			sbClose = $('<a href="#" class="superbox-close">&#215;</a>'),
			sbFloat = $('<div class="superbox-float"/>'),
			sbList = this.find('>div');

		/**
		 * closeUp
		 * 
		 * Closes any open superbox-show
		 * Accepts element (selector) parameter.
		 */
		var closeUp = (function(elem){
			elem
				.next('.superbox-O')
					.removeClass('superbox-O')
					.addClass('superbox-X')
					.find('img.superbox-current-img, a.superbox-close')
						.animate({opacity:0},100)
					.end()
						.slideUp();
		});

		/**
		 * openUp
		 * 
		 * opens the clicked $(this).next() superbox-show
		 * Accepts element (selector) parameter.
		 */
		var openUp = (function(elem){
			elem
				.next()
					.removeClass('superbox-X')
					.addClass('superbox-O')
					.slideDown(function(){
						$('html,body').animate({
								scrollTop: ($('.superbox-O').offset().top) - (($(window).height() - $('.superbox-O').height())/2)
						}, 'fast');
					})
					.find('img.superbox-current-img, a.superbox-close')
						.animate({opacity:1},1000);
		});

		/*
		 * Create dynamic superbox content
		 */
		sbShow.append(sbImg).append(sbClose).insertAfter(sbList);

		/*
		 * Create final float
		 */
		sbFloat.appendTo(this);

		/*
		 * Add superbox-active class to allow for CSS to take hold
		 */
		this.addClass('superbox-active');

		/*
		 * Test for and utilize settings.background
		 */
		if (settings.background !== null) {
			sbList
				.next()
					.css({
						'background-color': settings.background
					});
		}

		/*
		 * Test for and utilize settings.border
		 */
		if (settings.border !== null) {
			sbList
				.next()
					.find('img.superbox-current-img')
						.css({
							'border-color': settings.border
						});
		}

		/*
		 * Test for and utilize settings.xColor
		 */
		if (settings.xColor !== null) {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'color': settings.xColor
						});
		}

		/*
		 * Test for and utilize settings.xShadow
		 */
		if (settings.xShadow == 'emboss') {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'text-shadow': '0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(250,250,250,0.2)'
						});
		} else if (settings.xShadow == 'embed') {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'text-shadow': '0 -1px 0 rgba(0,0,0,0.4), 0 1px 0 rgba(250,250,250,0.5)'
						});
		}

		/*
		 * Iterate through each superbox-list
		 */
		sbList.each(function(){

			/**
			 * DECLARATIONS
			 */
			var imageData = $(this).find('img').data('img');

			/*
			 * Add source data to dynamically created full size image
			 */
			$(this)
				.next()
					.find('img.superbox-current-img')
						.attr('src',imageData);

			/*
			 * Open/Close superbox-show based on click
			 */
			$(this).on('click',function(){
				/*
				 * Close any _other_ open superbox-show if it's not _this_ superbox-show.
				 */
				if (!$(this).next('.superbox-O').length) {
					closeUp(sbList);
				}

				/*
				 * Close _this_ superbox-show if it's open already, otherwise open it
				 */
				if ($(this).next('.superbox-O').length) {
					closeUp($(this));
				} else {
					openUp($(this));
				}

			});

		});

		/*
		 * Close superbox-show when the close button is clicked.
		 */
		$('.superbox-close').on('click',function(event){
			event.preventDefault();
			closeUp($(this).parent().prev());
		});

		return this;
	};
})(jQuery);