<?php



class SweetToothRule
{
    private $prefix = "/rule";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    public function put($filters) {
        $result = $this->client->put($this->prefix, $filtes);
        return $this->client->arrayToObject($result);
    }

    public function __destruct(){
        unset($this->prefix);
        unset($this->client);
    }
}
