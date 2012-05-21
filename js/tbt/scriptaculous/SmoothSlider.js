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
 * This is a mod to the Script.aculo.us Control.Slider utility to make it smooth slide.
 * <b>Depends on:</b> Control.Slider, Effect.Move 
 *
 * @category   TBT
 * @package    TBT_Rewards
 * @author     WDCA Sweet Tooth Team <contact@wdca.ca>
 */

var SmoothSlider = Class.create();
SmoothSlider.prototype = Control.Slider.prototype;
SmoothSlider.prototype.setValue = function(sliderValue, handleIdx){
    if(!this.active) {
        this.activeHandleIdx = handleIdx || 0;
        this.activeHandle    = this.handles[this.activeHandleIdx];
        this.updateStyles();
    }
    handleIdx = handleIdx || this.activeHandleIdx || 0;
    if(this.initialized && this.restricted) {
        if((handleIdx>0) && (sliderValue<this.values[handleIdx-1]))
            sliderValue = this.values[handleIdx-1];
        if((handleIdx < (this.handles.length-1)) && (sliderValue>this.values[handleIdx+1]))
            sliderValue = this.values[handleIdx+1];
    }
    sliderValue = this.getNearestValue(sliderValue);
    this.values[handleIdx] = sliderValue;
    this.value = this.values[0]; // assure backwards compat
    
    // WDCA CODE BEGIN -->>
    if(this.slideFxBusy == true) {
        if(this.slideFx) {
            this.slideFx.cancel();
            this.slideFxBusy = false;
            this.handles[handleIdx].style[this.isVertical() ? 'top' : 'left'] =  this.translateToPx(sliderValue);
        }
    } else {
        this.slideFxBusy = true;
        //Edited 10/03/2010 4:37:21 AM : to fix IE7-8 bug
        var translated_value = this.translateToPx(sliderValue);
        if(translated_value != "NaNpx") { 
            var move_x = this.isVertical() ? 0 : parseInt(translated_value);
            var move_y = this.isVertical() ? parseInt(translated_value) : 0;
            this.slideFx = new Effect.Move(this.handles[handleIdx], {
                x: move_x, 
                y: move_y,
                mode:'absolute',
                duration: 0.4,
                afterFinish: function() {
                    this.slideFxBusy = false;
                }.bindAsEventListener(this)
            });
        }
    }
    // <<-- WDCA CODE END

    this.isMoving = false;
    //    this.handles[handleIdx].style[this.isVertical() ? 'top' : 'left'] =  this.translateToPx(sliderValue); // WDCA COMMENTED THIS

    this.drawSpans();
    if(!this.dragging || !this.event) this.updateFinished();
};

