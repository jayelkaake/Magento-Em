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

/**
 * Indexer strategy
 */
class Mage_Index_Model_Indexer
{
    /**
     * Collection of available processes
     *
     * @var Mage_Index_Model_Resource_Process_Collection
     */
    protected $_processesCollection;

    /**
     * Indexer processes lock flag
     *
     * @var bool
     */
    protected $_lockFlag = false;

    /**
     * Whether table changes are allowed
     *
     * @var bool
     */
    protected $_allowTableChanges = true;

    /**
     * Class constructor. Initialize index processes based on configuration
     */
    public function __construct()
    {
        $this->_processesCollection = Mage::getResourceModel('index/process_collection');
    }

    /**
     * Get collection of all available processes
     *
     * @return Mage_Index_Model_Resource_Process_Collection
     */
    public function getProcessesCollection()
    {
        return $this->_processesCollection;
    }

    /**
     * Get index process by specific id
     *
     * @param int $processId
     * @return Mage_Index_Model_Process | false
     */
    public function getProcessById($processId)
    {
        foreach ($this->_processesCollection as $process) {
            if ($process->getId() == $processId) {
                return $process;
            }
        }
        return false;
    }

    /**
     * Get index process by specific code
     *
     * @param string $code
     * @return Mage_Index_Model_Process | false
     */
    public function getProcessByCode($code)
    {
        foreach ($this->_processesCollection as $process) {
            if ($process->getIndexerCode() == $code) {
                return $process;
            }
        }
        return false;
    }

    /**
     * Lock indexer actions
     */
    public function lockIndexer()
    {
        $this->_lockFlag = true;
        return $this;
    }

    /**
     * Unlock indexer actions
     */
    public function unlockIndexer()
    {
        $this->_lockFlag = false;
        return $this;
    }

    /**
     * Check if onject actions are locked
     *
     * @return bool
     */
    public function isLocked()
    {
        return $this->_lockFlag;
    }

    /**
     * Indexing all pending events.
     * Events set can be limited by event entity and type
     *
     * @param   null | string $entity
     * @param   null | string $type
     * @return  Mage_Index_Model_Indexer
     */
    public function indexEvents($entity=null, $type=null)
    {
        if ($this->isLocked()) {
            return $this;
        }

        $this->_runAll('indexEvents', array($entity, $type));
        return $this;
    }

    /**
     * Index one event by all processes
     *
     * @param   Mage_Index_Model_Event $event
     * @return  Mage_Index_Model_Indexer
     */
    public function indexEvent(Mage_Index_Model_Event $event)
    {
        if ($this->isLocked()) {
            return $this;
        }

        $this->_runAll('processEvent', array($event));
        return $this;
    }

    /**
     * Register event in each indexing process process
     *
     * @param Mage_Index_Model_Event $event
     */
    public function registerEvent(Mage_Index_Model_Event $event)
    {
        if ($this->isLocked()) {
            return $this;
        }

        $this->_runAll('register', array($event));
        return $this;
    }

    /**
     * Create new event log and register event in all processes
     *
     * @param   Varien_Object $entity
     * @param   string $entityType
     * @param   string $eventType
     * @param   bool $doSave
     * @return  Mage_Index_Model_Event
     */
    public function logEvent(Varien_Object $entity, $entityType, $eventType, $doSave=true)
    {
        if ($this->isLocked()) {
            return $this;
        }
        $event = Mage::getModel('index/event')
            ->setEntity($entityType)
            ->setType($eventType)
            ->setDataObject($entity)
            ->setEntityPk($entity->getId());

        $this->registerEvent($event);
        if ($doSave) {
            $event->save();
        }
        return $event;
    }

    /**
     * Create new event log and register event in all processes.
     * Initiate events indexing procedure.
     *
     * @param   Varien_Object $entity
     * @param   string $entityType
     * @param   string $eventType
     * @return  Mage_Index_Model_Indexer
     */
    public function processEntityAction(Varien_Object $entity, $entityType, $eventType)
    {
        if ($this->isLocked()) {
            return $this;
        }
        $event = $this->logEvent($entity, $entityType, $eventType, false);
        /**
         * Index and save event just in case if some process matched it
         */
        if ($event->getProcessIds()) {
            $this->_changeKeyStatus(false);
            /** @var $resourceModel Mage_Index_Model_Resource_Abstract */
            $resourceModel = Mage::getResourceModel('index/process');
            $resourceModel->beginTransaction();
            $this->_allowTableChanges = false;
            try {
                $this->indexEvent($event);
                $resourceModel->commit();
                $this->_allowTableChanges = true;
                $this->_changeKeyStatus();
            } catch (Exception $e) {
                $resourceModel->rollBack();
                $this->_allowTableChanges = true;
                $this->_changeKeyStatus();
                throw $e;
            }
            $event->save();
        }
        return $this;
    }

    /**
     * Run all processes method with parameters
     * Run by depends priority
     * Not recursive call is not implement
     *
     * @param string $method
     * @param array $args
     * @return Mage_Index_Model_Indexer
     */
    protected function _runAll($method, $args)
    {
        $processed = array();
        foreach ($this->_processesCollection as $process) {
            $code = $process->getIndexerCode();
            if (in_array($code, $processed)) {
                continue;
            }

            if (!$this->_allowTableChanges && is_callable(array($process, 'setAllowTableChanges'))) {
                $process->setAllowTableChanges(false);
            }
            if ($process->getDepends()) {
                foreach ($process->getDepends() as $processCode) {
                    $dependProcess = $this->getProcessByCode($processCode);
                    if ($dependProcess && !in_array($processCode, $processed)) {
                        if (!$this->_allowTableChanges && is_callable(array($dependProcess, 'setAllowTableChanges'))) {
                            $dependProcess->setAllowTableChanges(false);
                        }
                        call_user_func_array(array($dependProcess, $method), $args);
                        if (!$this->_allowTableChanges && is_callable(array($dependProcess, 'setAllowTableChanges'))) {
                            $dependProcess->setAllowTableChanges(true);
                        }
                        $processed[] = $processCode;
                    }
                }
            }

            call_user_func_array(array($process, $method), $args);
            if (!$this->_allowTableChanges && is_callable(array($process, 'setAllowTableChanges'))) {
                $process->setAllowTableChanges(true);
            }

            $processed[] = $code;
        }
    }

    /**
     * Enable/Disable keys in index tables
     *
     * @return Mage_Index_Model_Indexer
     */
    protected function _changeKeyStatus($enable = true)
    {
        $processed = array();
        foreach ($this->_processesCollection as $process) {
            $code = $process->getIndexerCode();
            if (in_array($code, $processed)) {
                continue;
            }

            if ($process->getDepends()) {
                foreach ($process->getDepends() as $processCode) {
                    $dependProcess = $this->getProcessByCode($processCode);
                    if ($dependProcess && !in_array($processCode, $processed)) {
                        if ($dependProcess instanceof Mage_Index_Model_Process) {
                            if ($enable) {
                                $dependProcess->enableIndexerKeys();
                            } else {
                                $dependProcess->disableIndexerKeys();
                            }
                            $processed[] = $processCode;
                        }
                    }
                }
            }

            if ($process instanceof Mage_Index_Model_Process) {
                if ($enable) {
                    $process->enableIndexerKeys();
                } else {
                    $process->disableIndexerKeys();
                }
                $processed[] = $code;
            }
        }

        return $this;
    }
}
