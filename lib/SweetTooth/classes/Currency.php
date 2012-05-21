<?php

class SweetToothCurrency
{
    private $prefix = "/currency";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    public function get() {
        $result = $this->client->get($this->prefix);
        return $this->client->arrayToObject($result);
    }

    public function __destruct(){
        unset($this->prefix);
        unset($this->array);
    }
}
