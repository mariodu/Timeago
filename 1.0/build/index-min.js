/*!build time : 2013-10-20 12:20:43 AM*/
KISSY.add("gallery/Timeago/1.0/index",function(a,b,c){function d(){var b=e(this),c=a.timeago.settings;return isNaN(b.datetime)||(0==c.cutoff||g(b.datetime)<c.cutoff)&&h(this).text(f(b.datetime)),this}function e(b){if(b=h(b),!b.data("timeago")){b.data("timeago",{datetime:a.timeago.datetime(b)});var c=a.trim(b.text());a.timeago.settings.localeTitle?b.attr("title",b.data("timeago").datetime.toLocaleString()):!(c.length>0)||a.timeago.isTime(b)&&b.attr("title")||b.attr("title",c)}return b.data("timeago")}function f(b){return a.timeago.inWords(g(b))}function g(a){return(new Date).getTime()-a.getTime()}var h=b.all;a.timeago=function(b){return b instanceof Date?f(b):"string"==typeof b?f(a.timeago.parse(b)):"number"==typeof b?f(new Date(b)):f(a.timeago.datetime(b))},a.mix(a.timeago,{settings:{refreshMillis:6e4,allowFuture:!1,localeTitle:!1,cutoff:0,locales:"zh-cn"},inWords:function(b){function d(c,d){var f=a.isFunction(c)?c(d,b):c,g=e.numbers&&e.numbers[d]||d;return f.replace(/%d/i,g)}var e=c[this.settings.locales],f=e.prefixAgo,g=e.suffixAgo;this.settings.allowFuture&&0>b&&(f=e.prefixFromNow,g=e.suffixFromNow);var h=Math.abs(b)/1e3,i=h/60,j=i/60,k=j/24,l=k/365,m=45>h&&d(e.seconds,Math.round(h))||90>h&&d(e.minute,1)||45>i&&d(e.minutes,Math.round(i))||90>i&&d(e.hour,1)||24>j&&d(e.hours,Math.round(j))||42>j&&d(e.day,1)||30>k&&d(e.days,Math.round(k))||45>k&&d(e.month,1)||365>k&&d(e.months,Math.round(k/30))||1.5>l&&d(e.year,1)||d(e.years,Math.round(l)),n=e.wordSeparator||"";return void 0===e.wordSeparator&&(n=" "),a.trim([f,m,g].join(n))},parse:function(b){var c=a.trim(b);return c=c.replace(/\.\d+/,""),c=c.replace(/-/,"/").replace(/-/,"/"),c=c.replace(/T/," ").replace(/Z/," UTC"),c=c.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(c)},datetime:function(b){var c=a.timeago.isTime(b)?h(b).attr("datetime"):h(b).attr("title");return a.timeago.parse(c)},isTime:function(a){return"time"===h(a)[0].tagName.toLowerCase()}});var i={init:function(){var b=a.bind(d,this);b();var c=a.timeago.settings;c.refreshMillis>0&&(this._timeagoInterval=setInterval(b,c.refreshMillis))},update:function(b){var c=a.timeago.parse(b);h(this).data("timeago",{datetime:c}),a.timeago.settings.localeTitle&&h(this).attr("title",c.toLocaleString()),d.apply(this)},updateFromDOM:function(){h(this).data("timeago",{datetime:a.timeago.parse(a.t.isTime(this)?h(this).attr("datetime"):h(this).attr("title"))}),d.apply(this)},dispose:function(){this._timeagoInterval&&(window.clearInterval(this._timeagoInterval),this._timeagoInterval=null)}};return a.augment(b,{timeago:function(b,c){var d=b?i[b]:i.init;if(!d)throw new Error("Unknown function name '"+b+"' for timeago");return a.each(this,function(a){d.call(a,c)}),this}}),document.createElement("abbr"),document.createElement("time"),b},{requires:["node","timeago/i18n"]});