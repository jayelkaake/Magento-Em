<?php


abstract class SweetToothClient
{
    const REWARDS_API_BASE_URL          = 'http://sweettoothhq.com/rest';
    const REWARDS_API_BASE_URL_DEBUG    = 'http://m.dev/me11110/index.php/rest';
    const DEBUG_MODE                    = true;
    const USE_TEST_DATA                 = false;
    
    const API_DATA_FORMAT = 'json';
    
    protected $_restClient = null;
    
    private $apiKey;
    private $apiSecret;
    
    private $protocol = 'https';
    
    protected $account;
    
    /**
     *
     * @param string $apiKey
     * @param string $apiSecret
     */
    public function __construct($apiKey , $apiSecret)
    {
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
        
        $this->account     = new SweetToothAccount($this);
    
    
        return $this;
    }
    
    /**
     *
     * @param unknown_type $resource
     * @param unknown_type $data
     * @throws SweetToothApiException
     * @return unknown
     */
    public function get($resource, $data = array())
    {
        $path = $resource;
    
        try {
            if (isset($data) && count($data) > 0) {
                $paramPairs;
    
                foreach ($data as $key => $value) {
                    $paramPairs[]= $key . '=' . $value;
                }
    
                $path .= '?' . implode('&', $paramPairs);
            }
    
            $response = $this->getRestClient()->get($path);
    
        } catch(Exception $e) {
            //Repackage the exception if we need to:
            throw $this->_parseException($e);
        } 
    
    
        return $response;
    }
    
    /**
     *
     * @param unknown_type $resource
     * @param unknown_type $data
     * @throws SweetToothApiException
     * @return unknown
     */
    public function post($resource, $data)
    {
        try {
            $path = $resource;
            $path .= '.' . $this->getApiFormat();
        
            $response = $this->getRestClient()->post($path, $data);
        
        } catch(Exception $e) {
            //Repackage the exception if we need to:
            throw $this->_parseException($e);
        }
        
        return $response;
    }
    
    /**
     * TODO: this needs to be implemented
     * @param unknown_type $resource
     * @param unknown_type $data
     */
    public function put($resource, $data)
    {
    
    }
    
    /**
     * TODO: this needs to be implemented
     * @param unknown_type $resource
     * @param unknown_type $resourceId
     */
    public function delete($resource, $resourceId)
    {
    
    }
    
    /**
     * Converts an array map of data into a stdClass object.
     * @param unknown_type $array
     * @return unknown|stdClass|boolean
     */
    public function arrayToObject($array)
    {
        if(!is_array($array)) {
            return $array;
        }
    
        $object = new stdClass();
        if (is_array($array) && count($array) > 0) {
            foreach ($array as $name=>$value) {
                $name = strtolower(trim($name));
                if (!is_null($name)) {
                    $object->$name = $this->arrayToObject($value);
                }
            }
            return $object;
        }
        else {
            return FALSE;
        }
    }
    
    /**
     * Converts an array of arrays into an array of objects.
     *
     * @param array $array
     * @return unknown|Ambigous <unknown, stdClass, boolean, unknown_type>
     */
    public function toArrayofObjects($array)
    {
        if (!is_array($array)) {
            return $array;
        }
    
        $arrayOfObjs;
    
        foreach ($array as $arrayItem) {
            $arrayOfObjs[] = $this->arrayToObject($arrayItem);
        }
    
        return $arrayOfObjs;
    }
    
    
    
    /**
     * @return string
     */
    public function getApiKey() {
        return $this->apiKey;
    }
    
    /**
     * @return string
     */
    public function getApiSecret() {
        return $this->apiSecret;
    }
    
    
    
    /**
     * @return string
     */
    protected function getApiFormat()
    {
        return self::API_DATA_FORMAT;
    }
    
    /**
     * @return string
     */
    protected function getApiBaseUrl()
    {
        $url = '';
        if (self::DEBUG_MODE) {
            $url = self::REWARDS_API_BASE_URL_DEBUG;
        } else {
            $url = self::REWARDS_API_BASE_URL;
        }
    
        if (self::USE_TEST_DATA) {
            $url .= 'test';
        }
    
        return $url;
    }
    
    /**
     * @return Pest rest client used to speak to the Sweet Tooth Platform
     *
     */
    protected function getRestClient()
    {
        if ($this->_restClient) {
            return $this->_restClient;
        }
    
        $baseUrl = $this->getApiBaseUrl();
        $pest = new PestJSON($baseUrl);
    
        $pest->setupAuth($this->apiKey, $this->apiSecret);
        $this->_restClient = $pest;
    
        return $this->_restClient;
    }
    
    
    /**
     * Parses an exception message to see if there is JSON content and it can be repackaged as a SweetToothApiException
     * @param Exception $e
     */
    protected function _parseException($e) {
        if(! $e->getMessage()) {
            return $e;
        }
    
    
        $response =  (array) json_decode($e->getMessage());
    
        if(!$response || !isset($response['error'])) {
            return $e;
        }
    
        $result = (array) $response['error'];
    
    
        if( !$result || empty($result)) {
            return $e;
        }
    
        $e = new SweetToothApiException($result);
    
        return $e;
    }
    
}