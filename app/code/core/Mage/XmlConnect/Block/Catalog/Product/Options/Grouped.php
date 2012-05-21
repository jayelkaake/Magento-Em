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
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

/**
 * Grouped product options xml renderer
 *
 * @category    Mage
 * @package     Mage_XmlConnect
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_XmlConnect_Block_Catalog_Product_Options_Grouped extends Mage_XmlConnect_Block_Catalog_Product_Options
{
    /**
     * Generate bundle product options xml
     *
     * @param Mage_Catalog_Model_Product $product
     * @param bool $isObject
     * @return string | Mage_XmlConnect_Model_Simplexml_Element
     */
    public function getProductOptionsXml(Mage_Catalog_Model_Product $product, $isObject = false)
    {
        $xmlModel = Mage::getModel('xmlconnect/simplexml_element', '<product></product>');
        $optionsNode = $xmlModel->addChild('options');

        if (!$product->getId()) {
            return $isObject ? $xmlModel : $xmlModel->asNiceXml();
        }
        $xmlModel->addAttribute('id', $product->getId());
        if (!$product->isSaleable()) {
            return $isObject ? $xmlModel : $xmlModel->asNiceXml();
        }
        /**
         * Grouped (associated) products
         */
        $_associatedProducts = $product->getTypeInstance(true)->getAssociatedProducts($product);
        if (!sizeof($_associatedProducts)) {
            return $isObject ? $xmlModel : $xmlModel->asNiceXml();
        }

        foreach ($_associatedProducts as $_item) {
            if (!$_item->isSaleable()) {
                continue;
            }
            $optionNode = $optionsNode->addChild('option');

            $optionNode->addAttribute('code', 'super_group[' . $_item->getId() . ']');
            $optionNode->addAttribute('type', 'product');
            $optionNode->addAttribute('label', $xmlModel->xmlentities($_item->getName()));
            $optionNode->addAttribute('is_qty_editable', 1);
            $optionNode->addAttribute('qty', $_item->getQty()*1);

            /**
             * Process product price
             */
            if ($_item->getPrice() != $_item->getFinalPrice()) {
                $productPrice = $_item->getFinalPrice();
            } else {
                $productPrice = $_item->getPrice();
            }

            if ($productPrice != 0) {
                $productPrice = Mage::helper('xmlconnect')->formatPriceForXml($productPrice);
                $optionNode->addAttribute('price', Mage::helper('xmlconnect')->formatPriceForXml(
                    Mage::helper('core')->currency($productPrice, false, false)
                ));
                $optionNode->addAttribute('formated_price', $this->_formatPriceString($productPrice, $product));
            }
        }

        return $isObject ? $xmlModel : $xmlModel->asNiceXml();
    }
}
