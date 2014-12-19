/*
 * 操作cookie插件
 * 作者：Jake AuYeung
 * 使用方法：
 * 1，设置cookie：wltCookier(key, value, { expires: 21 })   // expires 过期时间(单位：天)
 * 2，获取cookie：wltCookier(key)
 * 3，删除cookie：wltCookier.remove(key)
 */
;(function(){
	'use strict';


	function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch(e) {
              
        }
    }

    return (function() {

    	function wltCookier(key, value, options) {

        var cookies,
          list,
          i,
          cookie,
          pos,
          name,
          hasCookies,
          all,
          expiresFor;

        options = options || {};

        if (value !== undefined) {
          // 配置值检测
          value = typeof value === 'object' ? JSON.stringify(value) : String(value);

          if (typeof options.expires === 'number') {
            expiresFor = options.expires;
            options.expires = new Date();
            // 尝试删除COOKIE
            if (expiresFor === -1) {
              options.expires = new Date('Thu, 01 Jan 1970 00:00:00 GMT');
              // 创建一个新的值
            } else if (options.expirationUnit !== undefined) {
              if (options.expirationUnit === 'hours') {
                options.expires.setHours(options.expires.getHours() + expiresFor);
              } else if (options.expirationUnit === 'minutes') {
                options.expires.setMinutes(options.expires.getMinutes() + expiresFor);
              } else if (options.expirationUnit === 'seconds') {
                options.expires.setSeconds(options.expires.getSeconds() + expiresFor);
              } else {
                options.expires.setDate(options.expires.getDate() + expiresFor);
              }
            } else {
              options.expires.setDate(options.expires.getDate() + expiresFor);
            }
          }
          document.cookie = [
            encodeURIComponent(key),
            '=',
            encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
          ].join('');
        }

        list = [];
        all = document.cookie;
        if (all) {
          list = all.split('; ');
        }

        cookies = {};
        hasCookies = false;

        for (i = 0; i < list.length; ++i) {
          if (list[i]) {
            cookie = list[i];
            pos = cookie.indexOf('=');
            name = cookie.substring(0, pos);
            value = tryDecodeURIComponent(cookie.substring(pos + 1));

            if (key === undefined || key === name) {
              try {
                cookies[name] = JSON.parse(value);
              } catch (e) {
                cookies[name] = value;
              }
              if (key === name) {
                return cookies[name];
              }
              hasCookies = true;
            }
          }
        }
        if (hasCookies && key === undefined) {
          return cookies;
        }
      }
      wltCookier.remove = function (key, options) {
        var hasCookie = wltCookier(key) !== undefined;

        if (hasCookie) {
          if (!options) {
            options = {};
          }
          options.expires = -1;
          wltCookier(key, '', options);
        }
        return hasCookie;
      };

      window.wltCookier = wltCookier;

      return window.wltCookier;

    }());

})()