/**
 * @file 字体广场－图标广场
 * @author hanbingbing(hanbingbing@baidu.com)
 */

define(function (require, exports) {
    var Vue = require('vue');

    function bindEvents() {
        $('.user span').bind('click', function () {
            $('.user').find('.user-login').removeClass('init bounceOutUp').addClass('bounceInDown');
        });
        $('.main').on('click', function(e) {
            if ($('.user-login').hasClass('bounceInDown')) {
                $('.user-login').removeClass('bounceInDown').addClass('bounceOutUp');
            }
        });
        $('.login-github').bind('click', function () {
            location.href = '/profile/github';
        });
        $('.main').on('click', '.glyf-item', function (e) {
            var $this = $(this);
            var $precious = $this.clone();
            $precious.css({
                'position': 'fixed',
                'left': $this.offset().left,
                'top': $this.offset().top,
                'z-index': 1000
            }).addClass('.precious').appendTo($('.main'));
            main($precious, $('.shop'));
            var obj = {};
            obj.fontFile = $precious.data('file');
            obj.index = $precious.data('index');
            $.get('/sets/store', obj).then(function (response) {
                console.log(response);
            });
        })
    }

    function getBezier(p0, p2) {
        var p1 = {
            x: p0.x + (p2.x - p0.x) * 0.3,
            y: Math.min(p0.y, p2.y) * 0.5
        };
        return function (t) {
            return {
                x: p0.x * (1 - t) * (1 - t) + 2 * p1.x * t * (1 - t) + p2.x * t * t,
                y: p0.y * (1 - t) * (1 - t) + 2 * p1.y * t * (1 - t) + p2.y * t * t
            };
        }
    }

    // 缓动函数 http://dev.qwrap.com/resource/js/components/anim/easing.js
    function ease(p) {
        if ((p /= 0.5) < 1) return 1 / 2 * p * p;
        return -1 / 2 * ((--p) * (p - 2) - 1);
    }

    function main(from, end) {

        var p0 = {
            x: parseInt(from.offset().left),
            y: parseInt(from.offset().top)
        };

        var p2 = {
            x: parseInt(end.offset().left),
            y: parseInt(end.offset().top)
        };
        var getPos = getBezier(p0, p2);
        var tick = 0;
        var animateId = 0;
        (function drawFrame () {
            if (tick * 15 < 1000) {
                animatedId = window.requestAnimationFrame(drawFrame);
                var percent = tick * 15 / 1000;
                var pos = getPos(ease(percent));
                from.css({
                    left: pos.x,
                    top: pos.y
                });

                tick++;
            }
            else {
                from.remove();
                cancelAnimationFrame(animateId);
            }
        }());
    }

    /**
     * 字体广场列表
     *
     * @type {Object}
     */
    var setList = {

        init: function () {
        }
    };

    exports.init = function () {
        setList.init();
        bindEvents();
    };
});
