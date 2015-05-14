<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: x-requested-with");
    
    //Write code to do authentication here
    $auth = true;
    
    //Check authentication
    if ($auth == true) {
        $data = $_POST['photo_data'];
        
        //Write code to determin file name here
        $file_name = "test.jpg";
        
        $uri = substr($data,strpos($data,",")+1);
        $encoded_data = str_replace(' ','+', $uri);
        $decoded_data = base64_decode($encoded_data);
        
        file_put_contents($file_name, $decoded_data);
        
        $results  = array(
            'type'          => 'api_response',
            'result'        => 'Photo upload successful.',
            'result_code'   => 1,
        );
    } else {
        $results  = array(
            'type'          => 'api_response',
            'result'        => 'Authentication failed.',
            'result_code'   => -1,
        );
    }

    echo json_encode($results);
    flush();
?>