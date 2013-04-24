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
		pluginVersion = '3.0.0';

	$.fn.SuperBox = function(options) {

		/**
		 * DECLARATIONS
		 */
		var sbImgBottom,
			sbShowTop,
			sbShow = $('<div class="superbox-show"/>'),
			sbImg = $('<img src="img/ajax-loader.gif" class="superbox-current-img"/>'),
			sbClose = $('<a href="#" class="superbox-close"><i class="icon-cancel-circle"></i></a>'),
			sbFloat = $('<div class="superbox-float"/>'),
			sbList = this.find('>div'),
			sbList8 = this.find('>div:nth-child(8n)'),
			sbList6 = this.find('>div:nth-child(6n)'),
			sbList4 = this.find('>div:nth-child(4n)'),
			sbList2 = this.find('>div:nth-child(2n)');

		/**
		 * METHODS
		 */

		/**
		 * setLastClass
		 * 
		 * Last thumbnail is determined based on window width.
		 */
		var setLastClass = function(){
			if ($(window).width() > 1024) {
				sbList.removeClass('superbox-last');
				sbList8.addClass('superbox-last');
			} else if ($(window).width() > 767) {
				sbList.removeClass('superbox-last');
				sbList6.addClass('superbox-last');
			} else if ($(window).width() > 485) {
				sbList.removeClass('superbox-last');
				sbList4.addClass('superbox-last');
			} else {
				sbList.removeClass('superbox-last');
				sbList2.addClass('superbox-last');
			}
		};

		/**
		 * createSuperboxShow
		 * 
		 * Dynamically create superbox-show and insert it after superbox-last
		 */
		var createSuperboxShow = function(elem){
			var noSuperbox = !$('.superbox-show').length,
				notLast = !elem.hasClass('superbox-last'),
				notInRowA = !elem.nextAll('.superbox-last:first').next('.superbox-show').length,
				notInRowB = !elem.next('.superbox-show').length,
				setA = function(){
					sbShow.append(sbImg).append(sbClose).insertAfter(elem.nextAll('.superbox-last:first'));
				},
				setB = function(){
					sbShow.append(sbImg).append(sbClose).insertAfter(elem);
				},
				create = function(){
					if (notLast === true && notInRowA === true) {
						if (noSuperbox === true) {
							setA();
						} else {
							$('.superbox-show').slideUp(function(){
								setA();
							});
						}
					} else if (notLast === false && notInRowB === true) {
						if (noSuperbox === true) {
							setB();
						} else {
							$('.superbox-show').slideUp(function(){
								setB();
							});
						}
					}
				};

			create();
		};

		/**
		 * openSuperboxShow
		 * 
		 * opens superbox-show when present.
		 */
		var openSuperboxShow = function(){
			$('.superbox-show').slideDown();
		};

		/**
		 * keepShowAfterLast
		 * 
		 * Move superbox-show to after superbox-last when window is resized
		 */
		var keepShowAfterLast = function(){
			$(window).resize(function(){
				if ($('.superbox-O').hasClass('superbox-last')) {
					$('.superbox-show').insertAfter($('.superbox-O'));
				} else {
					$('.superbox-show').insertAfter($('.superbox-O').nextAll('.superbox-last:first'));
				}
			});
		};

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
		 * Set superbox-last class
		 */
		setLastClass();
		$(window).resize(function(){
			setLastClass();
		});

		/*
		 * Create final float
		 */
		sbFloat.appendTo(this);

		/*
		 * Iterate through each superbox-list
		 */
		sbList.each(function(){

			/*
			 * Open/Close superbox-show based on click
			 */
			$(this).on('click',function(){

				/* pseudocode
				if superbox-show does not exist
					create superbox-show
					set superbox-show image src to imageData
					animate opening of superbox-show
					reveal image
					move superbox-show to center screen
				else
					if superbox-show img is same as this imageData
						animate closing of superbox-show
					else
						set superbox-show image src to imageData
						reveal image
					endif
				endif

				set image data
				reveal image
				*/

				/**
				 * DECLARATIONS
				 */
				var imageData = $(this).find('img').data('img');

				sbList.removeClass('superbox-O');
				$(this).addClass('superbox-O');

				/*
				 * Set sbImgBottom to bottom position of clicked image
				 */
				sbImgBottom = $(this).find('img').offset().top + $(this).find('img').height();

				createSuperboxShow($(this));

				keepShowAfterLast();

				/*
				 * Add source data to dynamically created full size image
				 */
				$('img.superbox-current-img')
					.attr('src',$(this).find('img').data('img'));

				openSuperboxShow();

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