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
 * @package     Mage_Core
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */


/**
 * Base html block
 *
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_Core_Block_Text extends Mage_Core_Block_Abstract
{

    public function setText($text)
    {
        $this->setData('text', $text);
        return $this;
    }

    public function getText()
    {
        return $this->getData('text');
    }

    public function addText($text, $before=false)
    {
        if ($before) {
            $this->setText($text.$this->getText());
        } else {
            $this->setText($this->getText().$text);
        }
    }

    protected function _toHtml()
    {
        if (!$this->_beforeToHtml()) {
            return '';
        }

        return $this->getText();
    }

}
