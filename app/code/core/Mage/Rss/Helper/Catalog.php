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
 * @package     Mage_Rss
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

/**
 * Default rss helper
 *
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_Rss_Helper_Catalog extends Mage_Core_Helper_Abstract
{

    public function getTagFeedUrl()
    {
        $url = '';
        if(Mage::getStoreConfig('rss/catalog/tag') && $this->_getRequest()->getParam('tagId')){
            $tagModel = Mage::getModel('tag/tag')->load($this->_getRequest()->getParam('tagId'));
            if($tagModel && $tagModel->getId()){
                return Mage::getUrl('rss/catalog/tag', array('tagName' => urlencode($tagModel->getName())));
            }
        }
        return $url;
    }

}
