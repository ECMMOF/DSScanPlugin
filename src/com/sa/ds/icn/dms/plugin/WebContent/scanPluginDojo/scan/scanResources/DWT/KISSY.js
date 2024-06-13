//if (KISSY) {
//	var S = KISSY;
//	S.use([ 'node', 'dom', 'event' ], function(S, Node, DOM, Event) {
//		var $ = S.all, _li = $('li', 'ul.PCollapse'), o = S
//				.one('#dwtcontrolContainer');
//		$('div.divType', _li).each(
//				function(_this) {
//					_this.on('click', function() {
//						var _thisDOM = S.one(_this);
//						if (_thisDOM.next().css('display') === 'none') {
//							$('.expanded', _li).addClass('collapsed')
//									.removeClass('expanded');
//							$('div.divTableStyle', _li).hide();
//							_thisDOM.next().show();
//							$('.mark_arrow', _this).addClass('expanded')
//									.removeClass('collapsed');
//						}
//					});
//				});
//	});
//}