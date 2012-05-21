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
 * @package     Mage_XmlConnect
 * @copyright   Copyright (c) 2010 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

/**
 * One page checkout shipping methods xml renderer
 *
 * @category   Mage
 * @package    Mage_XmlConnect
 * @author     Magento Core Team <core@magentocommerce.com>
 */
class Mage_XmlConnect_Block_Checkout_Shipping_Method_Avaliable extends Mage_Checkout_Block_Onepage_Shipping_Method_Available
{
    /**
     * Render shipping methods xml
     *
     * @return string
     */
    protected function _toHtml()
    {
        $methodsXmlObj = new Mage_XmlConnect_Model_Simplexml_Element('<shipping_methods></shipping_methods>');
        $_shippingRateGroups = $this->getShippingRates();
        if ($_shippingRateGroups) {
            $store = $this->getQuote()->getStore();
            $_sole = count($_shippingRateGroups) == 1;
            foreach ($_shippingRateGroups as $code => $_rates) {
                $methodXmlObj = $methodsXmlObj->addChild('method');
                $methodXmlObj->addAttribute('label', $methodsXmlObj->xmlentities(strip_tags($this->getCarrierName($code))));
                $ratesXmlObj = $methodXmlObj->addChild('rates');

                $_sole = $_sole && count($_rates) == 1;
                foreach ($_rates as $_rate) {
                    $rateXmlObj = $ratesXmlObj->addChild('rate');
                    $rateXmlObj->addAttribute('label', $methodsXmlObj->xmlentities(strip_tags($_rate->getMethodTitle())));
                    $rateXmlObj->addAttribute('code', $_rate->getCode());
                    if ($_rate->getErrorMessage()) {
                        $rateXmlObj->addChild('error_message', $methodsXmlObj->xmlentities(strip_tags($_rate->getErrorMessage())));
                    } else {
                        $price = Mage::helper('tax')->getShippingPrice($_rate->getPrice(), Mage::helper('tax')->displayShippingPriceIncludingTax(), $this->getAddress());
                        $formattedPrice = $store->convertPrice($price, true, false);
                        $rateXmlObj->addAttribute('price', Mage::helper('xmlconnect')->formatPriceForXml($store->convertPrice($price, false, false)));
                        $rateXmlObj->addAttribute('formated_price', $formattedPrice);
                    }
                }
            }
        } else {
            Mage::throwException($this->__('Sorry, no quotes are available for this order at this time.'));
        }
        return $methodsXmlObj->asNiceXml();
    }
}
