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

		/*
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

		/*
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

		/*
		 * METHODS
		 */

		/**
		 * setLastClass
		 * 
		 * Last thumbnail is determined based on window width.
		 */
		var setLastClass = function(){
			var lastThumbnail = function(){
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

			lastThumbnail();
			$(window).resize(function(){
				lastThumbnail();
			});
		};

		/**
		 * setSuperBoxHeight
		 * 
		 * Set superbox-show outer height based on default height,
		 * based on viewport height,
		 * based on standard 2:3 ratio,
		 * based on default orientation.
		 */
		var setSuperBoxHeight = (function(){
			var thisWidth = $('.superbox-show').outerWidth(true),
				thisHeight = defaults.height + (16 * 3), /* 1.5em padding */
				newHeight = thisHeight,
				thisWindow = $(window).height() * 0.80,
				thisView = defaults.view,
				thisRatio = 0.6667;

			if (newHeight > thisWindow) {
				newHeight = thisWindow;
			}
			if ((thisView === 'landscape') && (thisWidth < newHeight / thisRatio)) {
				newHeight = thisWidth * thisRatio;
			}
			if ((thisView === 'portrait') && (thisWidth < newHeight * thisRatio)) {
				newHeight = thisWidth / thisRatio;
			}
			if ((thisView === 'square') && (thisWidth < newHeight)) {
				newHeight = thisWidth;
			}
			$('.superbox-show').outerHeight(newHeight);
		});

		/**
		 * setSuperboxWidth
		 * 
		 * Set superbox-show outer width based # of thumbnails.
		 */
		var setSuperboxWidth = (function(){
			if ($(window).width() > 1024) {
				if ($('.superbox-show').outerWidth(true) != sbList.width()*8) {
					$('.superbox-show').outerWidth(sbList.width()*8);
				}
			} else if ($(window).width() > 767) {
				if ($('.superbox-show').outerWidth(true) != sbList.width()*6) {
					$('.superbox-show').outerWidth(sbList.width()*6);
				}
			} else if ($(window).width() > 485) {
				if ($('.superbox-show').outerWidth(true) != sbList.width()*4) {
					$('.superbox-show').outerWidth(sbList.width()*4);
				}
			} else {
				if ($('.superbox-show').outerWidth(true) != sbList.width()*2) {
					$('.superbox-show').outerWidth(sbList.width()*2);
				}
			}
		});

		/**
		 * createSuperboxShow
		 * 
		 * Dynamically create superbox-show and insert it after superbox-last,
		 * apply data-img of the thumbnail to the source of the full image,
		 * open the superbox-show,
		 * fade in and out of each image,
		 * animate image to top of clicked row,
		 * close superbox-show when X is clicked,
		 * close superbox-show when open image is clicked
		 */
		var createSuperboxShow = function(elem){
			/*
			 * DECLARATIONS (createSuperboxShow)
			 */
			var noSuperbox = !$('.superbox-show').length,
				isOpen = elem.hasClass('superbox-O'),
				notLast = !elem.hasClass('superbox-last'),
				notInRowA = !elem.nextAll('.superbox-last:first').next('.superbox-show').length,
				notInRowB = !elem.next('.superbox-show').length,
			/*
			 * METHODS (createSuperboxShow)
			 */
				fabricate = function(type){
					if (type === 'A') {
						createAfterLastA();
					} else {
						createAfterLastB();
					}
					setImageData(elem);
					openSuperboxShow();
				},
				createAfterLastA = function(){
					sbShow.append(sbImg).append(sbClose).insertAfter(elem.nextAll('.superbox-last:first'));
					setSuperBoxHeight();
					setSuperboxWidth();
				},
				createAfterLastB = function(){
					sbShow.append(sbImg).append(sbClose).insertAfter(elem);
					setSuperBoxHeight();
				},
				setImageData = function(elem){
					$('.superbox-show img.superbox-current-img').attr('src',elem.find('img').data('img'));
				},
				openSuperboxShow = function(){
					$('.superbox-show').slideDown('slow',function(){
						moveToTop();
						setOpenClass(true);
					});
				},
				moveToTop = function(){
					$('html, body').animate({
						scrollTop:$('.superbox-show').position().top - elem.width()
					}, 'medium',function(){
						revealImage(true);
					});
				},
				setOpenClass = function(bool){
					if (bool === true) {
						sbList.removeClass('superbox-O');
						elem.addClass('superbox-O');
					} else {
						sbList.removeClass('superbox-O');
					}
				},
				revealImage = function(bool){
					if (bool === true) {
						$('.superbox-show img.superbox-current-img').animate({opacity:1},750);
					} else {
						$('.superbox-show img.superbox-current-img').animate({opacity:0},100,function(){
							setImageData(elem);
						});
					}
				},
				quickSwap = function(){
					revealImage(false);
					revealImage(true);
					setOpenClass(true);
				},
				closeSuperBoxShow = function(){
					var closeUp = function(){
						revealImage(false);
						$('.superbox-show').slideUp(function(){
							$(this).remove();
							setOpenClass(false);
							revealImage(false);
						});
					};
					$('.superbox-close').on('click',function(event){
						event.preventDefault();
						closeUp();
					});
					if (isOpen === true) {
						closeUp();
					}
				};

			/*
			 * IMPLEMENTATION (createSuperboxShow)
			 */
			if (isOpen === false) {
				if (notLast === true && notInRowA === true) {
					if (noSuperbox === true) {
						fabricate('A');
					} else {
						revealImage(false);
						$('.superbox-show').slideUp(function(){
							fabricate('A');
						});
					}
				} else if (notLast === false && notInRowB === true) {
					if (noSuperbox === true) {
						fabricate('B');
					} else {
						revealImage(false);
						$('.superbox-show').slideUp(function(){
							revealImage(false);
							fabricate('B');
						});
					}
				} else {
					quickSwap();
				}
			}

			closeSuperBoxShow();
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
		 * useDefaults
		 * 
		 * Make us of and apply user settings
		 */
		var useDefaults = function(){
			if (defaults.background !== null) {
				$('.superbox-show ').css('background-color',defaults.background);
			}
			if (defaults.border !== null) {
				$('.superbox-show img.superbox-current-img').css('border-color',defaults.border);
			}
			if (defaults.xColor !== null) {
				$('.superbox-close').css('color',defaults.xColor);
			}
			if (defaults.xShadow == 'emboss') {
				$('.superbox-close').css('text-shadow','0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(250,250,250,0.2)');
			} else if (defaults.xShadow == 'embed') {
				$('.superbox-close').css('text-shadow','0 -1px 0 rgba(0,0,0,0.4), 0 1px 0 rgba(250,250,250,0.5)');
			}
		};

		/**
		 * keyBoardNav
		 * 
		 * Allows use of left and right arrow keys to navigate through images.
		 */
		var keyBoardNav = function(){
			$(document.documentElement).keyup(function (event) {
				var direction = null,
					selector = null;
				if (event.keyCode == 37) {
					/*
					 * go left
					 */
					direction = 'prev';
					selector = '.superbox-list';
				} else if (event.keyCode == 39) {
					/*
					 * go right
					 */
					direction = 'nextAll';
					selector = '.superbox-list:first';
				}
				if (direction !== null) {
					$('.superbox-O')[direction](selector).click();
				}
			});
		};

		/*
		 * IMPLEMENTATION
		 */

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

		/*
		 * Adjust superbox-show height and width based on window size
		 */
		$(window).resize(function(){
			setSuperBoxHeight();
			setSuperboxWidth();
		});

		/*
		 * Create final float
		 */
		sbFloat.appendTo(this);

		/*
		 * Open/Close superbox-show based on click
		 */
		sbList.on('click',function(){

			/*
			 * Set sbImgBottom to bottom position of clicked image
			 */
			sbImgBottom = $(this).find('img').offset().top + $(this).find('img').height();

			/*
			 * Create superbox-show
			 */
			createSuperboxShow($(this));

			/*
			 * Keep superbox-show after the proper row at all times
			 */
			keepShowAfterLast();

			useDefaults();
		});

		keyBoardNav();

		return this;
	};
})(jQuery);