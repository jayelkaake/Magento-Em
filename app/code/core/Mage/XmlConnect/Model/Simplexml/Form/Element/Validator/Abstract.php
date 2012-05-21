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
 * Xmlconnect form validator rule element abstract
 *
 * @category    Mage
 * @package     Mage_XmlConnect
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_XmlConnect_Model_Simplexml_Form_Element_Validator_Abstract
    extends Mage_XmlConnect_Model_Simplexml_Form_Element_Abstract
{
    /**
     * Array of the messages for default validator types
     *
     * @var array
     */
    protected $_validatorTypeMessages = array();

    /**
     * Main element node
     *
     * @var string
     */
    protected $_mainNode = 'validator';

    /**
     * Init validator rule element abstract
     *
     * @param array $attributes
     */
    public function __construct($attributes = array())
    {
        parent::__construct($attributes);
        $this->_renderer = Mage_XmlConnect_Model_Simplexml_Form::getValidatorRuleRenderer();
        $this->_setDefaultValidatorTypeMessages();
        if (isset($attributes['type'])) {
            $this->setType($attributes['type']);
        }
    }

    /**
     * Set default validator messages
     *
     * @see Mage_Core_Helper_Js->_getTranslateData() and validation.js
     * @return Mage_XmlConnect_Model_Simplexml_Form_Element_Validator_Abstract
     */
    protected function _setDefaultValidatorTypeMessages()
    {
        $helper = Mage::helper('xmlconnect');
        $this->_validatorTypeMessages = array(
            'min_length' => $helper->__('Text length does not satisfy specified min text range.'),
            'max_length' => $helper->__('Text length does not satisfy specified max text range.'),
            'alphanumeric' => $helper->__('Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.'),
            'email' => $helper->__('Please enter a valid email address. For example johndoe@domain.com.'),
            'required' => $helper->__('This is a required field.'),
            'required_select' => $helper->__('Please select an option.'),
            'numeric' => $helper->__('Please use numbers only in this field. Please avoid spaces or other characters such as dots or commas.'),
            'alpha' => $helper->__('Please use letters only (a-z or A-Z) in this field.'),
            'url' => $helper->__('Please enter a valid URL. Protocol is required (http://, https:// or ftp://)'),
            'date' => $helper->__('Please enter a valid date.'),
            'max_file_size' => $helper->__('\'%s\' exceeds the allowed file size: %d (bytes)', $this->getFieldLabel(), $this->getValue()),
            'file_extensions' => $helper->__('\'%s\' is not a valid file extension. Allowed extensions: %s', $this->getFieldLabel(), $this->getValue()),
            'max_image_width' => $helper->__('\'%s\' width exceeds allowed value of %d px', $this->getFieldLabel(), $this->getValue()),
            'max_image_height' => $helper->__('\'%s\' height exceeds allowed value of %d px', $this->getFieldLabel(), $this->getValue())
        );
        return $this;
    }

    /**
     * Add required attributes to validator rule
     *
     * @todo re-factor required attributes logic to make it easy to replace them
     * @throws Mage_Core_Exception
     * @param Mage_XmlConnect_Model_Simplexml_Element $xmlObj
     * @return Mage_XmlConnect_Model_Simplexml_Form_Abstract
     */
    protected  function _addRequiredAttributes(Mage_XmlConnect_Model_Simplexml_Element $xmlObj)
    {
        $this->_addId($xmlObj);

        foreach ($this->getRequiredXmlAttributes() as $attribute => $defValue) {
            $data = $this->getData($this->_underscore($attribute));

            if ($data) {
                $xmlObj->addAttribute($attribute, $xmlObj->xmlAttribute($data));
            } elseif(null !== $defValue){
                $xmlObj->addAttribute($attribute, $xmlObj->xmlAttribute($defValue));
            } else {
                Mage::throwException(Mage::helper('xmlconnect')->__('%s attribute is required.', $attribute));
            }
        }
        $this->_addMessage($xmlObj);
        return $this;
    }

    /**
     * Add validator message for validator rule
     *
     * @throws Mage_Core_Exception
     * @param Mage_XmlConnect_Model_Simplexml_Element $xmlObj
     * @return Mage_XmlConnect_Model_Simplexml_Form_Abstract
     */
    protected function _addMessage(Mage_XmlConnect_Model_Simplexml_Element $xmlObj)
    {
        if ($this->getMessage()) {
            $message = $this->getMessage();
        } elseif (array_key_exists($this->getType(), $this->getValidatorTypeMessages())) {
            $message = $this->_validatorTypeMessages[$this->getType()];
        } else {
            Mage::throwException(
                Mage::helper('xmlconnect')->__('"message" attribute is required for "%s" validator rule.', $this->getType())
            );
        }
        $xmlObj->addAttribute('message', $xmlObj->xmlAttribute($message));
        return $this;
    }

    /**
     * Default validator rule attribute array
     *
     * @return array
     */
    public function getXmlAttributes()
    {
        return array('relation');
    }

    /**
     * Required validator rule attribute array
     *
     * @return array
     */
    public function getRequiredXmlAttributes()
    {
        return array('type' => null);
    }

    /**
     * Get validator type messages
     *
     * @return array
     */
    public function getValidatorTypeMessages()
    {
        return $this->_validatorTypeMessages;
    }

    /**
     * Set validator type messages
     *
     * @param array $validatorTypeMessages
     * @return Mage_XmlConnect_Model_Simplexml_Form_Element_Validator_Abstract
     */
    public function addValidatorTypeMessages(array $validatorTypeMessages)
    {
        $this->_validatorTypeMessages = array_merge($this->_validatorTypeMessages, $validatorTypeMessages);
        return $this;
    }
}
