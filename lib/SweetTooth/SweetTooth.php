<?php

// Define constants for multi-server compatibility if they have not already been defined.
if(!defined('DS')) define('DS', DIRECTORY_SEPARATOR);
if(!defined('PS')) define('PS', PATH_SEPARATOR);
if(!defined('BP')) define('BP', dirname(dirname(__FILE__)));

// Include REST library files:
include_once(dirname(__FILE__). DS .'pest'. DS .'PestJSON.php');

// Include core framework files:
include_once(dirname(__FILE__). DS .'etc'. DS .'ApiException.php');
include_once(dirname(__FILE__). DS .'etc'. DS .'Client.php');


// Include model classes:
include_once(dirname(__FILE__). DS .'classes'. DS .'Account.php');

class SweetTooth extends SweetToothClient
{
    
    
    /**
     * Call this to validate API credentials.
     *
     * @throws Exception when connection to the API fails or the SweetTooth class is not ready
     * @return boolean true if connection is successful
     */
    public function authenticate()
    {
    
        // Check for api credentials
        if (!$this->getApiKey()) {
            throw new Exception('No API Key specified.');
        }
    
        if (!$this->getApiSecret()) {
            throw new Exception('No API Secret specified.');
        }
    
        // Access account information to check api creds
        $this->account->get();
        return true;
    }
    
    /**
     * 
     * @return SweetToothAccount
     */
    public function account() {
        return $this->account;
    }
    
    /**
     * 
     * @return SweetToothRule
     */
    public function rule() {
        include_once(dirname(__FILE__). DS .'classes'. DS .'Rule.php');
        return new SweetToothRule($this);
    }
    
    /**
     * 
     * @return SweetToothUser
     */
    public function user() {
        include_once(dirname(__FILE__). DS .'classes'. DS .'User.php');
        return new SweetToothUser($this);
    }
    
    /**
     * 
     * @return SweetToothStory
     */
    public function story() {
        include_once(dirname(__FILE__). DS .'classes'. DS .'Story.php');
        return new SweetToothStory($this);
    }
    
    /**
     * @return SweetToothOrder
     */
    public function order() {
        include_once(dirname(__FILE__). DS .'classes'. DS .'Order.php');
        return new SweetToothOrder($this);
    }
    
    /**
     * 
     * @return SweetToothPrediction
     */
    public function prediction() {
        include_once(dirname(__FILE__). DS .'classes'. DS .'Prediction.php');
        return new SweetToothPrediction($this);
    }
    
    /**
     * @return SweetToothCurrency
     */
    public function currency() {
        include_once(dirname(__FILE__). DS .'classes'. DS .'Currency.php');
        return new SweetToothCurrency($this);
    }
    
}




