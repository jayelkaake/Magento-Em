<?php


/**
 *
 */
class SweetToothAccount
{
    
    const RESOURCE_ACCOUNT   = '/account';
    
    private $prefix = "/account";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    public function get() {
        // List
        $result = $this->client->get($this->prefix);

        $account = $result;

        return $this->client->arrayToObject($account);
    }

    public function __destruct(){
        unset($this->prefix);
        unset($this->client);
    }
}