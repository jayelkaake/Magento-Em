    // taken from Atlas compat.js
    function registerNamespaces()
    {
        for (var i=0;i<arguments.length;i++)
        {
            var astrParts = arguments[i].split(".");
            var root = window;
            for (var j=0; j < astrParts.length; j++)
            {
                if (!root[astrParts[j]]) 
                {
                    root[astrParts[j]] = new Object(); 
                }
                root = root[astrParts[j]];
            }
        }
    }

    // -------------------------------------------------------------------------------------------------
    // Utility functions

    registerNamespaces("Plaxo.Util");

    /**
     * Simple utility for timing how long code takes. The point of having an ID for each timer is that
     * the start and elapsed calls can be in different places and they use the same global registry.

     * Example usage:
     * Plaxo.Util.Timer.startTimer('mytimer');
     * // do some codde
     * alert("seconds to run: " + Plaxo.Util.Timer.getElapsedTime('mytimer'));
     */
    Plaxo.Util.Timer = {
        timers: {},

        startTimer: function(id) {
            if (!this.enabled) return;
            this.timers.id = new Date().getTime();
        },

        getElapsedTime: function(id) {
            if (!this.enabled) return;
            var start = this.timers.id;
            if (!start) {
                alert('Unknown timer: ' + id);
            }
            return new Date().getTime() - start;
        },

        alertElapsedTime: function(id) {
            if (!this.enabled) return;
            alert('Elapsed time for "' + id + '": ' + this.getElapsedTime(id));
        },

        enabled: true,
        setTimersEnabled: function(state) {
            this.enabled = state;
        }
    };

    Plaxo.Util.Looper = {
        doLoop: function(list, func, doneFunc, loopSize, start) {
            if (!loopSize) loopSize = 500;
            if (!start) start = 0;

            var max = start + loopSize;
            var lastLoop = false;
            if (max > list.length) {
                max = list.length;
                lastLoop = true;
            }

            for (var i = start; i < max; i++) {
                func(list, i);
            }

            if (lastLoop) {
                if (doneFunc) doneFunc();
            } else {
                setTimeout(function() {
                    Plaxo.Util.Looper.doLoop(list, func, doneFunc, loopSize, max);
                }, 0);
            }
        }
    };

    // -------------------------------------------------------------------------------------------------
    // Form-manipulating functions

    registerNamespaces("Plaxo.Form");

    Plaxo.Form = {
        /**
         * Returns the selected value from the given <select> object.
         * Why this isn't a built in property/method is beyond me!
         */
        getSelectValue: function(sel) {
            if (!sel) return null;
            if (!sel.options) return sel.value; // fall back for hidden/text fields
            return sel.options[sel.selectedIndex].value;
        },

        /**
         * Focues the first visible element in the given form. 
         * Useful to call onLoad.
         */
        focusFirstVisibleFormElem: function(f, findFirstBlankField) {
            for (var i = 0; i < f.length; i++) {
                var el = f.elements[i];
                if (el.type != 'hidden' && el.style.display != 'none' && (!findFirstBlankField || el.value.length == 0) && el.focus) {
                    el.focus();
                    break;
                }
            }
        }
    };

    // -------------------------------------------------------------------------------------------------
    // String functions

    registerNamespaces("Plaxo.String");

    Plaxo.String = {
        contains: function(whole, part) {
            return whole.indexOf(part) != -1;
        },

        alnumChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_",
        isalnum: function(ch) { 
            return this.contains(this.alnumChars, ch);
        },

        otherSafeEmailChars: ".-+=",

        /** 
         * Returns the index of the char furthest in the given direction from start 
         * that's an alphanum or dot/dash char. Useful for extracting words from special chars.
         *
         * Example:
         * s = "<first-second word>";
         * findBoundary(s, 3, false) -> 2 ("f")
         * findBoundary(s, 3, true) -> 6 ("d")
         */
        findBoundary: function(s, start, forward) {
            if (forward) {
                for (var i = start; i < s.length; i++) {
                    var ch = s.charAt(i);
                    if (!Plaxo.String.isalnum(ch) && !this.contains(this.otherSafeEmailChars, ch)) {
                        return i - 1;
                    }
                }
                return s.length - 1;
            } else {
                for (var i = start - 1; i >= 0; i--) {
                    var ch = s.charAt(i);
                    if (!Plaxo.String.isalnum(ch) && !this.contains(this.otherSafeEmailChars, ch)) {
                        return i + 1;
                    }
                }
                return 0;
            }
        },

        /**
         * Returns a copy of the given list of strings with duplicates removed.
         */
        removeDups: function(strs, ignoreCase) {
            var uniqueStrs = [];
            var oldStrs = {};
            for (var i = 0; i < strs.length; i++) {
                var s = strs[i];
                if (ignoreCase) s = s.toLowerCase();
                if (!oldStrs[s]) {
                    uniqueStrs.push(strs[i]);
                    oldStrs[s] = 1;
                }
            }
            return uniqueStrs;
        }
    };

    // -------------------------------------------------------------------------------------------------
    // Debug functions

    registerNamespaces("Plaxo.Debug");

    /**
     * Basic logging/debugging facilities.
     * TODO:
     * - log to logfile
     * - send to server
     * - better info in assertion msg (line num?)
     * - set log level to silence debug info
     */
    Plaxo.Debug = {

        /**
         * Report all logging messages above this log level.
         * Values:
         *   0: no logging
         *   1: just errors
         *   2: errors & warnings
         *   3: errors, warnings, & trace messages
         */
        logLevel: 0,

        assert: function(expr, msg) {
            if (!expr) {
                if (!msg) msg = 'unk';
                throw new Error('Assertion failed: ' + msg);
            }
        },
 
        error: function(msg) {
            if (this.logLevel < 1) return;
            alert(msg); // alert errors regardless
            msg = this.format(msg, 1);
            if (this.dumpEnabled) dump(msg);
        },

        warning: function(msg) {
            if (this.logLevel < 2) return;
            msg = this.format(msg, 2);
            if (this.dumpEnabled) dump(msg);
            else alert(msg);
        },

        trace: function(msg) {
            if (this.logLevel < 3) return;
            msg = this.format(msg, 3);
            if (this.dumpEnabled) dump(msg);
            else window.status = msg;
        },

        format: function(msg, level) {
            var d = new Date();
            return level + '|' + d.toLocaleTimeString() + '.' + d.getMilliseconds() + '|' + msg + '\n';
        },

        dumpEnabled: false,

        /**
         * Tries to turn on console-dumping in mozilla.
         * TODO: doesn't seem to work in moz (prem denied)
         */
        initialize: function() {
            // turning on dump() in moz
            var PREFS_CID      = "@mozilla.org/preferences;1";
            var PREFS_I_PREF   = "nsIPref";
            var PREF_STRING    = "browser.dom.window.dump.enabled";
            try {
                var Pref        = new Components.Constructor(PREFS_CID, PREFS_I_PREF);
                var pref        = new Pref();
                pref.SetBoolPref(PREF_STRING, true);
                this.dumpEnabled = true;
            } catch(e) { 
                if (typeof(dump) != 'undefined') {
                    // turned on manually be developer
                    this.dumpEnabled = true;
                }
            }
        }
    };

    Plaxo.Debug.initialize();

    // -------------------------------------------------------------------------------------------------
    // Adding missing built-in functions

    // Emulation of array push/pop for those who lack it (IE 5.0/4.0)
    function Array_push() {
        var A_p = 0;
        for (A_p = 0; A_p < arguments.length; A_p++) {
            this[this.length] = arguments[A_p];
        }
        return this.length
    }

    function Array_pop() {
        var response = this[this.length - 1];
        this.length--;
        return response;
    }

    function Array_unshift() {
        this.reverse();
        for(var i=arguments.length-1;i>=0;i--) this[this.length]=arguments[i];
        this.reverse();
        return this.length;
    }

    if (typeof(Array.prototype.unshift) == "undefined") {
        Array.prototype.unshift = Array_unshift;
    }

    if (typeof(Array.prototype.pop) == "undefined") {
        Array.prototype.pop = Array_pop;
    }

    if (typeof Array.prototype.push == "undefined") {
        Array.prototype.push = Array_push;
    }

    function isWhitespace(c) { 
        return c == ' ' || c == '\t' || c == '\r' || c == '\n';
    }

    // emulation of string.trim()
    function String_trim(trimset) {
        if (this.length == 0) return this; // nothing to do
        if (!trimset) trimset = " \t\r\n"; // default: trim on whitespace
    
        var start=0;
        while(start<this.length && trimset.indexOf(this.charAt(start)) != -1)
        start++;

        var end=this.length-1;
        while(end>start && trimset.indexOf(this.charAt(end)) != -1)
            end--;

        if(start>0 || end<this.length-1) {
            return this.substring(start, end + 1);
        } else return this; // already trimmed
    }

    if (typeof String.prototype.trim == "undefined") {
        String.prototype.trim = String_trim;
    }

    function String_endsWith(s) {
        if (!s) return true;
        if (s.length > this.length) return false;
        var start = this.length - s.length;
        for (var i = 0; i < s.length; i++) {
            if (s.charAt(i) != this.charAt(start + i)) {
                return false;
            }
        }
        return true;
    }

    if (typeof String.prototype.endsWith == "undefined") {
        String.prototype.endsWith = String_endsWith;
    }
    
    
    /**
     * Basic functions that get stuff done. Previously in template.js
     */
    // {{{ inherits(child, parent)
    /**
     * Allow late binding of multiple inheritance.
     * Note that the constructor function never gets called c'est la vie!
     * @param child Object the object that inherits
     * @param parent Object the object to inherit from (parent)
     */
    function inherits(child, parent) {
        //methods = '';
        if (typeof parent.prototype=='function') {
            inherits(child, parent.prototype);
        }
        for (var method in parent.prototype) {
            if (method == 'prototype') { continue; }
            child[method] = parent.prototype[method];
            //methods += method + ' ';
        }
        //alert(methods);
    }
    // }}}
    // {{{ sprintf(string, var, ...)
    /**
     * Mimics PHP and C sprintf() functionality
     * @see http://jan.moesen.nu/code/javascript/sprintf-and-printf-in-javascript/
     */
    function sprintf()
    {
        if (!arguments || arguments.length < 1 || !RegExp)
        {
            return;
        }
        var str = arguments[0];
        var re = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/; //'
        var a = b = [], numSubstitutions = 0, numMatches = 0;
        while (a = re.exec(str)) {
            var leftpart = a[1], pPad = a[2], pJustify = a[3], pMinLength = a[4];
            var pPrecision = a[5], pType = a[6], rightPart = a[7];

            //alert(a + '\n' + [a[0], leftpart, pPad, pJustify, pMinLength, pPrecision);
            numMatches++;
            if (pType == '%') {
                subst = '%';
            } else {
                numSubstitutions++;
                if (numSubstitutions >= arguments.length) {
                    alert('Error! Not enough function arguments (' + (arguments.length - 1) + ', excluding the string)\nfor the number of substitution parameters in string (' + numSubstitutions + ' so far).');
                }
                var param = arguments[numSubstitutions];
                var pad = '';
                if (pPad && pPad.substr(0,1) == "'") pad = leftpart.substr(1,1);
                else if (pPad) pad = pPad;
                var justifyRight = true;
                if (pJustify && pJustify === "-") justifyRight = false;
                var minLength = -1;
                if (pMinLength) minLength = parseInt(pMinLength);
                var precision = -1;
                if (pPrecision && pType == 'f') precision = parseInt(pPrecision.substring(1));
                var subst = param;
                if (pType == 'b') subst = parseInt(param).toString(2);
                else if (pType == 'c') subst = String.fromCharCode(parseInt(param));
                else if (pType == 'd') subst = parseInt(param) ? parseInt(param) : 0;
                else if (pType == 'u') subst = Math.abs(param);
                else if (pType == 'f') subst = (precision > -1) ? Math.round(parseFloat(param) * Math.pow(10, precision)) / Math.pow(10, precision): parseFloat(param);
                else if (pType == 'o') subst = parseInt(param).toString(8);
                else if (pType == 's') subst = param;
                else if (pType == 'x') subst = ('' + parseInt(param).toString(16)).toLowerCase();
                else if (pType == 'X') subst = ('' + parseInt(param).toString(16)).toUpperCase();
            }
            str = leftpart + subst + rightPart;
        }
        return str;
    }
    // }}}
    // {{{ popup(url, title, width, height, [windowParams, top, left, isRelative])
    /**
     * Create a popup window but within dimensions of screen.
     * @author Joseph Smarr <joseph@plaxo.com>
     * @author terry chay <tychay@plaxo.com>
     * @param url string the url to point window to
     * @param title string the title for the new window (does focus if window open)
     * @param width integer width of new window
     * @param height integer height of new window
     * @param windowParams string other parameters to supply to popup
     * @param top integer offset from top
     * @param left integer offset from left
     * @param isRelative boolean if set to true, it computs top/left relative to parent
     *		window
     * @return Window object representing popup window
     */
    function popup(url, title, width, height)
    {
        var numArgs = arguments.length;
        var ht; //max height allowed (computed)
        var windowObj;	// window object that is returned.
        var windowParams = (numArgs > 4) ?  arguments[4] : 'statusbar=no,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,top=0';
        var isOffset = (numArgs > 7) ? arguments[7] : false;
        var offset;
        // {{{ top
        if (numArgs > 5) {
            if (isOffset) {
                offset = (window.screenY) ? window.screenY : self.screenTop;
                offset = (offset) ? offset : 0;
            } else {
                offset = 0;
            }
            offset += arguments[5];
            windowParams += (windowParams) ? ',' : '';
            windowParams += 'top='+offset+',screenY='+offset;;
        } else {
            windowParams += 'top=0,screenY=0';
        }
        // }}}
        // {{{ left
        if (numArgs > 6) {
            if (isOffset) {
                offset = (window.screenX) ? window.screenX : self.screenLeft;
                offset = (offset) ? offset : 0;
            } else {
                offset = 0;
            }
            offset += arguments[6];
            windowParams += ',left='+offset+',screenX='+offset;
        }
        // }}}
        // {{{ height
        if (screen.height) { // window
            ht = screen.height;
        } else if (window.document.body.clientHeight) {  // IE
            ht = window.document.body.clientHeight;
        } else if (window.innerHeight) { // Netscape
            ht = window.innerHeight;
        } else if (document.documentElement.clientHeight) { // IE 6+
            ht = document.documentElement.clientHeight;
        } else {
            ht = 580;
        }
        if ((height != 0) && (height > ht)) {
            height = ht;
        }
        // }}}
        // {{{ add height and width to window parameters
        if (height != 0 && width != 0) {
            windowParams += ',height=' + height + ',width=' +width;;
        } else if (width != 0) {
            windowParams += ',width=' + width;
        } 
        // }}}
        windowObj = window.open(url, title, windowParams, false);
        if (windowObj) {
            windowObj.focus(); // bring to front if window already open
        }
        return windowObj;
    }
    // }}}
    // {{{ plx_Browser
    /**
     * Browser object
     */
    function plx_Browser() {
        var d=document;
        this.agt=navigator.userAgent.toLowerCase();
        this.major = parseInt(navigator.appVersion);
        this.dom=(d.getElementById)?1:0; // true for ie6, ns6
        this.ns=(d.layers);
        this.ns4up=(this.ns && this.major >=4);
        this.ns4= ((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) == 4));
        this.ns6=(this.dom&&navigator.appName=="Netscape");
        this.op=this.agt.indexOf('opera')!=-1;
        this.ie=(d.all);
        this.ie4=(d.all&&!this.dom)?1:0;
        this.ie4up=(this.ie && this.major >= 4);
        this.ie5=(d.all&&this.dom);
        this.win=((this.agt.indexOf("win")!=-1) || (this.agt.indexOf("16bit")!=-1));
        this.mac=(this.agt.indexOf("mac")!=-1);
        this.gecko=(this.agt.indexOf("gecko")!=-1);
        this.safari=(this.agt.indexOf("safari")!=-1);
        this.sp2=(this.agt.indexOf('sv1')!=-1);
    }
    // }}}
    var brz = new plx_Browser();
    
    
    /*
  Launcher for remote-scripted popup window to select name/email pairs from a Plaxo member's address book.
  Contact: Joseph Smarr (joseph@plaxo.com)

  Dependencies: {{{
  - util.js (everyone needs this)
  - basic.js (for popup)
  }}}
     */

    registerNamespaces("Plaxo");

    Plaxo.Util.Timer.setTimersEnabled(false);

    // {{{ stolen from prototype.js so partners don't need to include it (js: moved under Plaxo namespace to play nice with jQuery)

    Plaxo.byId = function(elem) {
        if (typeof elem == 'string') {
            elem = document.getElementById(elem);
        }
        return elem;
    };

    Plaxo.Class = {
        create: function() {
            return function() {
                this.initialize.apply(this, arguments);
            }
        }
    };

    // }}}

    Plaxo.ABLauncher = Plaxo.Class.create();
    Plaxo.ABLauncher.prototype = {

        initialize: function() {
            Plaxo.Debug.trace('initializing');
            // {{{ member vars
            this.name =             "Plaxo.ABLauncher 1.0";
            this.abWin =             null;    // popup window
            this.textArea =          null;    // text area with name/emails we're controlling
            this.currentEmails =     {};      // emails currently in text box
            // }}}
        },

        dialogWidth: 460,
        dialogHeight: 480, // if you change this, also change ab_chooser.css (main_content, ab_contents)
 
        /** Turns a map of options into a query string. */
        toQueryString: function(options) {
            var queryComponents = [];
            for (key in options) {
                if (typeof options[key] == 'function') continue;
                var queryComponent = encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
                queryComponents.push(queryComponent);
            }
            return queryComponents.join('&');
        },

        showABChooser: function(textArea, plaxoHost, callbackPage, extraOptions) {

            this.textArea = Plaxo.byId(textArea);
            if (!this.textArea) {
                Plaxo.Debug.error("can't find text area -> aborting");
                return;
            }
            this.currentEmails = {};
            this.extractEmails(this.textArea.value);

            if (!this.abWin || this.abWin.closed) {
                // ensure callback is on the same domain as the caller
                if (callbackPage.length > 0 && callbackPage.charAt(0) != '/') {
                    callbackPage = '/' + callbackPage; // make sure we have a true absolute path
                }
                var cb = location.protocol + '//' + location.host + callbackPage;
                extraOptions.cb = cb;
      
                // record partner URL and when we opened the widget
                extraOptions.host = location.href;
                extraOptions.ts = new Date().getTime();

                var qs = this.toQueryString(extraOptions);
                if (extraOptions.comcast) {
                    var url = 'https://' + plaxoHost + '/scc?action=abchooser&' + qs; //'ts=' + ts + '&cb=' + escape(cb) + '&host=' + escape(location.href);
                } else {
                    var url = 'https://' + plaxoHost + '/ab_chooser?' + qs; //'ts=' + ts + '&cb=' + escape(cb) + '&host=' + escape(location.href);
                }
                if (extraOptions.plaxoMembersOnly) {
                    url += '&direct=1';
                } else {
                    var emails = this.getCurrentEmailList().join(',');
                    url += '&t=import&emails=' + escape(emails);
                }
                this.abWin = popup(url, "PlaxoABC", this.dialogWidth, this.dialogHeight, 'resizable=no,scrollbars=no');
            }
            if (this.abWin) {
                this.abWin.focus();
            }
        },

        getCurrentEmailList: function() {
            var emails = [];
            for (email in this.currentEmails) {
                emails.push(email);
            }
            return emails;
        },

        /** Extracts all the e-mail addresses in the given string. */
        extractEmails: function(str) {
            var index = 0;
            while (true) {
                index = str.indexOf('@', index);
                if (index == -1) break;

                // for each @, find the beginning and end and extract the email
                var start = Plaxo.String.findBoundary(str, index - 1, false);
                var end = Plaxo.String.findBoundary(str, index + 1, true);
                var email = str.substring(start, end + 1).toLowerCase();
                this.currentEmails[email] = 1;

                index++;
            }
        },
 
        // {{{ adding checked recipients to textbox

        /** Returns true iff the given email is already in the text area. */
        hasCurrentEmail: function(email) {
            return this.currentEmails[email.toLowerCase()];
        },

        addCheckedRecipients: function(text) {
            // TODO: kill first line
            if (!text) return false;

            if (!this.textArea) {
                Plaxo.Debug.error('no text area to add recipients to');
                return false;
            }

            var curText = this.textArea.value;
            if (curText && !curText.trim().endsWith(',')) curText += ', ';
            curText += text;
            this.setTextAreaValue(curText);
            return true;
        },

        setTextAreaValue: function(str) {
            this.textArea.value = str;
        }

        // }}}

    };

    // shared instance of ab launcher
    Plaxo.abl = null;

    /**
     * Opens the Plaxo AB Chooser widget.
     *
     * @param textArea the id of the textarea to fill in name/email pairs, or a ref to the textArea
     * @param callbackPage uri on caller's site for page to complete adding the data (e.g. /site/ifr.html)
     * @param plaxoHost (optional) plaxo domain to host ab chooser (for testing only, default: www.plaxo.com)
     * @param plaxoMembersOnly (optional) only show UI to sign in as an existing plaxo member (default: false)
     * @param extraOptions (optional) map of string->string key/value pairs for extra options:
     *        - selType -> multiple (default) | single (allow one or multiple contacts to be chosen)
     *        - fieldType -> email (default) | address (what contact info to choose (email, mailing address)
     *        - plaxoMembersOnly -> false (default) | true (whether to not show import for non-plaxo members)
     */
    function showPlaxoABChooser(textArea, callbackPage, plaxoHost, extraOptions) {
        if (!Plaxo.abl) Plaxo.abl = new Plaxo.ABLauncher();
        if (!plaxoHost) plaxoHost = 'www.plaxo.com';
        if (!extraOptions) extraOptions = {};
        Plaxo.abl.showABChooser(textArea, plaxoHost, callbackPage, extraOptions);
    }