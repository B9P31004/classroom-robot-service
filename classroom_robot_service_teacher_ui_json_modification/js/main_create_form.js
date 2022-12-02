var json_url='selected_rules.json';
var post_url='php/write_json_from_form.php'
var simplified_post_url='php/simplified_write_json_from_form.php'
var api_url='http://127.0.0.1:8000/opennlp_api/'
var create_form = new Vue({
    el:"#form_option",
    data: {
        /* { jsonから読み出した値を格納する変数 */
        student_situation:null,
        example_sentence:null,
        parsing_result:null,
        correct_answer_pattern:null,
        word_accurancy:null,
        percent:null,
        teacher_behavior:null,
        pfeatures:null,
        ifeatures:null,
        vfeatures:null,
        rmovement:null,
        /* jsonから読み出した値を格納する変数 } */
        /* { チェックボックス表示のための情報を入れる変数 */
        correct_answer_pattern_cbeckbox_id:"",
        word_accurancy_checkbox_id:"",
        pfeatures_checkbox_id:"",
        ifeatures_checkbox_id:"",
        vfeatures_checkbox_id:"",
        rmovement_content:null,
        correct_answer_pattern_checkbox_check:false,
        word_accurancy_checkbox_check:false,
        pfeatures_checkbox_check:false,
        ifeatures_checkbox_check:false,
        vfeatures_checkbox_check:false,
        word_accurancy_list:{},
        pfeatures_boolean_list:[],
        ifeatures_boolean_list:[],
        vfeatures_boolean_list:[],
        rmovement_list:{},
        /* チェックボックス表示のための情報を入れる変数 } */
        /* { エラー表示用変数 */
        student_situation_error:null,
        example_sentence_error:null,
        correct_answer_pattern_error:null,
        percent_error:null,
        teacher_behavior_error:null,
        /* エラー表示用変数 } */
        form_post_flag:true,
    },
    mounted:function () {
        /* { jsonデータを読み出し、上記data内の変数に格納 */
        axios.get(json_url).then(response => {
            var rdata=response.data.rules;
            this.word_accurancy = rdata.word_accurancy
            this.pfeatures = rdata.phonetic_features
            this.ifeatures = rdata.image_features
            this.vfeatures = rdata.visual_features
            this.rmovement = rdata.robot_movement
            /* { チェックボックスのid属性の値にルールベースのidを入れる*/
            this.word_accurancy_checkbox_id=this.word_accurancy[0].woA_id
            this.pfeatures_checkbox_id=this.pfeatures[0].voR_id
            this.ifeatures_checkbox_id=this.ifeatures[0].imR_id
            this.vfeatures_checkbox_id=this.vfeatures[0].viR_id
            this.rmovement_content=this.rmovement[0]
            /* チェックボックスのid属性の値にルールベースのidを入れる } */
            /* { ルールごとにチェックボックスの論理値を初期状態としてfalseにする */
            for(var num=0;num<this.word_accurancy.length;num++){
                this.word_accurancy_list[this.word_accurancy[num].woA_id]={'order':this.word_accurancy[num].order};
            }
            for(var num=0;num<this.pfeatures.length;num++){
                this.pfeatures_boolean_list.push({'id':Number(this.pfeatures[num].voR_id),'boolean':false,'feature':this.pfeatures[num].feature,'type':this.pfeatures[num].type});
            }
            for(var num=0;num<this.ifeatures.length;num++){
                this.ifeatures_boolean_list.push({'id':Number(this.ifeatures[num].imR_id),'boolean':false,'feature':this.ifeatures[num].feature,'type':this.ifeatures[num].type});
            }
            for(var num=0;num<this.vfeatures.length;num++){
                this.vfeatures_boolean_list.push({'id':Number(this.vfeatures[num].viR_id),'boolean':false,'feature':this.vfeatures[num].feature,'type':this.vfeatures[num].type});
            }
            /* ルールごとにチェックボックスの論理値を初期状態としてfalseにする } */
        })
        /* jsonデータを読み出し、上記data内の変数に格納 } */
    },
    methods:{
        select_option:function(e){
            /* { セレクトタグの値がスクロールにより変更されたら対応するチェックボックスのid、論理値を更新する */
            if(e.target.name=="woA_s"){
                this.word_accurancy_checkbox_id=JSON.parse(e.target.value).woA_id;
            }
            if(e.target.name=="voR_s"){
                console.log("a")
                this.pfeatures_checkbox_id=e.target.selectedIndex+1;
                this.pfeatures_checkbox_check=this.pfeatures_boolean_list[this.pfeatures_checkbox_id].boolean
            }
            else if(e.target.name=="imR_s"){
                this.ifeatures_checkbox_id=e.target.selectedIndex+1;
                this.ifeatures_checkbox_check=this.ifeatures_boolean_list[this.ifeatures_checkbox_id].boolean
            }
            else if(e.target.name=="viR_s"){
                this.vfeatures_checkbox_id=e.target.selectedIndex+1;
                this.vfeatures_checkbox_check=this.vfeatures_boolean_list[this.vfeatures_checkbox_id].boolean
            }
            else if(e.target.name=="roM_s"){
                this.rmovement_content=JSON.parse(e.target.value)
            }
            /* セレクトタグの値がスクロールにより変更されたら対応するチェックボックスのid、論理値を更新する } */
        },
        click_check_box:function(e){
            /* { チェックボックスがクリックされたらルールの論理値を逆の値に変える */
            if(e.target.name=="voR_s"){
                this.pfeatures_boolean_list[e.target.id].boolean=!this.pfeatures_checkbox_check;
            }
            else if(e.target.name=="imR_s"){
                this.ifeatures_boolean_list[e.target.id].boolean=!this.ifeatures_checkbox_check;
            }
            else if(e.target.name=="viR_s"){
                this.vfeatures_boolean_list[e.target.id].boolean=!this.vfeatures_checkbox_check;
            }
            /* チェックボックスがクリックされたらルールの論理値を逆の値に変える } */
        },
        click_post_button:function(){
            if(!this.student_situation){
                this.form_post_flag=false
                this.student_situation_error="<p>■入力してください</p>"
            }
            else{
                this.student_situation_error=null
            }
            if(!this.example_sentence){
                this.form_post_flag=false
                this.example_sentence_error="<p>■入力してください</p>"
            }
            else{
                this.example_sentence_error=null
            }
            if(this.correct_answer_pattern_checkbox_check && !this.correct_answer_pattern){
                this.form_post_flag=false
                this.correct_answer_pattern_error="<p>■入力してください</p>"
            }
            else{
                this.correct_answer_pattern_error=null
            }
            if(this.word_accurancy_checkbox_check && !this.percent){
                this.form_post_flag=false
                this.percent_error="<p>■割合を入力してください</p>"
            }
            else if(this.word_accurancy_checkbox_check){
                modified_percent=convert_half_number(this.percent);
                modified_percent=Number(modified_percent)
                if(isNaN(modified_percent)){
                    this.form_post_flag=false
                    this.percent_error="<p>■数値で入力してください</p>"
                }
                else if(modified_percent<0 || 100<modified_percent){
                    this.form_post_flag=false
                    this.percent_error="<p>■0~100の値を入力してください</p>"
                }
                else{
                    this.percent_error=null
                }
            }
            else{
                modified_percent=null
                this.percent_error=null
            }
            if(this.word_accurancy_checkbox_check && !this.teacher_behavior){
                this.form_post_flag=false
                this.teacher_behavior_error="<p>■教師の言動を入力してください</p>"
            }
            else{
                this.teacher_behavior_error=null
            }
            if(this.form_post_flag){
                axios.post(post_url,{
                    "student_situation":this.student_situation,
                    "example_sentence":this.example_sentence,
                    "parsing_result":this.parsing_result,
                    "correct_answer_pattern":this.correct_answer_pattern,
                    "word_accurancy":{'id':this.word_accurancy_checkbox_id,'boolean':this.word_accurancy_checkbox_check,'order':this.word_accurancy_list[this.word_accurancy_checkbox_id].order,'percent':Number(modified_percent),'teacher_behavior':this.teacher_behavior},
                    "pfeatures_boolean_list":this.pfeatures_boolean_list,
                    "ifeatures_boolean_list":this.ifeatures_boolean_list,
                    "vfeatures_boolean_list":this.vfeatures_boolean_list,
                    "rmovement":this.rmovement_content
                }).then(response => {
                    /*　phpからのエラー確認用 */
                    /*console.log(response)*/
                })
                axios.post(simplified_post_url,{
                    "student_situation":this.student_situation,
                    "example_sentence":this.example_sentence,
                    "parsing_result":this.parsing_result,
                    "correct_answer_pattern":this.correct_answer_pattern,
                    "word_accurancy":{'id':this.word_accurancy_checkbox_id,'boolean':this.word_accurancy_checkbox_check,'order':this.word_accurancy_list[this.word_accurancy_checkbox_id].order,'percent':Number(modified_percent),'teacher_behavior':this.teacher_behavior},
                    "pfeatures_boolean_list":this.pfeatures_boolean_list,
                    "ifeatures_boolean_list":this.ifeatures_boolean_list,
                    "vfeatures_boolean_list":this.vfeatures_boolean_list,
                    "rmovement":this.rmovement_content
                }).then(response => {
                    /*　phpからのエラー確認用 */
                    /*console.log(response)*/
                })
            }
            this.form_post_flag=true
        },
        send_to_api:function(){
            /* { 構文解析APIに接続し結果を受け取る */
            axios.post(api_url,data=this.example_sentence).then(response => {
                this.parsing_result=response.data
            })
            /* 構文解析APIに接続し結果を受け取る } */
        }
    }
})

function convert_half_number(text){
    return text.replace(/[０-９]/g,function(s){
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}