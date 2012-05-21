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
 * @package     Mage_Log
 * @copyright   Copyright (c) 2010 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

/**
 * Log visitor aggregator
 *
 * @author      Magento Core Team <core@magentocommerce.com>
 */

class Mage_Log_Model_Visitor_Aggregator extends Varien_Object
{
    public function getResource()
    {
        return Mage::getResourceModel('log/visitor_aggregator');
    }

    public function update()
    {
        $this->getResource()->update();
        return $this;
    }
    
    public function updateOneShot()
    {
        $this->getResource()->updateOneShot();
        return $this;
    }
}
