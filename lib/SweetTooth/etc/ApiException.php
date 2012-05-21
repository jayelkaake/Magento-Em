<?php



/**
 * Thrown when an API call returns an error
 */
class SweetToothApiException extends Exception
{
    /**
     * The result containing errors from our server
     */
    protected $result;

    /**
     * Make a new Sweet Tooth Exception with the given result.
     *
     * @param array $result Result from the API server
     */
    public function __construct($result) {
        $this->result = $result;

        $msg = $result['message'];
        $code = $result['code'];
        
        parent::__construct($msg, $code, null);
    }

    /**
     * Return the associated result object returned by the API server.
     *
     * @return array The result from the API server
     */
    public function getResult() {
        return $this->result;
    }

    /**
     * To make debugging easier.
     *
     * @return string The string representation of the error
     */
    public function __toString() {
        $str = 'Exception: ';
        if ($this->code != 0) {
            $str .= $this->code . ': ';
        }
        return $str . $this->message;
    }
}