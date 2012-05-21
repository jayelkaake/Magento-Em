//Needs to be included with stp_base.js

stp.widget = {
    //Args: customerKey, onSlide, onRelease, injector
    newSlider : function(args){
        var slider = stp.obj.newWidget();
        slider.injector = args.injector;

        slider.builder = function(parts){
            
            //just grabs the first cart rule
            var rule = stp.utils.getJSON(parts.rule)[0];
            var customerPoints = stp.utils.getSpendablePoints(parts.user);
            //The field we should be using for this is actually points_max_qty, rather than uses_per_customer. 
            var maxRulePoints = rule.uses_per_customer * parseInt(rule.points_amount);

            //TODO: make sure to include the subtotal on the cart in this calculation
            var maxPoints = (customerPoints < maxRulePoints) ? customerPoints : maxRulePoints;

            //Setup globals for the widget
            stpData.widget[slider.id].onRelease = args.onRelease;
            stpData.widget[slider.id].onSlide= args.onSlide;
            stpData.widget[slider.id].step = parseInt(rule.points_amount);
            stpData.widget[slider.id].max = maxPoints;

            slider.inject({
            	injector : args.injector,
            	widget   : parts.widget,
            	template : {
            		stp_currencyname : stp.utils.getCurrencyName(parts.currency)
            	}

            });
        };

        slider.create({ user     : "/user/search?channel_user_id="+args.customerKey+"&channel_key=" + stpData.channelKey,
                        currency : "/currency",
                        rule     : "/rule?style=spending&type=cart&channel_key=" + stpData.channelKey, 
                        widget   : "/widget?type=slider"
        });
    },
    
    //Args: injector
    newBanner : function(args){
        var banner = stp.obj.newWidget();
        banner.injector = args.injector;
        
        banner.builder = function(parts){
            banner.inject({
            	widget   : parts.widget,
            	template : {
            		stp_currencyname : stp.utils.getCurrencyName(parts.currency)            		
            	}
            });
        };
        
        banner.create({ currency : "/currency",
                        widget   : "/widget?type=banner"
        });
    }
};

stp.test = {};









