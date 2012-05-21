<?php


class SweetToothUser
{
    private $prefix = "/user";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    public function get($id) {
        if (!is_null($id)) {
            $result = $this->client->get($this->prefix . '/' . $id);
            return $this->client->arrayToObject($result);
        } else {
            return $this->search();
        }
    }

    public function search($filters = null) {
        $result = $this->client->get($this->prefix . '/' . 'search', $filters);
        $resultsArray =  $this->client->toArrayofObjects($result);

        return $resultsArray;
    }

    public function searchOne($filters) {
        $result = $this->client->get($this->prefix . '/' . 'search', $filters);
        $resultsArray =  $this->client->toArrayofObjects($result);

        if (count($resultsArray) > 0) {
            return $resultsArray[0];
        }

        return null;
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
