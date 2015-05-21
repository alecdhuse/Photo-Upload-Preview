<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: x-requested-with");
    
    //Write code to do authentication here
    $auth = true;
    
    //Check authentication
    if ($auth == true) {
        $data = $_POST['photo_data'];
        
        //Check dataurl mime type
        $mime_type = substr($data, 5, strpos($data, ";")-5);
        
        if (strcmp($mime_type, "image/png") == 0) {
            $mime_type_ok = true;
            $file_ext = ".png";
        } else if (strcmp($mime_type, "image/jpeg") == 0) {
            $mime_type_ok = true;
            $file_ext = ".jpg";
        } else {
            $mime_type_ok = false;
            $file_ext = "";
        }
        
        if ($mime_type_ok == true) {
            //Write code to determin file name here
            $file_name = "test" . $file_ext;
            
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
                'result'        => 'Unsupported file type.',
                'result_code'   => -1,
            );
        }
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