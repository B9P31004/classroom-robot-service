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
        array(
            "rule_id"=>$id,
            "basic_information"=>array(
                "student_situation"=>$data["student_situation"],
                "example_sentence"=>$data["example_sentence"],
                "parsing_result"=>$data["parsing_result"]
            ),
            "correct_answer_pattern"=>$data["correct_answer_pattern"],
            "when"=>array(
                "word_accurancy"=>$data["word_accurancy"],
                "voice_recognition"=>$data["pfeatures_boolean_list"],
                "image_recognition"=>$data["ifeatures_boolean_list"],
                "video_recognition"=>$data["vfeatures_boolean_list"]
            ),
            "then"=>array(
                "teacher_behavior"=>array("word"=>$data["teacher_behavior"]),
                "robot_action"=>$data["rmovement"]
            )
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
    array_push($json["rules"],$contents["rules"][0]);
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