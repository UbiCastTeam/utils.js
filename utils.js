/*******************************************
* Utilities functions                      *
* Author: Stephane Diemer                  *
*******************************************/
/* globals SparkMD5 */

// add console functions for old browsers
if (!window.console)
    window.console = {};
if (!window.console.log)
    window.console.log = function () {};
if (!window.console.error)
    window.console.error = window.console.log;
if (!window.console.debug)
    window.console.debug = window.console.log;
if (!window.console.info)
    window.console.info = window.console.log;
if (!window.console.warn)
    window.console.warn = window.console.log;

// add indexOf method to Array (for IE8)
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === null)
            throw new TypeError("\"this\" is undefined or null.");
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0)
            return -1;
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity)
            n = 0;
        if (n >= len)
            return -1;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement)
                return k;
            k++;
        }
        return -1;
    };
}

// add keys method to Object (for IE < 9)
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable("toString"),
            dontEnums = [
                "toString",
                "toLocaleString",
                "valueOf",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "constructor"
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== "object" && (typeof obj !== "function" || obj === null))
                throw new TypeError("Object.keys called on non-object");

            var result = [], prop, i;
            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop))
                  result.push(prop);
            }
            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i]))
                        result.push(dontEnums[i]);
                }
            }
            return result;
        };
    }());
}

// add repeat method to String (for all IE)
if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        if (isNaN(count) || count < 0)
            throw new TypeError("Invalid value for \"count\".");
        var i = 0;
        var n = "";
        while (i < count) {
            n += this;
            i++;
        }
        return n;
    };
}
// add endsWith method to String (for IE11)
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, thisLen) {
        if (thisLen === undefined || thisLen > this.length) {
            thisLen = this.length;
        }
        return this.substring(thisLen - search.length, thisLen) === search;
    };
}


// add Event management for ie9+
if (typeof window.Event !== 'function') {
    var newEvent = function Event (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    newEvent.prototype = window.Event.prototype;
    window.Event = newEvent;
}


var utils = {};

// cookies
utils.get_cookie = function (name, defaultValue) {
    if (document.cookie.length > 0) {
        var cStart = document.cookie.indexOf(name + "=");
        if (cStart != -1) {
            cStart = cStart + name.length + 1;
            var cEnd = document.cookie.indexOf(";", cStart);
            if (cEnd == -1)
                cEnd = document.cookie.length;
            return window.unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return defaultValue !== undefined ? defaultValue : "";
};
utils.set_cookie = function (name, value, expireDays) {
    var exDate = new Date();
    exDate.setDate(exDate.getDate() + (expireDays ? expireDays : 360));
    var secure = window.location.href.indexOf("https://") === 0 ? "; secure" : "";
    document.cookie = name + "=" + window.escape(value) + "; expires=" + exDate.toUTCString() + "; path=/; samesite=none" + secure;
};

// strip function
utils.strip = function (str, characters) {
    if (!str)
        return str;
    var crs = characters !== undefined ? characters : " \n\r\t ";  // the last space is a non secable space
    var start = 0;
    while (start < str.length && crs.indexOf(str[start]) != -1) {
        start++;
    }
    var end = str.length - 1;
    while (end >= 0 && crs.indexOf(str[end]) != -1) {
        end--;
    }
    var result = str.substring(start, end+1);
    return result;
};

// isinstance
utils.isinstance = function (obj, type) {
    if (typeof obj == "object") {
        var matching = obj.constructor.toString().match(new RegExp(type, "i"));
        return (matching !== null);
    }
    return false;
};

// decode html
utils.decode_html = function (data) {
    var div = document.createElement("div");
    div.innerHTML = data;
    // handle case of empty input
    return div.childNodes.length === 0 ? "" : div.childNodes[0].nodeValue;
};

// escape html
utils.escape_html = function (text) {
    if (!text)
        return text;
    var result = text.toString();
    result = result.replace(/(<)/g, "&lt;");
    result = result.replace(/(>)/g, "&gt;");
    result = result.replace(/(\n)/g, "<br/>");
    result = result.replace(/(\")/g, "&quot;");
    return result;
};
// escape html
utils.strip_html = function (html) {
    if (!html)
        return html;
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
};

// escape attribute
utils.escape_attr = function (attr) {
    if (!attr)
        return attr;
    var result = attr.toString();
    result = result.replace(/(\n)/g, "&#13;&#10;");
    result = result.replace(/(\")/g, "&quot;");
    return result;
};

// get click relative coordinates
utils.get_click_position = function (evt, dom) {
    var element = dom, x_offset = 0, y_offset = 0;
    // get canvas offset
    while (element !== null && element !== undefined) {
        x_offset += element.offsetLeft;
        y_offset += element.offsetTop;
        element = element.offsetParent;
    }
    return { x: evt.pageX - x_offset, y: evt.pageY - y_offset };
};

// user agent and platform related functions
utils._get_user_agent = function () {
    if (window.navigator && window.navigator.userAgent)
        utils.user_agent = window.navigator.userAgent.toLowerCase();
    else
        utils.user_agent = "unknown";
};
utils._get_user_agent();

utils._get_ios_version = function () {
    var version = 0;
    version = parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || false;
    return version;
};

utils._get_os_name = function () {
    var name = "";
    if (window.navigator && window.navigator.userAgentData) {
        window.navigator.userAgentData.getHighEntropyValues(["platform"]).then(function (data) {
            if (data.platform) {
                name = data.platform.toLowerCase();
                if (data.platform == 'Mac OS X') {
                    name = 'macos';
                }
            }
            utils.os_name = name ? name : "unknown";
            utils["os_is_"+name] = true;
        });
    } else {
        if (window.navigator && window.navigator.platform) {
            var platform = window.navigator.platform.toLowerCase();
            if (platform.indexOf("ipad") != -1 || platform.indexOf("iphone") != -1 || platform.indexOf("ipod") != -1) {
                name = "ios";
                utils.os_version = utils._get_ios_version();
            }
        }
        if (!name && window.navigator && window.navigator.appVersion) {
            var app_version = window.navigator.appVersion.toLowerCase();
            if (app_version.indexOf("win") != -1)
                name = "windows";
            else if (app_version.indexOf("mac") != -1)
                name = "macos";
            else if (app_version.indexOf("x11") != -1 || app_version.indexOf("linux") != -1)
                name = "linux";
        }
        utils.os_name = name ? name : "unknown";
        utils["os_is_"+name] = true;
    }
};
utils._get_os_name();
utils._extract_browser_version = function (ua, re) {
    var matches = ua.match(re);
    if (matches && !isNaN(parseInt(matches[1], 10))) {
        var vNumb = "";
        if (!isNaN(parseInt(matches[2], 10))) {
            vNumb = matches[2];
            while (vNumb.length < 10) {
                // zero padding to be able to compare versions
                vNumb = "0" + vNumb;
            }
        }
        vNumb = matches[1] + "." + vNumb;
        return parseFloat(vNumb);
    }
    return 0.0;
};
utils._get_browser_info = function () {
    // get browser name and version
    var name = "unknown";
    var version = 0.0;
    if (window.navigator && window.navigator.userAgentData) {
        utils.is_mobile = window.navigator.userAgentData.mobile;
        var browser = window.navigator.userAgentData.uaList ? window.navigator.userAgentData.uaList[0] : null;
        if (browser) {
            name = browser.brand.toLowerCase();
            version = parseFloat(browser.version);
            if (browser.brand == 'Google Chrome') {
                name = 'chrome';
            }
        }
    } else {
        var ua = utils.user_agent;
        if (ua.indexOf("firefox") != -1) {
            name = "firefox";
            version = utils._extract_browser_version(ua, /firefox\/(\d+)\.(\d+)/);
            if (!version)
                version = utils._extract_browser_version(ua, /rv:(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("edge") != -1) {
            name = "edge";
            version = utils._extract_browser_version(ua, /edge\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("chromium") != -1) {
            name = "chromium";
            version = utils._extract_browser_version(ua, /chromium\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("chrome") != -1) {
            name = "chrome";
            version = utils._extract_browser_version(ua, /chrome\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("iemobile") != -1) {
            name = "iemobile";
            version = utils._extract_browser_version(ua, /iemobile\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("msie") != -1) {
            name = "ie";
            version = utils._extract_browser_version(ua, /msie (\d+)\.(\d+)/);
            if (version < 7)
                utils.browser_is_ie6 = true;
            else if (version < 8)
                utils.browser_is_ie7 = true;
            else if (version < 9)
                utils.browser_is_ie8 = true;
            else
                utils.browser_is_ie9 = true;
        }
        else if (ua.indexOf("trident") != -1) {
            name = "ie";
            version = utils._extract_browser_version(ua, /rv.{1}(\d+)\.(\d+)/);
            utils.browser_is_ie9 = true;
        }
        else if (ua.indexOf("opera") != -1) {
            name = "opera";
            version = utils._extract_browser_version(ua, /opera\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("konqueror") != -1) {
            name = "konqueror";
            version = utils._extract_browser_version(ua, /konqueror\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("mobile safari") != -1) {
            name = "mobile_safari";
            version = utils._extract_browser_version(ua, /mobile safari\/(\d+)\.(\d+)/);
        }
        else if (ua.indexOf("safari") != -1) {
            name = "safari";
            version = utils._extract_browser_version(ua, /version\/(\d+)\.(\d+)/);
        }
        // detect type of device
        utils.is_phone = ua.indexOf("iphone") != -1 || ua.indexOf("ipod") != -1 || ua.indexOf("android") != -1 || ua.indexOf("iemobile") != -1 || ua.indexOf("opera mobi") != -1 || ua.indexOf("opera mini") != -1 || ua.indexOf("windows ce") != -1 || ua.indexOf("fennec") != -1 || ua.indexOf("series60") != -1 || ua.indexOf("symbian") != -1 || ua.indexOf("blackberry") != -1 || window.orientation !== undefined;
        utils.is_tablet = window.navigator && window.navigator.platform == "iPad";
        utils.is_mobile = utils.is_phone || utils.is_tablet;
    }
    utils.is_tactile = document.documentElement && "ontouchstart" in document.documentElement;

    utils.browser_name = name;
    utils["browser_is_"+name] = true;
    utils.browser_version = version;
};
utils._get_browser_info();

utils.webgl_available = function (canvas, options, browserName) {
    var webglAvailable = !! window.WebGLRenderingContext;
    if (webglAvailable) {
        try {
            var webglContext;
            if (browserName === "safari")
                webglContext = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
            else
                webglContext = canvas.getContext("webgl2", options) || canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
            if (!webglContext) {
                console.log("Impossible to initialize WebGL context. Your browser does not support Webgl context");
                return null;
            }
            return webglContext;
        } catch(e) {
            console.log("WebGL context is supported but may be disable, please check your browser configuration");
            return null;
        }
    }
    console.log("Your browser does not support Webgl context");
    return null;
};

utils.isInIframe = function () {
    var isInIframe = window.frameElement && window.frameElement.nodeName == "IFRAME";
    if (isInIframe)
        return true;
    return false;
};


// Translations utils
utils._translations = { en: {} };
utils._current_lang = "en";
utils._current_catalog = utils._translations.en;
utils.use_lang = function (lang) {
    utils._current_lang = lang;
    if (!utils._translations[lang])
        utils._translations[lang] = {};
    utils._current_catalog = utils._translations[lang];
};
utils.add_translations = function (translations, lang) {
    var catalog;
    if (lang) {
        if (!utils._translations[lang])
            utils._translations[lang] = {};
        catalog = utils._translations[lang];
    } else {
        catalog = utils._current_catalog;
    }
    for (var text in translations) {
        if (translations.hasOwnProperty(text))
            catalog[text] = translations[text];
    }
};
utils.translate = function (text) {
    if (text in utils._current_catalog)
        return utils._current_catalog[text];
    else if (utils._current_lang != "en" && text in utils._translations.en)
        return utils._translations.en[text];
    return text;
};
utils.get_date_display = function (d) {
    // date format %Y-%m-%d %H:%M:%S
    var date_split = d.split(" ");
    if (date_split.length < 2)
        return "";
    var ymd_split = date_split[0].split("-");
    var hms_split = date_split[1].split(":");
    if (ymd_split.length < 3 || hms_split.length < 3)
        return "";
    // year
    var year = ymd_split[0];
    // month
    var month = ymd_split[1];
    switch (ymd_split[1]) {
        case "01": month = utils.translate("January");   break;
        case "02": month = utils.translate("February");  break;
        case "03": month = utils.translate("March");     break;
        case "04": month = utils.translate("April");     break;
        case "05": month = utils.translate("May");       break;
        case "06": month = utils.translate("June");      break;
        case "07": month = utils.translate("July");      break;
        case "08": month = utils.translate("August");    break;
        case "09": month = utils.translate("September"); break;
        case "10": month = utils.translate("October");   break;
        case "11": month = utils.translate("November");  break;
        case "12": month = utils.translate("December");  break;
    }
    // day
    var day = ymd_split[2];
    try { day = parseInt(ymd_split[2], 10); } catch (e) { }
    // hour
    var hour = parseInt(hms_split[0], 10);
    // minute
    var minute = parseInt(hms_split[1], 10);
    if (minute < 10)
        minute = "0"+minute;
    // time
    var time;
    if (utils._current_lang == "fr") {
        // 24 hours time format
        if (hour < 10)
            hour = "0"+hour;
        time = hour+"h"+minute;
    } else {
        // 12 hours time format
        var moment = "PM";
        if (hour < 13) {
            moment = "AM";
            if (!hour)
                hour = 12;
        } else {
            hour -= 12;
        }
        time = hour+":"+minute+" "+moment;
    }
    return day+" "+month+" "+year+" "+utils.translate("at")+" "+time;
};
utils.get_size_display = function (value) {
    if (!value || isNaN(value))
        return "0 " + utils.translate("B");
    var unit = "";
    if (value > 1000) {
        value /= 1000;
        unit = "k";
        if (value > 1000) {
            value /= 1000;
            unit = "M";
            if (value > 1000) {
                value /= 1000;
                unit = "G";
                if (value > 1000) {
                    value /= 1000;
                    unit = "T";
                }
            }
        }
    }
    return value.toFixed(1) + " " + unit + utils.translate("B");
};

// Versions comparison
utils.compare_versions = function (v1, comparator, v2) {
    comparator = comparator == "=" ? "==" : comparator;
    var v1parts = v1.split("."), v2parts = v2.split(".");
    var maxLen = Math.max(v1parts.length, v2parts.length);
    var part1, part2;
    var cmp = 0;
    for (var i=0; i < maxLen && !cmp; i++) {
        part1 = parseInt(v1parts[i], 10) || 0;
        part2 = parseInt(v2parts[i], 10) || 0;
        if (part1 < part2)
            cmp = 1;
        if (part1 > part2)
            cmp = -1;
    }
    return eval("0" + comparator + cmp);
};

// JavaScript classes related functions
utils.setup_class = function (obj, options, allowed_options) {
    // translations
    if (!obj.constructor.prototype.add_translations)
        obj.constructor.prototype.add_translations = function (translations) {
            utils.add_translations(translations);
        };
    if (!obj.constructor.prototype.translate)
        obj.constructor.prototype.translate = function (text) {
            return utils.translate(text);
        };
    // options
    if (allowed_options)
        obj.allowed_options = allowed_options;
    if (!obj.constructor.prototype.set_options)
        obj.constructor.prototype.set_options = function (options) {
            if (options.translations) {
                utils.add_translations(options.translations);
                delete options.translations;
            }
            if (this.allowed_options) {
                for (var i=0; i < this.allowed_options.length; i++) {
                    if (this.allowed_options[i] in options)
                        this[this.allowed_options[i]] = options[this.allowed_options[i]];
                }
            }
            else {
                for (var param in options) {
                    if (options.hasOwnProperty(param))
                        this[param] = options[param];
                }
            }
        };
    if (options)
        obj.set_options(options);
};

// MD5 sum computation (requires the SparkMD5 library)
utils.compute_md5 = function (file, callback, progress_callback) {
    if (!window.File)
        return callback("unsupported");
    var blobSlice = window.File.prototype.slice || window.File.prototype.mozSlice || window.File.prototype.webkitSlice;
    var chunkSize = 2097152; // Read in chunks of 2MB
    var chunks = Math.ceil(file.size / chunkSize);
    var currentChunk = 0;
    var spark = new SparkMD5.ArrayBuffer();
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
        spark.append(e.target.result); // Append array buffer
        ++currentChunk;
        if (progress_callback) {
            progress_callback(Math.min(currentChunk * chunkSize, file.size) / file.size);
        }

        if (currentChunk < chunks) {
            loadNext();
        } else {
            callback(spark.end());
        }
    };
    fileReader.onerror = function () {
        console.warn("MD5 computation failed");
    };
    function loadNext() {
        var start = currentChunk * chunkSize;
        var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    loadNext();
};

utils.focus_first_descendant = function (element) {
    for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i];
        if (utils.attempt_focus(child) ||
            utils.focus_first_descendant(child)) {
            return true;
        }
    }
    return false;
};

utils.focus_last_descendant = function (element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
        var child = element.childNodes[i];
        if (utils.attempt_focus(child) || utils.focus_last_descendant(child)) {
            return true;
        }
    }
    return false;
};
utils.ignore_until_focus_changes = false;
utils.attempt_focus = function (element) {
    if (!this.is_focusable(element)) {
        return false;
    }
    utils.ignore_until_focus_changes = true;
    try {
        element.focus();
    }
    catch (e) {
    }
    utils.ignore_until_focus_changes = false;
    return (document.activeElement === element);
};
utils.is_focusable = function (element) {
    if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }

    if (element.disabled) {
        return false;
    }

    switch (element.nodeName) {
        case 'A':
            return !!element.href && element.rel != 'ignore';
        case 'INPUT':
            return element.type != 'hidden' && element.type != 'file';
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
            return true;
        default:
            return false;
    }
};
utils.slugify = function (text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};
