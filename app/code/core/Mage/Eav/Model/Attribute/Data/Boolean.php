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
 * @package     Mage_Eav
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */


/**
 * EAV Entity Attribute Boolean Data Model
 *
 * @category    Mage
 * @package     Mage_Eav
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_Eav_Model_Attribute_Data_Boolean extends Mage_Eav_Model_Attribute_Data_Select
{
    /**
     * Return a text for option value
     *
     * @param int $value
     * @return string
     */
    protected function _getOptionText($value)
    {
        switch ($value) {
            case '0':
                $text = Mage::helper('eav')->__('No');
                break;
            case '1':
                $text = Mage::helper('eav')->__('Yes');
                break;
            default:
                $text = '';
                break;
        }
        return $text;
    }
}
