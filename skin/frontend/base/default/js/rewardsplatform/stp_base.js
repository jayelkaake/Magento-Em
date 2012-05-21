//No conflict our jQuery
$stp = jQuery.noConflict(true);

//$ = {}; //HACK: to discourage use of jQuery's identifer while devving

var stp = {
    maxErrorCount : 5,
    async : true,    
    
    start : function(){
        stp.switchboard = stp.obj.newSwitchboard();
        stp.spinner = stp.obj.newSpinner();

        stp.widgetCount = 0;
        stpData.widget = {};

        stp.load.channel();
        stp.load.css();
    },

    load : {
        channel : function(){
            stp.ajax(stpData.apiUrl + "/asset?js=" + stpData.channel, 
                function(datJS){
                    $stp("<script>" + datJS + "</script>").appendTo('head');
                    if(stp.channel !== 'undefined' && typeof stp.channel.load === 'function'){
                        stp.channel.load();
                    }else{
                        stp.load.channel();
                    }
                }
            );
        },

        css : function(){
            stp.ajax(stpData.apiUrl + "/asset?css=crunch", function(datCSS){
                $stp("<style>" + datCSS + "</style>").appendTo('head');
            });            
        },

    },
    
    utils : {
        getNextWidgetId : function(){
            stp.widgetCount = stp.widgetCount + 1;
            return "stp_widget" + stp.widgetCount;
        },
        
        getCurrencyName: function(currency, points){
            if(points === 1){
                return stp.utils.getJSON(currency).caption_singular;
            } else if(points === 0){
                return stp.utils.getJSON(currency).caption_none;
            }
            return stp.utils.getJSON(currency).caption_plural;
        },
        
        getSpendablePoints : function(user){
            user = stp.utils.getJSON(user)[0];
            return user.points[0].available;
        },
        
        getJSON : function(json){
            if(typeof json === 'string' && json != ""){
                json = jQuery.parseJSON(json);
            }
            return json;
        }
    },

    ajax : function(path, callback, isAsync){
        var async = isAsync || stp.async;
        var errCount = 0;
        var callPath = function(){
            //This grossness brought to you by IE
            if (!('withCredentials' in new XMLHttpRequest()) && typeof XDomainRequest !== "undefined"){ 
                var xdr = new XDomainRequest();
                xdr.open("get", path);
                xdr.onload = function () {
                       success(xdr);
                };
                xdr.onerror = function(){
                    error();
                }
                xdr.send();
            }else{ //for actually good browsers
                $stp.ajax({
                    url: path,
                    async: async,
                    complete: function( data, status ){
                        if(status === "success"){
                            success(data);
                        }
                        if(status === "error"){
                            error();
                        }
                    }
                });
            }
        };

        var success = function(data){
            if(data.responseText == ''){
                error(); //if it didn't actually get data, try again
            }else{
                callback(data.responseText);
            }
        };
        
        var error = function(){
            errCount  = errCount + 1;
            if(errCount > stp.maxErrorCount){
                console.log("ERROR: Failed call attempt max reached with " + path);
            } else {
                callPath();
            }
        };
        callPath();
    }

}; 
    
    