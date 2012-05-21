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
 * Poll index controller
 *
 * @file        IndexController.php
 * @author      Magento Core Team <core@magentocommerce.com>
 */

class Mage_Rss_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        if (Mage::getStoreConfig('rss/config/active')) {
            $this->loadLayout();
            $this->renderLayout();
        } else {
            $this->getResponse()->setHeader('HTTP/1.1','404 Not Found');
            $this->getResponse()->setHeader('Status','404 File not found');
            $this->_forward('defaultNoRoute');
        }
    }

    public function nofeedAction()
    {
        $this->getResponse()->setHeader('HTTP/1.1','404 Not Found');
        $this->getResponse()->setHeader('Status','404 File not found');
        $this->loadLayout(false);
           $this->renderLayout();
    }

    public function wishlistAction()
    {
        if ( Mage::getSingleton('customer/session')->authenticate($this) ) {
            if (Mage::getStoreConfig('rss/wishlist/active')) {
                $this->getResponse()->setHeader('Content-type', 'text/xml; charset=UTF-8');
                $this->loadLayout(false);
                $this->renderLayout();
            } else {
                $this->getResponse()->setHeader('HTTP/1.1','404 Not Found');
                $this->getResponse()->setHeader('Status','404 File not found');
                $this->_forward('nofeed','index','rss');
                return;
            }
        }
    }
}
