<?php
function return_rules($id,$data){
    foreach($data["pfeatures_boolean_list"] as $key => $value){
        $data["pfeatures_boolean_list"][$key]=$value["boolean"];
    }
    foreach($data["ifeatures_boolean_list"] as $key => $value){
        $data["ifeatures_boolean_list"][$key]=$value["boolean"];
    }
    foreach($data["vfeatures_boolean_list"] as $key => $value){
        $data["vfeatures_boolean_list"][$key]=$value["boolean"];
    }
    $contents=array(
        "rule_id_" . $id=>array(
            "basic_information"=>array(
                "student_situation"=>$data["student_situation"],
                "example_sentence"=>$data["example_sentence"],
                "parsing_result"=>$data["parsing_result"]
            ),
            "correct_answer_pattern"=>$data["correct_answer_pattern"],
            "word_accurancy"=>$data["word_accurancy"],
            "voice_recognision"=>$data["pfeatures_boolean_list"],
            "image_recognision"=>$data["ifeatures_boolean_list"],
            "video_recognision"=>$data["vfeatures_boolean_list"],
            "action"=>$data["rmovement"]
        )
    );
    $contents=array(
        "rules"=>$contents
    );
    return $contents;
}
/* エラーを送る場合は外す */
/*ini_set('display_errors', "On");*/
$url = '../output_json/simplified_output_rules.json';

$request_body = file_get_contents('php://input');
$data=json_decode($request_body,true);

if($json = file_get_contents($url)){
    $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
    $json = json_decode($json,true);
    $id=count($json["rules"])+1;
    $contents=return_rules($id,$data);
    $json["rules"]+=$contents["rules"];
    $json=json_encode($json,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    file_put_contents($url, $json,LOCK_EX);
}
else{
    $id=1;
    $contents=return_rules($id,$data);
    $json=json_encode($contents,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    file_put_contents($url, $json,LOCK_EX);
}
?>