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
 * Google Optimizer Block with additional js scripts in template
 *
 * @category   Mage
 * @package    Mage_GoogleOptimizer
 * @author     Magento Core Team <core@magentocommerce.com>
 */
class Mage_GoogleOptimizer_Block_Js extends Mage_Adminhtml_Block_Template
{
    public function getJsonConversionPagesUrl()
    {
        return Mage::helper('googleoptimizer')->getConversionPagesUrl()->toJson();
    }

    public function getMaxCountOfAttributes()
    {
        return Mage_GoogleOptimizer_Model_Code_Product::DEFAULT_COUNT_OF_ATTRIBUTES;
    }

    public function getExportUrl()
    {
        return $this->getUrl('*/googleoptimizer_index/codes');
    }

    public function getControlFieldKey ()
    {
        return $this->getDataSetDefault('control_field_key', 'control_script');
    }

    public function getTrackingFieldKey ()
    {
        return $this->getDataSetDefault('tracking_field_key', 'tracking_script');
    }

    public function getConversionFieldKey ()
    {
        return $this->getDataSetDefault('conversion_field_key', 'conversion_script');
    }
}
