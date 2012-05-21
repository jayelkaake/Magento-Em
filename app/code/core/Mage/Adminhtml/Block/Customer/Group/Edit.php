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
 * @package     Mage_Adminhtml
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

/**
 * Customer group edit block
 *
 * @category   Mage
 * @package    Mage_Adminhtml
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_Adminhtml_Block_Customer_Group_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{

    public function __construct()
    {
        parent::__construct();

        $this->_objectId = 'id';
        $this->_controller = 'customer_group';

        $this->_updateButton('save', 'label', Mage::helper('customer')->__('Save Customer Group'));
        $this->_updateButton('delete', 'label', Mage::helper('customer')->__('Delete Customer Group'));

        if(!Mage::registry('current_group')->getId() || Mage::registry('current_group')->usesAsDefault()) {
            $this->_removeButton('delete');
        }
    }

    public function getHeaderText()
    {
        if(!is_null(Mage::registry('current_group')->getId())) {
            return Mage::helper('customer')->__('Edit Customer Group "%s"', $this->htmlEscape(Mage::registry('current_group')->getCustomerGroupCode()));
        } else {
            return Mage::helper('customer')->__('New Customer Group');
        }
    }

    public function getHeaderCssClass() {
        return 'icon-head head-customer-groups';
    }
}
