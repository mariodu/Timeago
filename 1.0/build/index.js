/*
combined files : 

gallery/Timeago/1.0/index

*/
/**
 * @fileoverview
 * @author 凌恒<jiakun.djk@alibaba-inc.com>
 * @module Timeago
 **/
KISSY.add('gallery/Timeago/1.0/index',function (S, Node, Locale) {
    var $ = Node.all;

    S.timeago = function(timestamp) {
        if (timestamp instanceof Date) {
          return inWords(timestamp);
        } else if (typeof timestamp === "string") {
          return inWords(S.timeago.parse(timestamp));
        } else if (typeof timestamp === "number") {
          return inWords(new Date(timestamp));
        } else {
          return inWords(S.timeago.datetime(timestamp));
        }
    };

    S.mix(S.timeago, {
        settings: {
            refreshMillis: 60000,
            allowFuture: false,
            localeTitle: false,
            cutoff: 0,
            locales: 'zh-cn'
        },

        inWords: function(distanceMillis) {
            var lang = Locale[this.settings.locales];
            var prefix = lang.prefixAgo;
            var suffix = lang.suffixAgo;
            if (this.settings.allowFuture) {
                if (distanceMillis < 0) {
                    prefix = lang.prefixFromNow;
                    suffix = lang.suffixFromNow;
                }
            }

            var seconds = Math.abs(distanceMillis) / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            function substitute(stringOrFunction, number) {
                var string = S.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
                var value = (lang.numbers && lang.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }

            var words = seconds < 45 && substitute(lang.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute(lang.minute, 1) ||
                minutes < 45 && substitute(lang.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute(lang.hour, 1) ||
                hours < 24 && substitute(lang.hours, Math.round(hours)) ||
                hours < 42 && substitute(lang.day, 1) ||
                days < 30 && substitute(lang.days, Math.round(days)) ||
                days < 45 && substitute(lang.month, 1) ||
                days < 365 && substitute(lang.months, Math.round(days / 30)) ||
                years < 1.5 && substitute(lang.year, 1) ||
                substitute(lang.years, Math.round(years));

            var separator = lang.wordSeparator || "";
            if (lang.wordSeparator === undefined) { separator = " "; }
            return S.trim([prefix, words, suffix].join(separator));
        },

        parse: function(iso8601) {
            var s = S.trim(iso8601);
            s = s.replace(/\.\d+/,""); // remove milliseconds
            s = s.replace(/-/,"/").replace(/-/,"/");
            s = s.replace(/T/," ").replace(/Z/," UTC");
            s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
            return new Date(s);
        },

        datetime: function(elem) {
            var iso8601 = S.timeago.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
            return S.timeago.parse(iso8601);
        },

        isTime: function(elem) {
            // jQuery's `is()` doesn't play well with HTML5 in IE
            return $(elem)[0].tagName.toLowerCase() === "time"; // $(elem).is("time");
        }
    });

    var functions = {
        init: function(){
            var refresh_el = S.bind(refresh, this);
            refresh_el();
            var setting = S.timeago.settings;
            if (setting.refreshMillis > 0) {
              this._timeagoInterval = setInterval(refresh_el, setting.refreshMillis);
            }
        },

        update: function(time){
            var parsedTime = S.timeago.parse(time);
            $(this).data('timeago', { datetime: parsedTime });
            if (S.timeago.settings.localeTitle) $(this).attr("title", parsedTime.toLocaleString());
            refresh.apply(this);
        },

        updateFromDOM: function(){
            $(this).data('timeago', { datetime: S.timeago.parse( S.t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
            refresh.apply(this);
        },

        dispose: function () {
            if (this._timeagoInterval) {
                window.clearInterval(this._timeagoInterval);
                this._timeagoInterval = null;
            }
        }
    };

    S.augment(Node, {
        timeago: function(action, options) {
            var fn = action ? functions[action] : functions.init;

            if(!fn){
              throw new Error("Unknown function name '"+ action +"' for timeago");
            }
            // each over objects here and call the requested function
            S.each(this, function(elem){
              fn.call(elem, options);
            });
            return this;
        }
    });

    function refresh() {
        var data = prepareData(this);
        var setting = S.timeago.settings;

        if (!isNaN(data.datetime)) {
          if ( setting.cutoff == 0 || distance(data.datetime) < setting.cutoff) {
            $(this).text(inWords(data.datetime));
          }
        }
        return this;
    }

    function prepareData(element) {
        element = $(element);
        if (!element.data("timeago")) {
            element.data("timeago", { datetime: S.timeago.datetime(element) });
            var text = S.trim(element.text());
            if (S.timeago.settings.localeTitle) {
                element.attr("title", element.data('timeago').datetime.toLocaleString());
            } else if (text.length > 0 && !(S.timeago.isTime(element) && element.attr("title"))) {
                element.attr("title", text);
            }
        }
        return element.data("timeago");
    }

    function inWords(date) {
        return S.timeago.inWords(distance(date));
    }

    function distance(date) {
        return (new Date().getTime() - date.getTime());
    }

    // fix for IE6 suckage
    document.createElement("abbr");
    document.createElement("time");

    return Node;
}, {requires:['node', 'timeago/i18n']});




