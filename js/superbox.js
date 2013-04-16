/**
 * SuperBox v2.0.4
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
		var sbImgBottom,
			sbShowTop,
			sbShow = $('<div class="superbox-show superbox-X"/>'),
			sbImg = $('<img src="img/ajax-loader.gif" class="superbox-current-img"/>'),
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
						});
			} else {
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
					sbShowTop = $('.superbox-O').offset().top;

					/*
					 * Scroll so that superbox-show is vertically centered
					 */
					$('html,body').animate({
							scrollTop: sbShowTop - (($(window).height() - $('.superbox-O').outerHeight(true))/2)
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

			}

			/*
			 * Fade in image and close-icon
			 */
			selection.find('img.superbox-current-img')
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