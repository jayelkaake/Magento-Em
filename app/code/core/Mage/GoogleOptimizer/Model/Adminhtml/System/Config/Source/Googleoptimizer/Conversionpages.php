<?php
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
 * @package     Mage_GoogleOptimizer
 * @copyright   Copyright (c) 2010 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */


/**
 * Google Optimizer Source Model
 *
 * @category    Mage
 * @package     Mage_GoogleOptimizer
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_GoogleOptimizer_Model_Adminhtml_System_Config_Source_Googleoptimizer_Conversionpages
{
    
    public function toOptionArray()
    {
        return array(
            array('value' => '',                                'label' => Mage::helper('googleoptimizer')->__('-- Please Select --')),
            array('value' => 'other',                           'label' => Mage::helper('googleoptimizer')->__('Other')),
            array('value' => 'checkout_cart',                   'label' => Mage::helper('googleoptimizer')->__('Shopping Cart')),
            array('value' => 'checkout_onepage',                'label' => Mage::helper('googleoptimizer')->__('One Page Checkout')),
            array('value' => 'checkout_multishipping',          'label' => Mage::helper('googleoptimizer')->__('Multi Address Checkout')),
            array('value' => 'checkout_onepage_success',        'label' => Mage::helper('googleoptimizer')->__('Order Success (One Page Checkout)')),
            array('value' => 'checkout_multishipping_success',  'label' => Mage::helper('googleoptimizer')->__('Order Success (Multi Address Checkout)')),
            array('value' => 'customer_account_create',         'label' => Mage::helper('googleoptimizer')->__('Account Registration')),
        );
    }
    
}
