<?php

/**
 *
 */
class SweetToothPrediction
{
    private $prefix = "/prediction";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    public function create($fields){

        return $this->client->post($this->prefix, $fields);
    }

    public function __destruct(){
        unset($this->prefix);
        unset($this->array);
    }
}
