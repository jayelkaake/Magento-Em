
var TBT_Rewards_JS_Catalog_Product_View_Redemption = Class.create({
    
    /* dynamic */
    productId: null,
    ruleId: null,
    rules: null,
    rule: null,
    slider: null,
    uses: null,
    quantity: null,
    priceBeforeRedemptions: null,

    /* static mostly */
    slider_stepContLimit: 100000,
    slider_stepSize: 1,
    ruleMap: null, /*{ //sample
        164: {
            4999.95: {
                8: Object,
                currency_id: "1",
                max_redeem_usage_part: 2499.975,
                name: "AA",
                on_price: 4999.95,
                points: "1 Gold",
                points_per_usage: "1",
                points_spend_max: 2500,
                points_spend_min: 0,
                product_id: "164",
                redeam_type: "slider",
                redeem_price_max: 2499.975,
                redeem_price_min: 0,
                redeem_price_per_usage: 1,
                rule_id: "8",
                usage_max: 2500,
                usage_min: 0
            }
        }
    },//*/
    dom: null, /*{ //sample  
        redemption: null,
        redemption_selector: null,
        redemption_uses: null,
        redemption_uses_input_count: null,
        redemption_uses_sliderHandle: null,
        redemption_uses_sliderRail: null,
        redemption_uses_sliderCaption: null,
        lables_product_cost_before_redemption : [],
        lables_total_cost_at_qty : [],
        lables_total_redemption : [],
        //lable_product_price: null,
        input_quantity : null
    },//*/
    currencyMap: null,
    optionsPriceMap: null,
    productBasePrice: null,
    ajax_getRuleSettings: null,
    ajax_getRuleSettings_retries: {
        max: 3, 
        at: 0
    },
    
    initialize: function( dom, ruleMap, currencyMap, optionsPrice, ajax_getRuleSettings) { 
        this.dom = dom;
        this.ruleMap = ruleMap;
        this.currencyMap = currencyMap;
        this.optionsPriceMap = optionsPrice;
        this.productBasePrice = optionsPrice.productPrice;
        this.ajax_getRuleSettings = ajax_getRuleSettings;
        
        this.productId = optionsPrice.productId;
        this.uses = dom.redemption_uses_input_count.getValue();
        this.quantity = dom.input_quantity.getValue();
        this.priceBeforeRedemptions = 0;
        
        this.onFormChanged();
    },
    
    slider_onSlide: function(val) {
        this.setUses(this.slider.value);
    },    

    slider_onChange: function(val) {
        this.setUses(this.slider.value);
    },
    
    slider_setValueBy: function(delta) {
        this.slider.setValueBy(delta * this.slider.step, this.slider.activeHandleIdx );
    },
    
    slider_setValue: function(value) {
        if(this.slider.value != value)
            this.slider.setValue(value, this.slider.activeHandleIdx );
    },
    
    slider_update: function(range, value, stepSize, stepContLimit) {
        // only rebuild slider if needed
        if(this.slider != null) {
            if( this.slider.range.start == range.start && this.slider.range.end == range.end ) {
                this.slider_setValue(value);
                return;
            }
            this.slider.dispose();
            this.slider = null;
        }

        var sliderData = {
            onSlide: this.slider_onSlide.bind(this),
            onChange: this.slider_onChange.bind(this),
            range: range,
            values: range,
            sliderValue: value,
            step: stepSize
        };
                                
        // Limit number of steps, tomany steps kill javascript preformance
        var delta_range = Math.abs( range.start - range.end );
        if(delta_range > 0 && stepContLimit != null ) {
            if( (delta_range / sliderData.step) > stepContLimit ) {
                sliderData.step = delta_range / stepContLimit;
                sliderData.values = new Array();
                for(i= 0; i < stepContLimit; i++ ) {
                    sliderData.values.push( parseInt(range.start + ( i * sliderData.step )) );
                }
                sliderData.values.push(range.end);
            }
        }
       
        // creation of slider/DOM needs to be visable before an internal call to translateToPx() 
        var dontHide = ! this.dom.redemption_uses.visible;
        this.dom.redemption_uses.show();
        this.slider = new Control.Slider(this.dom.redemption_uses_sliderHandle.id, this.dom.redemption_uses_sliderRail.id, sliderData);
        if( !dontHide )
            this.dom.redemption_uses.hide();
    },

    getQuantity: function() {
        //return 1; // disable total qty
        return this.quantity;
    },
    
    setQuantity: function(quantity) {
        if(this.quantity != quantity ) {
            this.quantity = quantity;
            this.onFormChanged();
            return false;
        }
        return true;
    },


    getItemPrice: function() {
        var priceBeforeRedemptions = this.productBasePrice;
        
        // dynamic config price
        if(optionsPrice.optionPrices.config != undefined) {
            if(optionsPrice.optionPrices.config.price != undefined) {
                // magento >= 1.4.2
                priceBeforeRedemptions += optionsPrice.optionPrices.config.price;
            } else {
                // magento < 1.4.2
                priceBeforeRedemptions += optionsPrice.optionPrices.config;
            }
        } 
       
        // dynamic options price
        if(optionsPrice.optionPrices.options != undefined) {
            if(optionsPrice.optionPrices.options.price != undefined) {
                priceBeforeRedemptions += optionsPrice.optionPrices.options.price;
            } else {
                priceBeforeRedemptions += optionsPrice.optionPrices.options;
            }
        }
        
        // dynamic bundles
        if(optionsPrice.optionPrices.bundle != undefined) {
            if(optionsPrice.optionPrices.bundle.price != undefined) {
                priceBeforeRedemptions += optionsPrice.optionPrices.bundle.price;
            } else {
                priceBeforeRedemptions += optionsPrice.optionPrices.bundle;
            }
        }

        return priceBeforeRedemptions;
    },
    
    
    setPriceRedemptions: function(discount) {
        optionsPrice.productPrice = this.productBasePrice * this.getQuantity() - discount;
        optionsPrice.reload();
    },
    
    setPriceBeforeRedemptions: function(price) {
        if(this.priceBeforeRedemptions != price ) {
            this.priceBeforeRedemptions = price;
            this.onFormChanged();
            return false;
        }
        return true;
    },
    

    getTotalCost: function() {
        return this.getItemPrice() * this.getQuantity();
    },
    
    setUses: function(uses) {
        if(this.uses != uses) {
            this.uses = uses;
            // XXXX ??? indirectly causes onFormChanged
            this.dom.redemption_uses_input_count.setValue( this.uses );
            //this.dom.redemption_uses_input_count.fire('change');
            //this.onFormChanged();
            return false;
        }
        return true;
    },
    
    setProductId: function(productId) {
        if( this.productId != productId ) {
            this.productId = productId;
            this.onFormChanged();
            return false;
        }
        return true;
    },
    
    setRuleId: function(ruleId) {
        if( this.ruleId != ruleId ) {
            this.ruleId = ruleId;
            this.onFormChanged();
            return false;
        }
        return true;
    },
    
    getRuleId: function() {
        return this.ruleId;
    },
    
    setRule: function(rule) {
        if( this.rule != rule ) {
            this.rule = rule;
            this.onFormChanged();
            return false;
        }
        return true;
    },
    
    setRules: function(rules) {
        if( this.rules != rules ) {
            this.rules = rules;
            this.updateDomRules(rules);
            this.onFormChanged();
            return false;
        }
        return true;
    },
    
    updateDomRules: function(rules) {
        var selectedItem = this.dom.redemption_selector.selectedIndex;   
        var newlist = '<option value="" selected="selected"></option>\n';
        
        var listItem = 0;
        for( ruleId in rules ) {
            if( rules[ruleId] != null ) {
                var rule = rules[ruleId];
                // only show useable rules
                if( rule['usage_max'] > 0 ) {
                    newlist += "<option value='" + rule['rule_id'] + "'>" + rule['name'] + "</option>\n";
                    listItem++;
                    // select the first slider rule in the list
                    if( selectedItem == -1 && rule['redeam_type'] == 'slider' )
                        selectedItem = listItem;
                }
            }
        }
    
        //Note: IE has a bug and cant use innerHTML to set the newlist.. so use insert
        //this.dom.redemption_selector.innerHTML="";
        this.dom.redemption_selector.update( newlist );
        this.dom.redemption_selector.selectedIndex = selectedItem;
        this.dom.redemption_selector.show();
    },
    

    formatPrice: function(price) {
        return optionsPrice.formatPrice(price, true);
    },
    
    updateDomInterface: function() {
        
        //if(this.rules.count() > 0 )
        // TODO: .length is not safe... sould use a prototype function
        if(this.dom.redemption_selector.length > 0 )
            this.dom.redemption.show();
        else
            this.dom.redemption.hide();
        
                
        var lables_total_cost_at_qty = '';
        if( this.getQuantity() > 1 ) {
            lables_total_cost_at_qty += '<div class="rewards-totalprice price-to">';
            lables_total_cost_at_qty += '<span class="price-label">' + tbt_rewards_translation_total + ': </span>';
            lables_total_cost_at_qty += '<span class="price">' + this.formatPrice(this.getItemPrice()) + " x " + this.getQuantity() + " = " + this.formatPrice(this.getTotalCost()) + '</span>';
            lables_total_cost_at_qty += '</div>';
        } else {
            lables_total_cost_at_qty = '';
        }
        
        this.dom.lables_total_cost_at_qty.each( function(box){
            box.innerHTML = lables_total_cost_at_qty;
        }, this );
        
        
        var lables_total_redemption ='';
        
        if ( this.rule == null ) {
            this.dom.redemption_uses.hide();
        } else if ( this.rule == 'LOADING' ) {
            if( this.uses > 0 ) {
                //this.dom.redemption.disable();
                lables_total_redemption += '<div class="rewards-totalprice special-price">';
                lables_total_redemption += '<span class="price-label">' + tbt_rewards_translation_now + ': </span>';
                lables_total_redemption += '<span class="price">...</span>';
                lables_total_redemption += '</div>';
            }
        } else if ( this.rule != null ) {
            //this.dom.redemption.enable();
            this.slider_update($R(this.rule.usage_min,this.rule.usage_max), this.uses, this.slider_stepSize, this.slider_stepContLimit);       
            this.dom.redemption_uses_sliderCaption.innerHTML = getPointsString(this.rule.points_per_usage * this.slider.value, this.rule.currency_id );
            
            if( this.rule['redeam_type'] == 'once_per_product' )           
                this.dom.redemption_uses.hide();
            else if( this.rule['redeam_type'] == 'slider' ) 
                this.dom.redemption_uses.show();
       
            if( this.uses == null || this.uses <= 0 ) {
                this.dom.lables_product_cost_before_redemption.each( function(e){
                    e.removeClassName('old-price')
                });
            } else {
                var price_disposition = this.rule['redeem_price_per_usage'];
                var discount = price_disposition * this.uses;

                if (discount > this.rule['redeem_price_max'])
                    discount = this.rule['redeem_price_max'];
                
                var discountedPrice = this.formatPrice(this.getTotalCost() - discount);
                
                lables_total_redemption += '<div class="rewards-totalprice special-price">';
                lables_total_redemption += '<span class="price-label">' + tbt_rewards_translation_now + ': </span>';
                lables_total_redemption += '<span class="price">' + discountedPrice + " using " + getPointsString(this.rule['points_per_usage'] * this.uses, this.rule['currency_id']) + '</span>';
                lables_total_redemption += '</div>';
                
                this.dom.lables_product_cost_before_redemption.each( function(e){
                    e.addClassName('old-price')
                });
            }
        }

        this.dom.lables_total_redemption.each( function(box){
            box.innerHTML = lables_total_redemption;
        }, this );

    },
    
    
    getProductPriceRules: function(productId, priceBeforeRedemptions ) { 
        
        if(productId == '')  return null;
        
        // build map if never set
        if( this.ruleMap == null ) {
            this.ruleMap = [];
            this.ruleMap[productId] = [];
        }

        // if not set we need to get this ajaxly
        var rules = this.ruleMap[productId][priceBeforeRedemptions];
        if ( rules == null ) {
            var me = this;
            new Ajax.Request( this.ajax_getRuleSettings,
            {
                parameters: {
                    productId: productId,
                    price: priceBeforeRedemptions
                },
                method:'get',
                onSuccess: function(transport){
                    me.ajax_getRuleSettings_retries.at = 0;
                    me.ruleMap[productId][priceBeforeRedemptions] = transport.responseText.evalJSON();
                    me.onFormChanged();
                },
                onFailure: function(){
                    me.ajax_getRuleSettings_retries.at++;
                    if (me.ajax_getRuleSettings_retries.at > me.ajax_getRuleSettings_tries.max) {
                        alert( tbt_rewards_translation_ajaxError );
                        me.updateDomInterface();
                    } else {
                        me.getProductPriceRules(productId,priceBeforeRedemptions);
                    }
                }
            });
            return 'LOADING';
        }
        return rules;
    },

    // update local varibles based on dom objects or ajax calls
    // then update the dom
    onFormChanged: function() {
        if( !this.setPriceBeforeRedemptions( this.getTotalCost() ) ) return;
        if( !this.setProductId( optionsPrice.productId )) return;
        
        var ruleId = this.dom.redemption_selector.getValue();
        if( !this.setRuleId(ruleId) ) return;
        
        var rule = "LOADING";
        var rules = this.getProductPriceRules( this.productId, this.priceBeforeRedemptions );
        if (rules != "LOADING" && rules != null ) {
            if( rules[ruleId] != null ) 
                rule = rules[ruleId];
            else
                rule = null;
        }
        
        if( !this.setRules(rules) ) return;
        if( !this.setRule(rule) ) return;
        
        // Get uses frpm dom
        var uses = parseInt(this.dom.redemption_uses_input_count.getValue());
        if( false == (uses >= 0) )  // fix NaN or bad number value
            uses = 0;
        if( rule == null )
            uses = 0;
        else if( uses > rule['usage_max'] )
            uses = rule['usage_max'];
        if( this.rule != null && rule != "LOADING" ){
            if( rule['redeam_type'] == 'once_per_product' )
                uses = rule['usage_max'];
        }
        
        if( !this.setUses(uses) ) return;
       
        // Get quantity
        var quantity = parseInt( this.dom.input_quantity.getValue() )
        if( false == (quantity > 0) ) // fix NaN or bad value
            quantity = 1;
        
        if( !this.setQuantity(quantity) ) return;

        this.updateDomInterface();
    }
});
