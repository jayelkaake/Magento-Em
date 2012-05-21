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
 * @category    design
 * @package     default_default
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

if (!window.Enterprise) {
    window.Enterprise = {};
}

if (!Enterprise.CatalogPermissions) {
    Enterprise.CatalogPermissions = {};
}

Enterprise.CatalogPermissions.Config = Class.create();

Object.extend(Enterprise.CatalogPermissions.Config.prototype, {
    initialize: function () {
        Event.observe(window.document, 'dom:loaded', this.handleDomLoaded.bindAsEventListener(this));
    },
    handleDomLoaded: function () {
        $$('.enterprise-grant-select').each(function(element) {
            element.observe('change', this.updateFields.bind(this));
        }, this);

        this.updateFields();
    },

    updateFields: function() {
        $$('.enterprise-grant-select').each(function(element) {
            if (parseInt(element.value) !== 2) {
                element.up('tr').next('tr').hide();
            } else {
                element.up('tr').next('tr').show();
            }

            if (element.hasClassName('browsing-catagories')) {
                if (parseInt(element.value) === 1) {
                    element.up('tr').next('tr', 1).hide();
                } else {
                    element.up('tr').next('tr', 1).show();
                }
            }
        });
     }
});

new Enterprise.CatalogPermissions.Config();
