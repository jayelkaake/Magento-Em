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
 * Customer form renderer helper
 *
 * @category    Mage
 * @package     Mage_XmlConnect
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_XmlConnect_Helper_Customer_Form_Renderer extends Mage_Core_Helper_Abstract
{
    /**
     * Get title and required attributes for a field
     *
     * @param Mage_XmlConnect_Model_Simplexml_Form_Abstract $fieldsetXmlObj
     * @param Enterprise_Customer_Block_Form_Renderer_Abstract $blockObject
     * @return array
     */
    public function addTitleAndRequiredAttr(Mage_XmlConnect_Model_Simplexml_Form_Abstract $fieldsetXmlObj,
        Enterprise_Customer_Block_Form_Renderer_Abstract $blockObject
    ) {
        $attributes = array();

        if ($blockObject->isRequired()) {
            $attributes += $fieldsetXmlObj->checkAttribute('required', (int)$blockObject->isRequired());
        }

        if ($blockObject->getAdditionalDescription()) {
            $attributes += $fieldsetXmlObj->checkAttribute('title', $blockObject->getAdditionalDescription());
        }

        return $attributes;
    }
}
