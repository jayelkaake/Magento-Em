<?php

/**
 * 
 *
 */
class SweetToothStory
{
    
    const STORY_TYPE_ORDER     = 'order';
    const STORY_TYPE_SIGNUP    = 'signup';
    
    private $prefix = "/story";
    private $client;

    public function __construct($client) {
        $this->client = $client;
    }

    /*
     * results should always be unique here
    * follows the convention api/resource/$id
    */
    public function get($id) {
        if (!is_null($id)) {
            $result = $this->client->get($this->prefix . '/' . $id);
            return $this->client->arrayToObject($result);
        } else {
            return $this->search();
        }
    }

    public function create($fields) {
        return $this->client->post($this->prefix, $fields);
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

    public function __destruct(){
        unset($this->prefix);
        unset($this->array);
    }
}

