/**
 * SuperBox
 * The lightbox reimagined. Fully responsive HTML5 image galleries.
 * 
 * Latest version: https://github.com/seyDoggy/superbox
 * Original version: https://github.com/toddmotto/superbox
 * 
 * Copyright 2013 Todd Motto <http://www.toddmotto.com>
 * Copyright 2013 Adam Merrifield <http://seydesign.com>
 * 
 * Licensed under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 */
 ;(function($, undefined) {
	'use strict';

	var pluginName = 'SuperBox',
		pluginVersion = '2.1.0';

	$.fn.SuperBox = function(options) {

		/**
		 * OPTIONS
		 */
		var defaults = $.extend({
			background : null,
			border : null,
			height : 400,
			view : 'landscape',
			xColor : null,
			xShadow : 'none'
		}, options);

		/**
		 * DECLARATIONS
		 */
		var sbImgBottom,
			sbShowTop,
			sbShow = $('<div class="superbox-show superbox-X"/>'),
			sbImg = $('<img src="img/ajax-loader.gif" class="superbox-current-img"/>'),
			sbClose = $('<a href="#" class="superbox-close"><i class="icon-cancel-circle"></i></a>'),
			sbFloat = $('<div class="superbox-float"/>'),
			sbList = this.find('>div');

		/**
		 * METHODS
		 */

		/**
		 * bodyHeight
		 * 
		 * In order to circumvent a pages desire to collapse between slides
		 * we temporarily set the html height, then unset it when we're done.
		 */
		var bodyHeight = (function(action){
			if (action === 'set') {
				$('html').css('height',$('html').outerHeight(true));
			} else if (action == 'unset') {
				$('html').css('height','');
			}
		});

		/**
		 * closeUp
		 * 
		 * Closes any open superbox-show
		 * Accepts element (selector) parameter.
		 */
		var closeUp = (function(elem){

			var selection = elem.next('.superbox-O');

			/*
			 * Swap open and closed classes
			 */
			selection.removeClass('superbox-O').addClass('superbox-X');

			/*
			 * Is a superbox-show in the same row already open? No? Then...
			 */
			if (sbImgBottom != sbShowTop) {
				selection
					/*
					 * Fade out image and close icon
					 */
					.find('img.superbox-current-img, a.superbox-close')
						.animate({opacity:0},100)
					.end()
						/*
						 * Slide up superbox-show
						 */
						.slideUp(function(){
							sbShowTop = 0;
							sbImgBottom = 0;
							/*
							 * unset the html height
							 */
							bodyHeight('unset');
						});
			} else {

				/*
				 * temporarily set the html height
				 */
				bodyHeight('set');

				selection
					/*
					 * Fade out image
					 */
					.find('img.superbox-current-img')
						.animate({opacity:0},100)
					.end()
						/*
						 * Since a superbox-show in the same row is already open, no need to slide up and down
						 */
						.hide();
			}
		});

		/**
		 * openUp
		 * 
		 * opens the clicked $(this).next() superbox-show
		 * Accepts element (selector) parameter.
		 */
		var openUp = (function(elem, fullImg){

			var selection = elem.next();

			/*
			 * Add source data to dynamically created full size image
			 */
			selection.find('img.superbox-current-img')
				.attr('src',fullImg);

			/*
			 * Set width of superbox-show 
			 */

			var setWidth = (function(){
				if ($(window).width() > 1024) {
					if (selection.outerWidth(true) != elem.width()*8) {
						selection.outerWidth(elem.width()*8);
					}
				} else if ($(window).width() > 767) {
					if (selection.outerWidth(true) != elem.width()*6) {
						selection.outerWidth(elem.width()*6);
					}
				} else if ($(window).width() > 467) {
					if (selection.outerWidth(true) != elem.width()*4) {
						selection.outerWidth(elem.width()*4);
					}
				} else {
					if (selection.outerWidth(true) != elem.width()*2) {
						selection.outerWidth(elem.width()*2);
					}
				}
			});

			/*
			 * Set height of superbox-show 
			 */

			var setHeight = (function(){
				var thisWidth = selection.outerWidth(true),
					thisHeight = defaults.height + (16 * 3), /* 1.5em padding */
					newHeight = thisHeight,
					thisWindow = $(window).height() * 0.80,
					thisView = defaults.view,
					thisRatio = 0.6667;

				if (newHeight > thisWindow) {
					newHeight = thisWindow;
				}

				if (thisView === 'landscape') {
					if (thisWidth < newHeight / thisRatio) {
						newHeight = thisWidth * thisRatio;
					}
				}

				if (thisView === 'portrait') {
					if (thisWidth < newHeight * thisRatio) {
						newHeight = thisWidth / thisRatio;
					}
				}

				if (thisView === 'square') {
					if (thisWidth < newHeight) {
						newHeight = thisWidth;
					}
				}

				selection.outerHeight(newHeight);
			});

			setWidth();
			setHeight();
			$(window).resize(function(){
				setWidth();
				setHeight();
			});

			/*
			 * Swap open and closed classes
			 */
			selection.removeClass('superbox-X').addClass('superbox-O');

			/*
			 * Is a superbox-show in the same row already open? No? Then...
			 */
			if (sbImgBottom != sbShowTop) {

				/*
				 * Slide down superbox-show
				 */
				selection.slideDown(function(){

					/*
					 * Set sdShowTop position to top of superbox-show
					 */
					sbShowTop = $(this).offset().top;

					/*
					 * Scroll so that superbox-show is vertically centered
					 */
					$('html,body').animate({
							scrollTop: sbShowTop - (($(window).height() - $(this).outerHeight(true))/2)
					}, 'fast');

					/*
					 * Reset sbImgBottom to current bottom position of clicked image
					 */
					sbImgBottom = $(this).prev().find('img').offset().top + $(this).prev().find('img').height();

				})
					/*
					 * Fade in close-icon
					 */
					.find('a.superbox-close')
						.animate({opacity:0.7},1000);

			} else {

				selection
					/*
					 * Since a superbox-show in the same row is already open, no need to slide up and down
					 */
					.show()
					/*
					 * set close icon opacity
					 */
					.find('a.superbox-close')
						.css('opacity','0.7');

				/*
				 * unset the html height
				 */
				bodyHeight('unset');
			}

			/*
			 * Fade in image and close-icon
			 */
			selection.find('img.superbox-current-img')
				.animate({opacity:1},1000);
		});

		/**
		 * IMPLEMENTATION
		 ****************/

		/*
		 * Add superbox-active class to allow for CSS to take hold
		 */
		this.addClass('superbox-active');

		/*
		 * Add superbox-list class for easier CSS targeting
		 */
		sbList.addClass('superbox-list');

		/*
		 * Create dynamic superbox content
		 */
		sbShow.append(sbImg).append(sbClose).insertAfter(sbList);

		/*
		 * Create final float
		 */
		sbFloat.appendTo(this);

		/*
		 * Test for and utilize defaults.background
		 */
		if (defaults.background !== null) {
			sbList
				.next()
					.css({
						'background-color': defaults.background
					});
		}

		/*
		 * Test for and utilize defaults.border
		 */
		if (defaults.border !== null) {
			sbList
				.next()
					.find('img.superbox-current-img')
						.css({
							'border-color': defaults.border
						});
		}

		/*
		 * Test for and utilize defaults.xColor
		 */
		if (defaults.xColor !== null) {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'color': defaults.xColor
						});
		}

		/*
		 * Test for and utilize defaults.xShadow
		 */
		if (defaults.xShadow == 'emboss') {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'text-shadow': '0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(250,250,250,0.2)'
						});
		} else if (defaults.xShadow == 'embed') {
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

			/*
			 * Open/Close superbox-show based on click
			 */
			$(this).on('click',function(){

				/**
				 * DECLARATIONS
				 */
				var imageData = $(this).find('img').data('img');

				/*
				 * Set sbImgBottom to bottom position of clicked image
				 */
				sbImgBottom = $(this).find('img').offset().top + $(this).find('img').height();

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
					/*
					 * Reset sbImgBottom to 0 to trigger slide up
					 */
					sbImgBottom = 0;
					closeUp($(this));
				} else {
					openUp($(this),imageData);
				}

			});

		});

		/*
		 * Close superbox-show when the close button is clicked.
		 */
		$('.superbox-close').on('click',function(event){
			event.preventDefault();
			/*
			 * Reset sbImgBottom to 0 to trigger slide up
			 */
			sbImgBottom = 0;
			closeUp($(this).parent().prev());
		});

		return this;
	};
})(jQuery);