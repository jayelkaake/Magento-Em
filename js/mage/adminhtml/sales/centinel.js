/**
 * Magento Enterprise Edition
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Magento Enterprise Edition License
 * that is bundled with this package in the file LICENSE_EE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.magentocommerce.com/license/enterprise-edition
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    Mage
 * @package     Mage_Adminhtml
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */
var centinelValidator = new Class.create();
centinelValidator.prototype = {

    initialize : function(method, validationUrl, containerId){
        this.method = method;
        this.validationUrl = validationUrl;
        this.containerId = containerId;
    },

    validate : function(){
        if (order.paymentMethod != this.method) {
            return false;
        }
        var params = order.getPaymentData();
        params = order.prepareParams(params);
        params.json = true;

        new Ajax.Request(this.validationUrl, {
            parameters:params,
            method:'post',
            onSuccess: function(transport) {
            var response = transport.responseText.evalJSON();
                if (response.authenticationUrl) {
                    this.autenticationStart(response.authenticationUrl);
                }
                if (response.message) {
                    this.autenticationFinish(response.message);
                }
            }.bind(this)
        });
    },

    autenticationStart : function(url) {
        this.getContainer().src = url;
        this.getContainer().style.display = 'block';
    },

    autenticationFinish : function(message) {
        alert(message);
        this.getContainer().style.display = 'none';
    },

    getContainer : function() {
        return $(this.containerId);
    }

}
