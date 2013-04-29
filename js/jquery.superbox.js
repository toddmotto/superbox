/**
 * SuperBox
 * The lightbox reimagined. Fully responsive HTML5 image galleries.
 * 
 * Latest version: https://github.com/seyDoggy/superbox
 * Original version: https://github.com/toddmotto/superbox
 * 
 * License <https://github.com/seyDoggy/superbox/blob/master/LICENSE.txt>
 */
 ;(function($, undefined) {
	'use strict';

	var pluginName = 'SuperBox',
		pluginVersion = '3.0.4';

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
		var sbIsIconShown = false,
			sbShow = $('<div class="superbox-show"/>'),
			sbImg = $('<img src="img/ajax-loader.gif" class="superbox-current-img"/>'),
			sbClose = $('<a href="#" class="superbox-close"><i class="icon-remove-sign"></i></a>'),
			sbPrev = $('<a href="#" class="superbox-prev"><i class="icon-circle-arrow-left"></i></a>'),
			sbNext = $('<a href="#" class="superbox-next"><i class="icon-circle-arrow-right"></i></a>'),
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
		 * setSuperboxLayout
		 * 
		 * Removes previously set classes,
		 * Add classes based on parent width,
		 * Set .superbox.show width based number of columns
		 */
		var setSuperboxLayout = function(num){
			var setColumns = function(num){
				var lastItem,
					columnClass = 'superbox-' + num,
					classArray = ['superbox-last','superbox-8','superbox-6','superbox-4','superbox-2'];
				if (num === 8) {
					lastItem = sbList8;
				} else if (num === 6) {
					lastItem = sbList6;
				} else if (num === 4) {
					lastItem = sbList4;
				} else if (num === 2) {
					lastItem = sbList2;
				}
				/*
				 * remove classes
				 */
				for (var i = classArray.length - 1; i >= 0; i--) {
					sbList.removeClass(classArray[i]);
				}
				/*
				 * add classes
				 */
				sbList.addClass(columnClass);
				lastItem.addClass('superbox-last');
				/*
				 * set superbox-show width
				 */
				if ($('.superbox-show').outerWidth(true) != sbList.width()*num) {
					$('.superbox-show').outerWidth(sbList.width()*num);
				}
			};
			if ($('.superbox-active').width() > 1024) {
				setColumns(8);
			} else if ($('.superbox-active').width() > 767) {
				setColumns(6);
			} else if ($('.superbox-active').width() > 485) {
				setColumns(4);
			} else {
				setColumns(2);
			}
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
		 * createSuperboxShow
		 * 
		 * Dynamically create superbox-show and insert it after superbox-last,
		 * apply data-img of the thumbnail to the source of the full image,
		 * preload previous and next full size image data into DOM,
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
				openSuperBoxShow = function(type){
					if (type === 'A') {
						sbShow.append(sbImg).append(sbClose).append(sbPrev).append(sbNext).insertAfter(elem.nextAll('.superbox-last:first'));
					} else {
						sbShow.append(sbImg).append(sbClose).insertAfter(elem);
					}
					setSuperBoxHeight();
					setSuperboxLayout();
					setImageData();
					$('.superbox-show').slideDown('slow',function(){
						moveToTop();
						setOpenClass(true);
					});
				},
				setImageData = function(){
					$('.superbox-show img.superbox-current-img').attr('src',elem.find('img').data('img'));
					preloadImageData();
				},
				preloadImageData = function(){
					var imgPrev = new Image(),
						imgNext = new Image();
					imgPrev.src = elem.prev().find('img').data('img');
					imgNext.src = elem.next().find('img').data('img');
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
						if (sbIsIconShown === false) {
							revealIcons(true);
						}
					} else {
						$('.superbox-show img.superbox-current-img').animate({opacity:0},100,function(){
							setImageData();
						});
					}
				},
				revealIcons = function(bool){
					if (bool === true) {
						sbIsIconShown = true;
						$('.superbox-active .superbox-close, .superbox-active .superbox-prev, .superbox-active .superbox-next').animate({opacity:0.7},750);
					} else {
						sbIsIconShown = false;
						$('.superbox-active .superbox-close, .superbox-active .superbox-prev, .superbox-active .superbox-next').animate({opacity:0},100);
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
						revealIcons(false);
						$('.superbox-show').slideUp(function(){
							$(this).remove();
							setOpenClass(false);
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
						openSuperBoxShow('A');
					} else {
						revealImage(false);
						$('.superbox-show').slideUp(function(){
							openSuperBoxShow('A');
						});
					}
				} else if (notLast === false && notInRowB === true) {
					if (noSuperbox === true) {
						openSuperBoxShow('B');
					} else {
						revealImage(false);
						$('.superbox-show').slideUp(function(){
							openSuperBoxShow('B');
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
		// setSuperboxLayout();

		/*
		 * Adjust superbox-show height and width based on window size
		 */
		setSuperboxLayout();
		$(window).resize(function(){
			setSuperBoxHeight();
			setSuperboxLayout();
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
			 * Create superbox-show
			 */
			createSuperboxShow($(this));

			/*
			 * Apply user settings
			 */
			useDefaults();
		});

		/*
		 * Keep superbox-show after the proper row at all times
		 */
		keepShowAfterLast();

		/*
		 * Enable keyboard navigation
		 */
		keyBoardNav();

		return this;
	};
})(jQuery);