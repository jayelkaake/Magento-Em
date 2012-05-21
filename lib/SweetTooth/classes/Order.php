<?php


/**
 *
 */
class SweetToothOrder
{
    private $prefix = "/order";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    public function get($id = null) {
        if (!is_null($id)) {
            $result = $this->client->get($this->prefix . '/' . $id);
            return $this->client->arrayToObject($result['order']);
        } else {
            return $this->search();
        }
    }

    public function search($filters = null) {
        $result = $this->client->get($this->prefix . '/' . 'search', $filters);
        return $this->client->arrayToObject($result['order']);
    }

    public function create($fields){

        return $this->client->post($this->prefix, $fields);
    }

    public function modify($id, $fields){
        $fields = array('product' => $fields);
        return sendToAPI($this->prefix . "products/" . $id, 'PUT', $fields);
    }

    public function remove($id){
        return sendToAPI($this->prefix . "products/". $id, 'DELETE');

    }

    public function __destruct(){
        unset($this->prefix);
        unset($this->array);
    }
}