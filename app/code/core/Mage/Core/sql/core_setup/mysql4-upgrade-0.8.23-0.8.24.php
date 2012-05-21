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


/* @var $installer Mage_Core_Model_Resource_Setup */
$installer = $this;

$installer->startSetup();
$installer->run("
ALTER TABLE `{$installer->getTable('core/url_rewrite')}`
  DROP INDEX `UNQ_PATH`,
  DROP INDEX `UNQ_REQUEST_PATH`,
  DROP INDEX `IDX_TARGET_PATH`,
  ADD UNIQUE `UNQ_PATH` (`id_path`, `is_system`, `store_id`),
  ADD UNIQUE `UNQ_REQUEST_PATH` (`request_path`, `store_id`),
  ADD INDEX `IDX_TARGET_PATH` (`target_path`, `store_id`);
");
$installer->endSetup();
