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
 * One page checkout agreements xml renderer
 *
 * @category    Mage
 * @package     Mage_XmlConnect
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_XmlConnect_Block_Checkout_Agreements extends Mage_Checkout_Block_Agreements
{
    /**
     * Render agreements xml
     *
     * @return string
     */
    protected function _toHtml()
    {
        $agreementsXmlObj = Mage::getModel('xmlconnect/simplexml_element', '<agreements></agreements>');
        if ($this->getAgreements()) {
            foreach ($this->getAgreements() as $agreement) {
                $itemXmlObj = $agreementsXmlObj->addChild('item');
                $content = $agreementsXmlObj->xmlentities($agreement->getContent());
                if (!$agreement->getIsHtml()) {
                    $content = nl2br(strip_tags($content));
                }
                $agreementText = $agreementsXmlObj->xmlentities($agreement->getCheckboxText());
                $itemXmlObj->addChild('label', $agreementText);
                $itemXmlObj->addChild('content', $content);
                $itemXmlObj->addChild('code', 'agreement[' . $agreement->getId() . ']');
                $itemXmlObj->addChild('agreement_id', $agreement->getId());
            }
        }

        return $agreementsXmlObj->asNiceXml();
    }
}
