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
 * Google Optimizer Block
 * to display conversion type scripts on pages setted in layout
 *
 * @category   Mage
 * @package    Mage_GoogleOptimizer
 * @author     Magento Core Team <core@magentocommerce.com>
 */
class Mage_GoogleOptimizer_Block_Code_Conversion extends Mage_GoogleOptimizer_Block_Code
{
    protected $_pageType = null;

    protected function _initGoogleOptimizerModel()
    {
        $collection = Mage::getModel('googleoptimizer/code')
            ->getCollection();

        if ($this->getPageType()) {
            $collection->addFieldToFilter('conversion_page', $this->getPageType());
        }

        $conversionCodes = array();
        foreach ($collection as $_item) {
            $conversionCodes[] = $_item->getConversionScript();
        }
        $this->_setGoogleOptimizerModel(
            new Varien_Object(array(
                'conversion_script' => implode('', $conversionCodes)
            ))
        );
        return parent::_initGoogleOptimizerModel();
    }

    public function setPageType($pageType)
    {
        $this->_pageType = $pageType;
        return $this;
    }

    public function getPageType()
    {
        return $this->_pageType;
    }
}
