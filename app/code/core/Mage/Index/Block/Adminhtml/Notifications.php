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
 * @package     Mage_Index
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

class Mage_Index_Block_Adminhtml_Notifications extends Mage_Adminhtml_Block_Template
{
    /**
     * Get array of index names which require data reindex
     *
     * @return array
     */
    public function getProcessesForReindex()
    {
        $res = array();
        $processes = Mage::getSingleton('index/indexer')->getProcessesCollection();
        foreach ($processes as $process) {
            if ($process->getStatus() == Mage_Index_Model_Process::STATUS_REQUIRE_REINDEX) {
                $res[] = $process->getIndexer()->getName();
            }
        }
        return $res;
    }

    /**
     * Get index management url
     *
     * @return string
     */
    public function getManageUrl()
    {
        return $this->getUrl('adminhtml/process/list');
    }

    /**
     * ACL validation before html generation
     *
     * @return string
     */
    protected function _toHtml()
    {
        if (Mage::getSingleton('admin/session')->isAllowed('system/index')) {
            return parent::_toHtml();
        }
        return '';
    }
}
