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
 * Sweet Tooth PointsSlider
 * @requires js/tbt/rewards/points/RedemptionSlider.js
 *
 * @category   TBT
 * @package    TBT_Rewards
 * @author     WDCA Sweet Tooth Team <contact@wdca.ca>
 */

var PointsSlider = Class.create(RedemptionSlider, {
    /**
	 * Changes the redemption rule for this points slider
	 * @param rule_id
	 * @return
	 */
    changeRule: function(rule_id) {
        var init_value = this.getValue() ;
        if(init_value == null) init_value = 1;
		
        var uses = 1;
        if(rule_id == '') {  //no rule selected
            usesContainer.hide(); 
        } else { 
            var amt = parseInt(rule_options[rule_id]['amount']);
            var curr = parseInt(rule_options[rule_id]['currency_id']);
            var max_uses = parseInt(rule_options[rule_id]['max_uses']);
            this.points_per_use = amt;
            this.points_currency = curr;
            if(max_uses == 0) {
                max_uses = parseInt(getProductPriceBeforeRedemptions()) * 1000 + 1;
            }
            var relevant_customer_points = customer_points ? customer_points[curr] : default_guest_points;
            var price_disposition = rule_options[rule_id]['price_disposition'];
            var product_price = getProductPriceBeforeRedemptions();
            max_uses = this.getRealMaxUses(max_uses, this.points_per_use, relevant_customer_points, product_price, price_disposition);
            if(max_uses > 1) {
                if(init_value > max_uses) {
                    init_value = max_uses;
                }
                //Edited 15/01/2010 7:08:59 PM : if the next (commented) line is false, it means that there
                // is a posibility that mutliple point usages will yield the same discount:
                // For Example if points are worth $0.0017 USD, using 1-5 points will yield a $0.01 USD 
                // discount after discounts.
                //Math.round(price_disposition*Math.pow(10, optionsPrice.priceFormat.precision)) > 0

                this.regenerateSlider(1, max_uses, 1, init_value);
                this.slider.setValue(init_value);
                usesContainer.show();
				
            } else {
                this.regenerateSlider(1, 1, 1, 1);
                usesContainer.hide(); 
            }
        }

        // Reset the slider to 1 if the rule has changed.
        if(this.oldRuleId != rule_id) {
            this.slider.setValue(1);
            this.oldRuleId = rule_id;
        }
		
    }

});