var json_url='selected_rules.json';
var post_url='php/write_json_from_form.php';
var simplified_post_url='php/simplified_write_json_from_form.php';
var api_url='http://127.0.0.1:8000/opennlp_api/';
var chat=new Vue({
    el:".container",
    data:{
        
        rdata:"",
        contents:"",
        /*↓質問を順番に出力するための値やフラグ*/
        line_id:0, //変数question_categoryのカテゴリ判別に使用
        json_key_id:0, //各カテゴリに格納されている要素判別に使用
        start_flag:true, //開始ボタンが押されたかを判定するフラグ
        json_key_reset_flag:true, //json_key_idをtrueの時初期化するフラグ
        /*↑質問を順番に出力するための値やフラグ*/

        /*↓入力値や選択肢の保持に使用*/
        message:null,
        label_boolean:"",
        select_item:null,
        select_list:[{'text':"質問"}],
         /*↑入力値や選択肢の保持に使用*/

        /*↓UI下部テキストエリアなどの表示切替に使用*/
        textarea_ui:false,
        boolean_ui:false,
        select_ui:false,
        start_ui:false,
        end_ui:false,
        pre_ui:false,
        error_ui:false,
        /*↑UI下部テキストエリアなどの表示切替に使用*/
        
        error_message:"", //エラーメッセージの表示に使用

        parsing_result:[], //構文解析結果を格納しておく配列

        question_category:[] //selected_rules.jsonから各カテゴリのキー（文字列）を格納するための配列
    },
    mounted:function () {
        /*↓selected_rules.jsonからjsonデータを取得しquestion_categoryにカテゴリのキーを格納*/
        axios.get(json_url).then(response => {
            this.rdata=response.data.rules;
            this.question_category=Object.keys(this.rdata);
        });
        /*↑selected_rules.jsonからjsonデータを取得しquestion_categoryにカテゴリのキーを格納*/
        this.$nextTick(function() {
            this.question();
        });
    },
    methods:{
        /*↓質問内容を表示する関数*/
        return_message(text){
            var message='<div class="right_content"><div class="right_text"><div class="text">'+text+'</div><span class="date">'+send_time()+'</span></div></div>';
            this.contents+=message;
        },
        /*↑質問内容を表示する関数*/
        /*↓入力内容を表示する関数*/
        return_robot_message(text){
            var r_message='<div class="left_content"><img src="icon.png" /><div class="left_text"><div class="name">sota</div><div class="text">'+text+'</div><span class="date">'+send_time()+'</span></div></div>';
            this.contents+=r_message;
        },
        /*↑入力内容を表示する関数*/
        /*↓開始ボタンが押されたときの処理を行う関数*/
        click_start_button:function(){
            this.start_flag=false; //開始ボタンを押したらfalseに
            this.start_ui=false; //開始ボタンを隠す
            this.question();
            this.$nextTick(function() {
                scroll();
            });
        },
        /*↑開始ボタンが押されたときの処理を行う関数*/
        click_end_button:function(){
            this.change_message_area_ui()
            this.start_flag=true;
            this.end_ui=false;
            this.$nextTick(function() {
                this.question();
                this.$nextTick(function() {
                    scroll();
                });
            });
            this.data_arrange();
            axios.post(post_url,{
                "student_situation":this.rdata[this.question_category[0]],
                "example_sentence":this.rdata[this.question_category[1]],
                "parsing_result":this.parsing_result[0],
                "correct_answer_pattern":this.rdata[this.question_category[2]],
                "word_accurancy":this.rdata[this.question_category[3]],
                "teacher_behavior":this.rdata[this.question_category[4]],
                "pfeatures_boolean_list":this.rdata[this.question_category[5]],
                "ifeatures_boolean_list":this.rdata[this.question_category[6]],
                "vfeatures_boolean_list":this.rdata[this.question_category[7]],
                "rmovement":this.rdata[this.question_category[8]]
            }).then(response => {
                /*　phpからのエラー確認用 */
                /*console.log(response)*/
            })
            axios.post(simplified_post_url,{
                "student_situation":this.rdata[this.question_category[0]],
                "example_sentence":this.rdata[this.question_category[1]],
                "parsing_result":this.parsing_result[0],
                "correct_answer_pattern":this.rdata[this.question_category[2]],
                "word_accurancy":this.rdata[this.question_category[3]],
                "teacher_behavior":this.rdata[this.question_category[4]],
                "pfeatures_boolean_list":this.rdata[this.question_category[5]],
                "ifeatures_boolean_list":this.rdata[this.question_category[6]],
                "vfeatures_boolean_list":this.rdata[this.question_category[7]],
                "rmovement":this.rdata[this.question_category[8]]
            }).then(response => {
                /*　phpからのエラー確認用 */
                /*console.log(response)*/
            })
            axios.get(json_url).then(response => {
                this.rdata=response.data.rules;
            })
        },
        /*↓テキストエリアの入力値からボタンをクリックしたときに処理を行う関数*/
        click_send_message_button:function(){
            this.change_message_area_ui() //連続クリックを防ぐ
            if(this.message=="" || this.message==null){
                this.return_message("未入力"); //空白の場合は未入力を表示
            }
            else{
                this.return_message(this.message); //文字列の場合は文字を表示
            }
            this.rdata[this.question_category[this.line_id]][this.json_key_id]["data"]=this.message; //データを格納
            if("parsing" in this.rdata[this.question_category[this.line_id]][this.json_key_id] && !(this.message=="" || this.message==null)){
                this.send_to_api(this.message).then(response=>{
                    this.rdata[this.question_category[this.line_id]][this.json_key_id]["parsing"]=response;
                    this.return_robot_message("構文解析結果:"+response);
                    scroll();
                    this.check();
                    this.$nextTick(function() {
                        scroll();
                        this.message=null;
                        this.question();
                        this.$nextTick(function() {
                            scroll();
                        });
                    });
                });
            }
            else{
                scroll();
                this.check();
                this.$nextTick(function() {
                    scroll();
                    this.message=null;
                    this.question();
                    this.$nextTick(function() {
                        scroll();
                    });
                });
            }
        },
        /*↑テキストエリアの入力値からボタンをクリックしたときに処理を行う関数*/
        change_boolean_button:function(){
            this.change_message_area_ui()
            this.return_message(this.label_boolean);
            this.rdata[this.question_category[this.line_id]][this.json_key_id]["boolean"]=this.label_boolean;
            if("skip_id" in this.rdata[this.question_category[this.line_id]][this.json_key_id]){
                if(this.rdata[this.question_category[this.line_id]][this.json_key_id]["boolean"]=="false"){
                    this.json_key_id=this.rdata[this.question_category[this.line_id]][this.json_key_id]["skip_id"]-1;
                }
            }
            this.check();
            this.$nextTick(function() {
                scroll();
                this.label_boolean="";
                this.question();
                this.$nextTick(function() {
                    scroll();
                });
            });
        },
        click_boolean_button:function(val){
            this.change_message_area_ui();
            if(this.label_boolean==val){
                this.return_message(this.label_boolean);
                this.rdata[this.question_category[this.line_id]][this.json_key_id]["boolean"]=this.label_boolean;
                if("skip_id" in this.rdata[this.question_category[this.line_id]][this.json_key_id]){
                    if(this.rdata[this.question_category[this.line_id]][this.json_key_id]["boolean"]=="false"){
                        this.json_key_id=this.rdata[this.question_category[this.line_id]][this.json_key_id]["skip_id"]-1;
                    }
                }
                this.check();
                this.$nextTick(function() {
                    scroll();
                    this.label_boolean="";
                    this.question();
                    this.$nextTick(function() {
                        scroll();
                    });
                });
            }
        },
        click_select_button:function(){
            this.change_message_area_ui();
            this.return_message(this.select_list[this.select_item]["text"]);
            this.rdata[this.question_category[this.line_id]][this.json_key_id]["selected"]=this.select_item;
            this.check();
            this.$nextTick(function() {
                scroll();
                this.select_item=0;
                this.select_list=[{"id":0,"text":"選択肢","type":""}];
                this.question();
                this.$nextTick(function() {
                    scroll();
                });
            });
        },
        click_pre_button:function(){
            this.change_message_area_ui();
            if(this.line_id>0){
                if(this.json_key_id==0){
                    this.line_id-=1;
                    this.json_key_id=this.rdata[this.question_category[this.line_id]].length-2;
                    if("check_id" in this.rdata[this.question_category[this.line_id]][this.json_key_id+1]){
                        this.json_key_id=this.rdata[this.question_category[this.line_id]][this.json_key_id+1]["check_id"]-2;
                    }
                }
                else{
                    this.json_key_id-=2
                    if("check_id" in this.rdata[this.question_category[this.line_id]][this.json_key_id+1]){
                        this.json_key_id=this.rdata[this.question_category[this.line_id]][this.json_key_id+1]["check_id"]-2;
                    }
                }
                var text="ひとつ前に戻ります！"
                this.return_robot_message(text);
                this.$nextTick(function() {
                    scroll();
                    this.question();
                    this.$nextTick(function() {
                        scroll();
                    });
                });
            }
        },
        check(){
            this.error_handing(this.rdata[this.question_category[this.line_id]][this.json_key_id]["qtype"]);
            if(this.json_key_id==this.rdata[this.question_category[this.line_id]].length-1){
                this.line_id+=1
                this.json_key_reset_flag=true;
            }
        },
        error_handing(qtype){
            if(qtype=="text" || qtype=="percent"){
                if(!this.message){
                    if("constraint" in this.rdata[this.question_category[this.line_id]][this.json_key_id]){
                        if(this.rdata[this.question_category[this.line_id]][this.json_key_id]["constraint"]=="not_null"){
                            this.error_ui=true;
                            this.json_key_id-=1;
                            this.error_message="■入力必須項目です";
                        }
                        else if(this.rdata[this.question_category[this.line_id]][this.json_key_id]["constraint"]=="check"){
                            if(this.rdata[this.question_category[this.line_id]][this.rdata[this.question_category[this.line_id]][this.json_key_id]["check_id"]-1]["boolean"]=="true"){
                                this.error_ui=true;
                                this.json_key_id-=1;
                                this.error_message="■入力必須項目です";
                            }
                        }
                    }
                    else{
                        this.error_ui=false;
                    }
                }
                else{
                    if(qtype=="percent"){
                        this.percent_check(this.message);
                    }
                    else{
                        this.error_ui=false;
                    }
                }
            }
        },
        percent_check(percent){
            percent=convert_half_number(percent);
            percent=Number(percent);
            if(isNaN(percent)){
                this.error_ui=true;
                this.json_key_id-=1;
                this.error_message="■数値で入力してください"
            }
            else if(percent<0 || 100<percent){
                this.error_ui=true;
                this.json_key_id-=1;
                this.error_message="■0~100の値を入力してください"
            }
            else{
                this.error_ui=false;
            }
        },
        reset_json_key(){ 
            if(this.json_key_reset_flag){
                this.json_key_reset_flag=false;
                this.json_key_id=0;
            }
            else{
                this.json_key_id+=1;
            }      
        },
        change_message_area_ui(qtype){
            if(qtype=="text" || qtype=="percent"){
                if("data" in this.rdata[this.question_category[this.line_id]][this.json_key_id]){
                    this.message=this.rdata[this.question_category[this.line_id]][this.json_key_id]["data"];
                }
                this.textarea_ui=true;
            }
            else{
                this.textarea_ui=false;
            }
            if(qtype=="boolean"){
                if("boolean" in this.rdata[this.question_category[this.line_id]][this.json_key_id]){
                    this.label_boolean=this.rdata[this.question_category[this.line_id]][this.json_key_id]["boolean"];
                }
                this.boolean_ui=true;
            }
            else{
                this.boolean_ui=false;
            }
            if(qtype=="select"){
                this.select_list=this.rdata[this.question_category[this.line_id]][this.json_key_id]["select"];
                if("selected" in this.rdata[this.question_category[this.line_id]][this.json_key_id]){
                    this.select_item=this.rdata[this.question_category[this.line_id]][this.json_key_id]["selected"];
                }
                else{
                    this.select_item=this.rdata[this.question_category[this.line_id]][this.json_key_id]["select"][0]["id"]-1;
                }
                this.select_ui=true;
            }
            else{
                this.select_ui=false;
            }
        },
        question(){
            if(this.line_id==0){
                this.pre_ui=false;
                if(this.start_flag){
                    this.start_ui=true;
                    var text="始めるにはボタンを押してね！";
                    this.return_robot_message(text);
                }
                else{
                    this.reset_json_key();
                    this.change_message_area_ui(this.rdata[this.question_category[this.line_id]][this.json_key_id]["qtype"]);
                    var text=this.rdata[this.question_category[this.line_id]][this.json_key_id]["text"];
                    this.return_robot_message(text);
                }
            }
            else if(this.line_id==Object.keys(this.rdata).length){
                this.line_id=0;
                this.change_message_area_ui("none");
                this.end_ui=true;
                var text="データを更新します！";
                this.return_robot_message(text);
            }
            else{
                this.pre_ui=true;
                this.reset_json_key();
                this.change_message_area_ui(this.rdata[this.question_category[this.line_id]][this.json_key_id]["qtype"]);
                var text=this.rdata[this.question_category[this.line_id]][this.json_key_id]["text"];
                this.return_robot_message(text);
            }
        },
        data_arrange(){
            for(var num=0;num<this.question_category.length;num++){
                for(var rnum=0;rnum<this.rdata[this.question_category[num]].length;rnum++){
                    if("constraint" in this.rdata[this.question_category[num]][rnum]){
                        delete this.rdata[this.question_category[num]][rnum]["constraint"];
                    }
                    if("check" in this.rdata[this.question_category[num]][rnum]){
                        delete this.rdata[this.question_category[num]][rnum]['check'];
                        delete this.rdata[this.question_category[num]][rnum]['check_id'];
                    }
                    if("skip_id" in this.rdata[this.question_category[num]][rnum]){
                        delete this.rdata[this.question_category[num]][rnum]["skip_id"];
                    }
                    if("parsing" in this.rdata[this.question_category[num]][rnum]){
                        this.parsing_result.push(this.rdata[this.question_category[num]][rnum]["parsing"]);
                        delete this.rdata[this.question_category[num]][rnum]["parsing"];
                    }
                    delete this.rdata[this.question_category[num]][rnum]["qtype"];
                }
            }
        },
        async send_to_api(text){
            /* { 構文解析APIに接続し結果を受け取る */
            var parsing;
            await axios.post(api_url,data=text).then(response => {
                parsing=response.data
            })
            return parsing
            /* 構文解析APIに接続し結果を受け取る } */
        }
    },
})
function scroll(){
    var element=document.getElementById('contents');
    element.scrollTop=element.scrollHeight-element.clientHeight+20;
}
function send_time(){
    var date=new Date();
    var hour=date.getHours();
    var minutes=date.getMinutes();
    if(String(minutes).length==1){
        minutes='0'+minutes;
    }
    var time=hour+":"+minutes;
    return time
}
function convert_half_number(text){
    return text.replace(/[０-９]/g,function(s){
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}