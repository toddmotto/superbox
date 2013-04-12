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

		var settings = $.extend({
			background : null,
			border : null,
			xColor : null,
			xShadow : 'none'
		}, options);

		var sbShow = $('<div class="superbox-show superbox-X"/>'),
			sbImg = $('<img src="" class="superbox-current-img"/>'),
			sbClose = $('<a href="#" class="superbox-close">&#215;</a>'),
			sbFloat = $('<div class="superbox-float"/>'),
			sbList = this.find('>div');

		sbShow.append(sbImg).append(sbClose).insertAfter(sbList);

		sbFloat.appendTo(this);

		this.addClass('superbox-active');

		if (settings.background !== null) {
			sbList
				.next()
					.css({
						'background-color': settings.background
					});
		}

		if (settings.border !== null) {
			sbList
				.next()
					.find('img.superbox-current-img')
						.css({
							'border-color': settings.border
						});
		}

		if (settings.xColor !== null) {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'color': settings.xColor
						});
		}

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

		sbList.each(function(){
			var imageData = $(this).find('img').data('img');

			$(this)
				.next()
					.find('img.superbox-current-img')
						.attr('src',imageData);

			$(this).on('click',function(){

				sbList
					.next('.superbox-O')
						.removeClass('superbox-O')
						.addClass('superbox-X')
						.find('img.superbox-current-img, a.superbox-close')
							.animate({opacity:0},100)
						.end()
							.slideUp();
				$(this)
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

		});

		$('.superbox-close')
			.on('click',function(event){
				event.preventDefault();
				$(this).add($(this).siblings())
					.animate({opacity:0},100)
					.parent().slideUp();
			});

		return this;
	};
})(jQuery);