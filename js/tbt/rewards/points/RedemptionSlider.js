/**
 * WDCA - Sweet Tooth
 * 
 * NOTICE OF LICENSE
 * 
 * This source file is subject to the WDCA SWEET TOOTH POINTS AND REWARDS 
 * License, which extends the Open Software License (OSL 3.0).
 * The Sweet Tooth License is available at this URL: 
 *      http://www.wdca.ca/solutions_page_sweettooth/Sweet_Tooth_License.php
 * The Open Software License is available at this URL: 
 *      http://opensource.org/licenses/osl-3.0.php
 * 
 * DISCLAIMER
 * 
 * By adding to, editing, or in any way modifying this code, WDCA is 
 * not held liable for any inconsistencies or abnormalities in the 
 * behaviour of this code. 
 * By adding to, editing, or in any way modifying this code, the Licensee
 * terminates any agreement of support offered by WDCA, outlined in the 
 * provided Sweet Tooth License. 
 * Upon discovery of modified code in the process of support, the Licensee 
 * is still held accountable for any and all billable time WDCA spent 
 * during the support process.
 * WDCA does not guarantee compatibility with any other framework extension. 
 * WDCA is not responsbile for any inconsistencies or abnormalities in the
 * behaviour of this code if caused by other framework extension.
 * If you did not receive a copy of the license, please send an email to 
 * contact@wdca.ca or call 1-888-699-WDCA(9322), so we can send you a copy 
 * immediately.
 * 
 * @category   [TBT]
 * @package    [TBT_Rewards]
 * @copyright  Copyright (c) 2009 Web Development Canada (http://www.wdca.ca)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*/
/**
 * Sweet Tooth RedemptionSlider
 * @requires js/tbt/scriptaculous/SmoothSlider.js
 *
 * @category   TBT
 * @package    TBT_Rewards
 * @author     WDCA Sweet Tooth Team <contact@wdca.ca>
 */

var RedemptionSlider = Class.create({
    /**
    * Constructor
    * @param sliderHandleId
    * @param sliderRailId
    * @param sliderCaptionId
    * @param sliderValueboxId
    * @return
    */
    initialize: function(sliderHandleId, sliderRailId, sliderCaptionId, sliderValueboxId) {
        this.sliderHandleId 	= sliderHandleId;
        this.sliderRailId 	= sliderRailId;
        this.sliderCaptionId 	= sliderCaptionId;
        this.sliderValuebox 	= $(sliderValueboxId);
        this.sliderData = {
            minimum: 		1,
            maximum: 		1,
            sliderValue: 	1,
            step:		1,    
            range: 		$R(0, 100),
            values: 		$R(0, 100),
            onSlide:		this.slideListener.bind(this),
            onChange: 		this.changeListener.bind(this)
        };	
        this.regenerateSlider(1, 1, 1, 1);
        this.sliderCaption = $(sliderCaptionId);
        this.points_per_use = 1;
        this.points_currency = -1;
        this.oldRuleId = -1;
        this.oldProductPrice = -1;
    },

    /**
	 * 
	 */
    changeListener: function(val) {
        this.setExternalValue(val);
        feignPriceChange();
    },
	
    /**
     * 
     * @param val
     * @return
     */
    slideListener: function(val) {
        this.changeListener(val);
    },
	
    /**
     * 
     * @return
     */
    getValue: function () {
        return this.slider.value;
    },
	
    /**
     * 
     * @return
     */
    getUses: function () {
        return this.getValue();
    },
	

    /**
	 * Calculates the maximum uses based on the final product price
	 * and how many points the customer has.
	 * @param max_uses				: max uses from the rule model
	 * @param points_per_use		: how many points are required for each use of the rule?
	 * @param cp					: how many points in the currency of the rule does the customer have
	 * @param pp					: what is the price of the product?
	 * @param pp_disp				: what is the disposition in product price after the rule has been applied? 
	 * @return integer
	 */
    getRealMaxUses: function(max_uses, points_per_use, cp, pp, pp_disp) {
        var lowest_max_uses = max_uses;
        	
        // Check max points that can be spent on product price
        // befor the price goes to 0;
        var max_pp_uses = pp/pp_disp;
        max_pp_uses =  parseInt(max_pp_uses) + (  (max_pp_uses - parseInt(max_pp_uses) > 0) ? 1 : 0  ); // add remainder
        if(max_pp_uses < lowest_max_uses) {
            lowest_max_uses = max_pp_uses;
        }
		
        // Check customer points balance
        var max_cp_uses = parseInt(cp/points_per_use);
        if(max_cp_uses < lowest_max_uses) {
            lowest_max_uses = max_cp_uses;
        }
		
        return lowest_max_uses;
    },
	
    /**
	 * Regenerates the slider JS model
	 * @param min
	 * @param max
	 * @param step
	 * @param initial_value
	 * @return
	 */
    regenerateSlider: function(min, max, step, initial_value) {
        if(this.slider != null) {			
            this.slider.dispose();
        }
        max = parseInt(max/step) * step;
        this.sliderData.minimum = min;
        this.sliderData.maximum = max;
        this.sliderData.step = step;
        this.sliderData.range = $R(min, max);
        if(step == 1) {
            this.sliderData.values = $R(min, max);
        } else {
            var vals=new Array();
            vals.push(min);
            $R(min, max-1).each( function(v){
                if(v%step==0 && (v+step) <= max ){
                    vals.push(v+step);
                }
            } );
            this.sliderData.values = vals;
        }
        this.sliderData.sliderValue = initial_value;
        this.slider = new SmoothSlider(this.sliderHandleId, this.sliderRailId, this.sliderData);
    },
	
    /**
	 * Sets the value in the input box and what is displayed to the user.
	 * @param val
	 * @return
	 */
    setExternalValue: function(val) {
        this.sliderCaption.innerHTML =  getPointsString(val*this.points_per_use, this.points_currency);
        this.sliderValuebox.value = this.getUses();
    },
	
    incr: function() {
        this.slider.setValue(this.slider.value+this.sliderData.step);
    },
	
    decr: function() {
        this.slider.setValue(this.slider.value-this.sliderData.step);
    },
	
    maximize: function() {
        this.slider.setValue(this.sliderData.maximum);
    },
	
    isMaxed: function() {
        return (this.getValue() == this.sliderData.maximum);
    }

});