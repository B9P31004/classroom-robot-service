var url='selected_rules.json';
var app_read_rules_json = new Vue({
    el:"#form_option",
    data: {
        vaccurate:null,
        pfeatures:null,
        ifeatures:null,
        vfeatures:null,
        rmovement:null
    },
    mounted: function () {
        axios.get(url).then(response => {
            var rdata=response.data.rules
            this.vaccurate = rdata.vocabrary_detarmination_accurate
            this.pfeatures = rdata.phonetic_features
            this.ifeatures = rdata.image_features
            this.vfeatures = rdata.visual_features
            this.rmovement = rdata.robot_movement
        })
    }
})