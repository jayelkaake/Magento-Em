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
 * @package     Mage_Archive
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://www.magentocommerce.com/license/enterprise-edition
 */

/**
 * Class to work with gz archives
 *
 * @category    Mage
 * @package     Mage_Archive
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Mage_Archive_Gz extends Mage_Archive_Abstract implements Mage_Archive_Interface
{
    /**
    * Pack file by GZ compressor.
    *
    * @param string $source
    * @param string $destination
    * @return string
    */
    public function pack($source, $destination)
    {
        $data = $this->_readFile($source);
        $gzData = gzencode($data, 9);
        $this->_writeFile($destination, $gzData);
        return $destination;
    }

    /**
    * Unpack file by GZ compressor.
    *
    * @param string $source
    * @param string $destination
    * @return string
    */
    public function unpack($source, $destination)
    {
        $gzPointer = gzopen($source, 'r' );
        if (empty($gzPointer)) {
            throw new Mage_Exception('Can\'t open GZ archive : ' . $source);
        }
        $data = '';
        while (!gzeof($gzPointer)) {
            $data .= gzread($gzPointer, 131072);
        }
        gzclose($gzPointer);
        if (is_dir($destination)) {
            $file = $this->getFilename($source);
            $destination = $destination . $file;
        }
        $this->_writeFile($destination, $data);
        return $destination;
    }

}
