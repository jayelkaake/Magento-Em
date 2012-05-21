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
 * Product search suggestions renderer
 *
 * @category    Mage
 * @package     Mage_XmlConnect
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_XmlConnect_Block_Catalog_Search_Suggest extends Mage_CatalogSearch_Block_Autocomplete
{
    /**
     * Suggest item separator
     */
    const SUGGEST_ITEM_SEPARATOR = '::sep::';

    /**
     * Search suggestions xml renderer
     *
     * @return string
     */
    protected function _toHtml()
    {
        $suggestXmlObj = Mage::getModel('xmlconnect/simplexml_element', '<suggestions></suggestions>');

        if (!$this->getRequest()->getParam(Mage_CatalogSearch_Helper_Data::QUERY_VAR_NAME, false)) {
            return $suggestXmlObj->asNiceXml();
        }

        $suggestData = $this->getSuggestData();
        if (!count($suggestData)) {
            return $suggestXmlObj->asNiceXml();
        }

        $items = '';
        foreach ($suggestData as $item) {
            $items .= $suggestXmlObj->xmlentities(strip_tags($item['title'])) . self::SUGGEST_ITEM_SEPARATOR
                . (int)$item['num_of_results'] . self::SUGGEST_ITEM_SEPARATOR;
        }

        $suggestXmlObj = Mage::getModel('xmlconnect/simplexml_element', '<suggestions>' . $items . '</suggestions>');

        return $suggestXmlObj->asNiceXml();
    }
}
