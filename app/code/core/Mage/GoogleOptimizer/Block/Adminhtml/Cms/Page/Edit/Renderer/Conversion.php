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
 * GoogleOptimizer Cms page conversion renderer
 *
 * @category   Mage
 * @package    Mage_GoogleOptimizer
 * @author     Magento Core Team <core@magentocommerce.com>
 */
class Mage_GoogleOptimizer_Block_Adminhtml_Cms_Page_Edit_Renderer_Conversion extends Mage_Adminhtml_Block_Widget_Form_Renderer_Fieldset_Element
{
    public function __construct()
    {
        $this->setTemplate('googleoptimizer/cms/edit/renderer/conversion.phtml');
    }

    public function render(Varien_Data_Form_Element_Abstract $element)
    {
        $this->_element = $element;
        return $this->toHtml();
    }

    public function getElement()
    {
        return $this->_element;
    }

    public function getStoreViews()
    {
        $storeViews = Mage::app()->getStores();
        return $storeViews;
    }

    public function getJsonStoreViews()
    {
        $storeViews = array();
        foreach ($this->getStoreViews() as $_store) {
            $storeViews[] = $_store->getCode();
        }
        $storeViews = new Varien_Object($storeViews);
        return $storeViews->toJson();
    }

    public function getJsonConversionPagesUrl()
    {
        $storeViewsUrls = array();
        foreach ($this->getStoreViews() as $_store) {
            Mage::helper('googleoptimizer')->setStoreId($_store->getId());
            $storeViewsUrls[$_store->getCode()] = Mage::helper('googleoptimizer')->getConversionPagesUrl()->getData();
        }
        $storeViewsUrls = new Varien_Object($storeViewsUrls);
        return $storeViewsUrls->toJson();
    }
}
