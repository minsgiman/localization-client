<template>
    <div id="login_page">
        <div class="toggle cont_min" style="min-height: 535px; background-color:#ffffff;">
            <div class="wrap_login" style="background-color:#ffffff;">
                <div v-show="showTitle" class="logo_header" style="background-color:#ffffff;">
                    <img style="width:236px;height:25px;" src="/img/bi_toastcambiz_blue.svg"><br>
                </div>
                <div v-show="showError" class="logo_header"  style="background-color:#ffffff;">
                    <img style="width:236px;height:25px;" src="/img/bi_toastcambiz_blue.svg"><br>
                    <div>
                        <span style="display:inline-block; width:20px; height:20px; margin-bottom:-5px; background: url(/img/ic-login-fail.png) no-repeat; background-size:20px 20px;"></span>
                        <span style="display:inline-block; margin-top:20px; margin-bottom:4px; padding-left:6px; font-weight:500;" class="err_txt">로그인에 실패하였습니다.</span>
                    </div>
                    <span class="txt2" style="width:238px; display:inline-block; line-height:1.5; color:#666666">없는 아이디이거나 아이디 또는 비밀번호가 일치하지 않습니다.</span>
                </div>
                <div class="container_login" style="background-color:#ffffff;">
                    <div class="login_cnt">
                        <div>
                            <div class="login_area">
                                <div id="idArea">
                                    <div class="input_txt_area input_email_id" id="idInput">
                                        <input id="id" placeholder="ID" type="text" value="" autocapitalize="none" v-model="valId">
                                        <button v-show="valId" @click="() => {this.valId = '';}" id="idBtn" type="button" class="btn_del" tabindex="-1"><img src="/img/btn-input-text-delete.png" style="width:20px; height:20px; top:0; vertical-align:middle;"></button>
                                    </div>
                                </div>
                                <div class="input_txt_area" id="pwInput">
                                    <input id="pw" placeholder="password" type="password" maxlength="15" v-model="valPw">
                                    <button v-show="valPw" @click="() => {this.valPw = '';}" id="pwBtn" type="button" class="btn_del" tabindex="-1"><img src="/img/btn-input-text-delete.png" style="width:20px; height:20px; top:0; vertical-align:middle;"></button>
                                </div>
                            </div>
                            <div class="login_area">
                                <div class="btn_mainarea">
                                    <button type="button" class="btn_v1" @click="login()">로그인</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showLoading" class="dimmed" style="z-index:250;"></div>
                <div v-if="showLoading" class="loading_area" style="z-index:250;">
                    <div class='uil-default-css' style='transform:scale(0.3);'><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:10px;position:absolute;'></div><div style='top:80px;left:93px;width:14px;height:40px;background:#00b2ff;-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:10px;position:absolute;'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { router } from '../main';
    import gEventBus from './../service/gEventBus';
    import config from './../config/config';

    export default {
        data : function() {
            return {
                valId : '',
                valPw : '',
                showTitle: true,
                showError: false,
                showLoading: false
            }
        },
        created : function() {
            gEventBus.$on('LOGIN_RESULT', this.onLoginRes);
        },
        beforeDestroy : function() {
            gEventBus.$off('LOGIN_RESULT', this.onLoginRes);
        },
        methods : {
            login: function() {
                if (!this.valId || !this.valPw){
                    this.showTitle = false;
                    this.showError = true;
                    return;
                }

                this.showLoading = true;
                this.$store.dispatch('REQUEST_LOGIN', {id: this.valId, password: this.valPw});
            },
            onLoginRes: function(res) {
                this.showLoading = false;
                if (res && res.token && res.code === 'ok') {
                    localStorage.setItem(config.tokenKey, res.token);
                    this.$store.dispatch('FETCH_USER').then((user) => {
                        if (user) {
                            router.push({path: 'managePage'});
                        } else {
                            this.showTitle = false;
                            this.showError = true;
                        }
                    });
                } else {
                    this.showTitle = false;
                    this.showError = true;
                }
            }
        }
    }
</script>
<style>
    ul,ol{list-style:none}
    em,address{font-style:normal}
    a{color:#000;text-decoration:none;cursor:pointer }
    a:hover,a:active,a:focus{text-decoration:none}
    button{overflow:visible;border:0;background:transparent;cursor:pointer;line-height:0;vertical-align: inherit; outline:none;}
    button::-moz-focus-inner{padding:0;border:0}
    button span{position:relative}
    input[type='text'],input[type='password']{border:0;background:transparent;vertical-align:top;outline:none}
    input[type='checkbox'],input[type='radio']{border:none;-webkit-appearance:none;appearance:none;background:transparent;opacity:0;vertical-align:top}
    input[type=text]::-ms-clear{display:none}
    input{-webkit-appearance:none;appearance:none}
    input{outline-width: 0; cursor:pointer }
    input::-webkit-input-placeholder{color: #bbb; font-size: 14px;}
    input::-webkit-input-placeholder:lang(ja){font-size: 13px;}
    input::-moz-placeholder{color: #bbb; font-size: 14px;}
    input::-moz-placeholder:lang(ja){font-size: 13px;}
    input::-ms-input-placeholder{color: #bbb; font-size: 14px;}
    input::-ms-input-placeholder:lang(ja){font-size: 13px;}
    input{font-size: 14px;}
    input:lang(ja){font-size: 13px;}

    .blind,legend{visibility:hidden;overflow:hidden;position:absolute;top:0;left:0;width:1px;height:1px;font-size:0;line-height:0}
    .tit{font-size:34px;color:#4b96e6; margin-top: 7px;}
    .tit_sub{font-size:40px; color:#4b96e6; border-bottom: 1px solid #ccc; padding-bottom: 15px; margin-top: 7px;}
    .tit_sub_gd_b2b{font-size: 28px; font-weight: normal;}
    .tit_sub_none{border: 0; padding-bottom: 0; margin-top: 7px;}
    .tit span.cm{font-size: 20px; color: #d4d4d4; padding: 0 10px;}
    .tit button.cm{position: absolute; background:#4f98e4; padding: 0px 12px; font-size: 14px; color: #fff; line-height: 26px; margin-top: 4px; border-radius: 2px;}
    .tit button.cm_basic{position: absolute; right: 80px; background:#4f98e4; padding: 0px 12px 2px; font-size: 14px; color: #fff; line-height: 30px; margin-top: 4px; border-radius: 2px;}
    .tit_sub button.b2b_basic{position: absolute; background:#4f98e4; padding: 0px 15px; font-size: 16px; color: #fff; line-height: 35px; border-radius: 2px; margin-left: 20px; margin-top: 2px;}
    .tit_sub button img{position: relative;top:9px; margin-right: 5px;}
    .tit_sub button.b2b_camera_move{position: absolute; background:#fcfcfc; width: 136px; text-align: center; font-size: 14px; color: #555555; line-height: 42px; border: 1px solid #dddddd; right: 60px;}
    .tit_sub button.b2b_camera_move img{position: relative;top:12px; margin-right: 5px;}
    .tit_sub button.b2b_store_plus{position: absolute; background:#fcfcfc; width: 136px; text-align: center; font-size: 14px; color: #555555; line-height: 42px; border: 1px solid #dddddd; right: 195px;}
    .tit_sub button.b2b_store_plus img{position: relative;top:12px; margin-right: 5px;}
    .tit_b2b_h3{font-size:28px;color:#4a95eb; margin: -60px 0 -40px 0px;}
    .tit_demo{font-size:14px;color:#777; margin-top: 15px; margin-bottom: 23px; font-weight: normal;}
    .tit_b2b_demo{font-size:14px;color:#777; margin-top: -20px; margin-bottom: 43px; text-align: center;}
    .tit_b2b_demo_acc{font-size:14px;color:#777; margin-top: -25px; margin-bottom: 48px; text-align: center;}
    .tit_route{position: absolute; right: 60px; top:22px; font-size: 14px; color: #777; font-weight: 200;}
    .tit_route_gd{position: absolute; right: 0px; top:55px; font-size: 14px; color: #777; font-weight: normal; width: 300px; text-align: right;}
    .tit_route span{color: #ccc; margin: 0 8px;}
    .tit_route_gd span{color: #ccc; margin: 0 8px;}
    .btn .ic,.aln{display:inline-block;vertical-align:middle}
    .fl{float:left}
    .fr{float:right}
    .fclear:after,.lst_video:after,.lst_video li dl:after,.sec2 ul:after,.sec6:after,.cs .inr:after{display:block;clear:both;content:''}
    .elp{display:block;overflow:hidden;width:100%;white-space:nowrap;text-overflow:ellipsis}
    .elp_clip{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;float: left;max-width: 280px; font-size: 16px;}
    .elp_clip span.pos_stit{color: #999; font-size: 14px; margin-left: 6px;}
    .sp,.sns_area a,.video_area.add:after,.btn .ic:before,.btn_w .ic:before,.evt_lst_wrap .evt_lst li button:after,.filter_bx.bd .chk input:checked+label,.filter_bx:first-child .chk input:checked+label:before,.ck_bx label:before,.ck_bx2 label:before,.rdo label:before,.rdo2 label:before,.zone,.time_info:after,.inp_box.calendar button,.inp_box.clock button,.evt_lst_wrap.v2 .open .set_modi .zone:after,.evt_lst_wrap.v2 .open .chk input:checked+label,.s_tit_area li:before,.user:after,.instal .s_menu li.cfrm:after{display:inline-block;overflow:hidden;background:url(/resources/im/sp.png) no-repeat;line-height:999px;vertical-align:top}
    h2{font-weight: 300;}
    h3{font-weight: 300;}

    /* images */
    .sp,.sns_area a,.video_area.add:after,.btn .ic:before,.btn_w .ic:before,.evt_lst_wrap .evt_lst li button:after,.filter_bx.bd .chk input:checked+label,.filter_bx:first-child .chk input:checked+label:before,.ck_bx label:before,.ck_bx2 label:before,.rdo label:before,.rdo2 label:before,.zone,.time_info:after,.inp_box.calendar button,.inp_box.clock button,.evt_lst_wrap.v2 .open .set_modi .zone:after,.evt_lst_wrap.v2 .open .chk input:checked+label,.s_tit_area li:before {display:inline-block;overflow:hidden;background:url(/resources/im/sp.png) no-repeat;line-height:999px;vertical-align:top}

    /* button style */
    .btn,.btn_s,.btn_b{display:inline-block;text-align:center;line-height:100%; border-radius: 0;}
    .btn_s{padding:8px 13px;color:#fff; font-size: 14px;}
    .btn_b{padding:22px 0 21px;background:#4b96e6;font-size:18px;font-weight:400;color:#fff}
    .btn_b:hover{background:#448ede;}
    .btn_w{border:1px solid #d5d5d5;font-size:14px;color:#333333}
    .btn_ss{padding:4px 6px;background:#555;color:#fff}
    .btn_bc{background:#111}
    .btn_sbc{background:#777}
    .btn_sbc:hover{background:#555}
    .btn_sbl{background:#c8c8c8}
    .btn_sbl:hover{background:#aaa}
    .btn_sb{background:#4b96e6}
    .btn_sb:hover{background:#448ede}
    .btn_set{height:40px;background:#4b96e6;font-size:14px;}
    .btn_wf{border:1px solid #d5d5d5;background:#fff;color:#333333}

    /* layer */
    .dimmed{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:130;display: block;}
    .ly_pop{position:absolute;top:175px;left:50%;padding: 10px 30px 30px 30px; z-index:200;background:#fff;box-sizing:border-box}
    .ly_pop_bottom_long{padding-bottom: 30px;}
    .ly_pop_long{top:100px;}
    .ly_pop_big{padding: 60px;}
    .ly_tit{height:20px;padding:15px 0 10px}
    .ly_tit h2{display:inline-block;margin-right:10px;font-size:20px;color:#333;line-height:22px;vertical-align:top; font-weight: 400;}
    .ly_tit h2 span.store_name{color:#333;}
    .ly_tit h2 span.clip_sxt{font-size:14px;color:#999;font-weight: normal; margin-left: 10px;}
    .ly_tit h2 span.acc_info_popup{margin-left: 10px;}
    .ly_tit h2 span.acc_info_popup a{font-size: 14px; color: #4b96e6; font-weight: 300;}
    .ly_tit h2 span.acc_info_popup a:hover{text-decoration: underline; color: #3882d6;}
    .ly_tit h2 span.acc_info_popup img{position: relative; margin-top: -3px;}
    .ly_tit h2 span.acc_sxt{font-size:14px;color:#999;font-weight: normal; margin-left: 10px;}
    .ly_tit h2 span.acc_save{font-size: 16px; color: #666; font-weight: normal;}
    .ly_tit h2 .sh_r{position: absolute; right: 40px; margin-top: -28px;}
    .ly_tit h2 .sh_r em.share_IN{color: #fff; background: #4b96e6; border-radius: 17px; line-height: 34px; padding: 1px 12px 0; height: 34px; font-size: 14px;}
    .ly_tit h2 .sh_r em.share_wait{color: #fff; background: #b7b7b7; border-radius: 17px; line-height: 34px; padding: 1px 7px 0; height: 34px; font-size: 14px;}
    .ly_tit h2 .sh_r em.share_OUT{color: #fff; background: #ef351c; border-radius: 17px; line-height: 34px; padding: 1px 5px 0; height: 34px; font-size: 14px;}
    .ly_stit{height:20px;padding:0px;}
    .ly_stit h2{display:inline-block;margin-right:10px;font-size:14px;color:#999;line-height:22px;vertical-align:top; font-weight: normal;}
    .ly_tit h2 span.send_stxt{font-size:14px;color:#777;font-weight: normal; margin-left: 10px;}
    .ly_tit h2 span.pos_stxt{font-size:16px;color:#999;font-weight: normal; margin-left: 8px;}

    .ly_tit .toggle_lst{display:inline-block;float:none;margin-left:10px}
    .ly_tit .titmody{width:16px;height:16px;margin-top:21px;background-position:-190px -319px;margin-left: 10px;}
    .ly_pop .btn_box{margin-top:20px;text-align:center; clear: both;}
    .ly_pop .btn_box .btn_b{height:50px;width: 150px; font-size:16px;color:#fff;border-radius: 25px; padding: 0; margin: 0 5px;}
    .ly_pop .btn_close{overflow:hidden;position:absolute;top:20px;right:30px;width:18px;height:18px;background-position:-36px -69px;line-height:999px}
    .ly_pop .btn_close_alert{overflow:hidden;position:absolute;top:26px;right:30px;width:18px;height:18px;background-position:-36px -69px;line-height:999px}
    .ly_pop .btn_close_demo{overflow:hidden;position:absolute;top:30px;right:30px;width:18px;height:18px;background-position:-143px -385px;line-height:999px}
    .ly_pop .btn_close_store{overflow:hidden;position:absolute;top:20px;right:20px;width:18px;height:18px;background-position:-36px -69px;line-height:999px}
    .ly_pop .btn_box_s_area{margin-top:0px; margin-bottom: 0px; text-align: right;}
    .ly_pop .btn_box_s_area button{padding: 9px 13px; font-size: 12px;}

    .ly_pop .ly_con{width:422px;margin-top:10px;padding:10px 0 ;border-width:1px 0}
    .ly_pop .ly_con_mg{margin-bottom: 40px; overflow: hidden;}
    .ly_pop .ly_con{font-size:14px;color:#333;line-height:26px;}
    .ly_pop .ly_con_sm{width: 346px;}
    .ly_pop .ly_con_b2b{width: 600px;}
    .ly_pop .ly_con_all{width: 800px;}
    .ly_pop .ly_con_cm_move{margin-top: 0;}
    .ly_pop .ly_con_local{width: 460px;}
    .ly_pop .ly_con .b2b_cm_move_list{width: 100%; border-bottom: 1px solid #ddd; max-height: 340px; overflow-y: auto;}
    .ly_pop .ly_con .b2b_cm_move_list ul.cm_list_bd{clear: both; border-bottom: 1px solid #ddd;}
    .ly_pop .ly_con .b2b_cm_move_list ul.cm_mv_ck_mg{padding-top: 38px;}
    .ly_pop .ly_con .b2b_cm_move_list li{float: left;}
    .ly_pop .ly_con .b2b_cm_move_list li.cm_mv_ck{width: 30px;}
    .ly_pop .ly_con .b2b_cm_move_list li.cm_mv_ck .cm_mv_ck_s{width: 30px;}
    .ly_pop .ly_con .b2b_cm_move_list li.cm_mv_ck .cm_mv_ck_s input{margin: 0;}
    .ly_pop .ly_con .b2b_cm_move_list li.cm_mv_img{width: 110px;}
    .ly_pop .ly_con .b2b_cm_move_list li.cm_mv_name{line-height: 90px; padding-left: 10px;}
    .ly_pop .ly_con .b2b_cm_move_list li img{width: 108px; height: 72px; margin: 8px 0; border: 1px solid rgba(0,0,0,.2);}

    .ly_pop .ly_con p{color: #777; font-size: 14px;}
    .ly_pop .ly_con p.warning{color: #333333; font-size: 14px; font-weight: 400; line-height: 1.5; margin-top: 10px;}
    .ly_pop .ly_con p.ta_L{color: #666; font-size: 14px; line-height: 30px; text-align: left; padding-left: 10px;}
    .ly_pop .ly_con p.ta_all{color: #777; font-size: 13px; line-height: 21px; text-align: left;}
    .ly_pop .ly_con p.ta_all strong{color: #555; font-size: 15px; line-height: 21px; text-align: left;}
    .ly_pop .ly_con p.ta_all span{color: #333;}
    .ly_pop .ly_con p.ta_L_b{color: #4b96e6; font-size: 16px; text-align: left; margin-top: 20px;  padding-left: 10px;}
    .ly_pop .ly_con p.ta_L_view{text-align: left; margin-top: 20px;}
    .ly_pop .ly_con p.ta_L_view a{color: #4b96e6; font-size: 16px;}
    .ly_pop .ly_con p.ta_L_view a:hover{text-decoration: underline;}
    .ly_pop .ly_con p.txt_s{color: #999; font-size: 12px; line-height: 1.5; margin-top: 10px;}
    .ly_pop .ly_con p.plus{font-size: 18px; color: #333; margin-bottom: 10px;}
    .ly_pop .ly_con p.plus_s{font-size: 15px; color: #666; margin-bottom: 10px; line-height: 1.6;}
    .ly_pop .ly_con p.plus_b{font-size: 18px; color: #4b96e6; margin-bottom: 15px;}
    .ly_pop .ly_con_acc{background: #f0f0f0; padding: 15px;}
    .ly_pop .ly_con_acc p{font-size: 15px; color: #999; line-height: 24px;}
    .ly_pop .ly_con_acc p span.state{color: #ef351c;}
    .ly_pop .ly_check_acc{margin-top: 15px;}
    .ly_pop .ly_check>ul{overflow-y: auto; padding: 20px 0 0;}
    .ly_pop .ly_check>ul.acc{padding:0;}
    .ly_pop .ly_check>ul>li{border: 0; height: 32px;}
    .ly_pop .ly_check>ul>li span{margin: 0px; width: 310px; font-size: 13px; color: #666;}
    .ly_pop .ly_check>ul>li span.acc_txt{margin: 0px; width: 400px; font-size: 14px; color: #666;}
    .ly_pop .ly_check>ul input{margin-right: 23px; position: relative; z-index: 1; width: 18px; height: 18px;}
    .ly_pop .ly_con .md_con{font-size: 16px; color: #777; letter-spacing: -0.9px; margin-bottom: 20px;}
    .ly_pop .ly_con_cloud{width:406px;height:30px;margin-top:10px; border-top:1px solid #aaa;}
    .ly_pop .ly_con_cloud .Plist_Lsb{float:left;font-size:14px;color:#333333; padding: 18px 0 0; width: 70%; height: 30px;}
    .ly_pop .ly_con_cloud .Plist_Lsb .rdo label{padding-left: 0;}
    .ly_pop .ly_con_cloud .Plist_Rsb{float:right;font-size:14px;color:#4b96e6; padding: 18px 16px 0px 0;}
    .ly_pop .ly_in_box{position: relative; background: #f3f3f3; padding: 15px; margin-top: 20px;}
    .ly_pop .ly_in_box input{background: #fff; color: #333333; font-size: 12px; border: 1px solid #c8c8c8; line-height: 30px; height: 30px; border-radius: 2px; margin: 0 5px; width: 135px; padding: 0 5px;}
    .ly_pop .ly_in_box_local{position: relative; background: #f3f3f3; padding: 20px; margin-top: 20px; color: #333; font-size: 14px;}
    .ly_pop .ly_in_box_local button{margin: 0 3px; line-height: 28px; font-size: 13px; color: #fff; background: #b7b7b7; width: 80px; position: absolute; right: 10px; margin-top: -6px;}
    .ly_pop .ly_in_box_local button.check{background: #4b96e6; right: 95px;}
    .ly_pop .ly_in_box_local button.check_none{background: #777; right: 95px;}
    .ly_pop .ly_in_box_local span.check_none{color: #ef351c;}
    .ly_pop .ly_in_box_local span.check{color: #4b96e6;}
    .ly_pop .ly_in_box_setup{position: relative; background: #f3f3f3; padding: 20px; margin-top: 20px; color: #777; font-size: 14px; line-height: 24px;}
    .ly_pop .ly_in_box_setup span{color: #ef351c;}
    .ly_pop .btn_box.v2{margin-top:15px;font-size:0}
    .ly_pop .btn_box.v2 button{min-width:100px;margin-left:5px}
    .ly_pop .btn_box.v2 button:first-child{margin-left:0}
    .ly_pop.type2,.ly_pop.type3{margin-left:-243px;}
    .ly_pop.type4{margin-left:-440px; margin-top: -65px;}
    .ly_pop.type2 .ly_tit,.ly_pop.type3 .ly_tit{padding:20px 0 10px}
    .ly_pop.type3 .ly_con{padding:20px 0 31px}
    .ly_pop.type3 .inp_box{width:205px;margin:24px auto 0}
    .ly_pop.type5{margin-left: -190px; padding: 40px 30px 30px;}
    .ly_pop.type5_s{margin-left: -225px; padding: 40px 30px 30px; width: 450px;}
    .ly_pop_w {width:652px; padding-bottom: 0px;}
    .ly_pop_w .ly_con_w{width:610px; border-width:1px 0 0 0; padding:9px 0 15px;}
    .ly_pop_w .ly_con_w .ly_stxt{width:100%; height: 600px; color: #333; font-size: 12px; line-height: 1.8; overflow-x:hidden; border: 0px; text-align: left; letter-spacing: 0px;}
    .ly_pop_w .ly_con_w .ly_stxt pre{font-family: Nanum Barun Gothic, sans-serif;}
    .ly_pop_w .ly_con_w .ly_stxt pre:lang(ja){font-family: “ヒラギノ角ゴ Pro W3”, “Hiragino Kaku Gothic Pro”,Osaka, “メイリオ”, Meiryo, “ＭＳ Ｐゴシック”, “MS PGothic”, sans-serif;}
    .ly_pop_w .ly_con_w .ly_stxt span{font-weight: 400;}
    .ly_pop_w .ly_con_w .ly_stxt span.ly_stit{font-size: 15px; border: 0px;}
    .ly_pop_demo {width:1066px; padding: 20px;top:100px;}
    .ly_pop_demo .ly_con_demo{width:100%; border:0; }
    .ly_pop_full{z-index: 9999999999;}
    .ly_pop_w01{width: 624px;}
    .ly_pop_w01.type2,.ly_pop_w01.type3{margin-left:-312px;}
    .ly_pop_w01 .ly_con{width: 100%;}
    .ly_pop_w01 .ly_con p.ta_L{color: #777; font-size: 16px; line-height: 30px; text-align: left; padding-left: 0px;}
    .ly_pop_w01 .ly_con p.ta_L_b{color: #4b96e6; font-size: 16px; text-align: left; margin-top: 20px;  padding-left: 0px;}
    .ly_pop .acc_map_area{background: #eee; width: 100%; height: 400px; margin-top: 5px;}
    .ly_pop .acc_map_area .acc_map_input{position: absolute; margin-left: 10px; margin-top: 10px;}
    .ly_pop .acc_map_area .acc_map_input input{border: 1px solid #b7b7b7; background: #fff; padding: 0px 10px; line-height: 26px; color: #333; width: 160px;}
    .ly_pop .acc_map_area .acc_map_input button{position: relative; margin-left: -22px; top: -8px;}
    .ly_pop .acc_map_area .acc_map_now{background: #fff; width: 30px; height: 30px; text-align: center; position: absolute; cursor: pointer; bottom: 140px; right: 50px;}
    .ly_pop .acc_map_area .acc_map_now img{position: relative; top: 3px;}

    .ly_pop .send_form{width: 100%; height: 466px; border-top: 1px solid #aaa; border-bottom: 1px solid #aaa; margin-top: 20px;}
    .ly_pop .send_form .send_form_tb{position: relative;}
    .ly_pop .send_form .send_form_tb .tb_l{width: 160px; height: 80px; border-bottom: 1px solid #e5e5e5; line-height: 80px; background: #f9f9f9; font-size: 14px; color: #333; padding-left: 30px;}
    .ly_pop .send_form .send_form_tb .tb_r{width: 537px; height: 80px; border-bottom: 1px solid #e5e5e5; line-height: 80px; padding-left: 30px; font-size: 14px; color: #aaa;}
    .ly_pop .send_form .send_form_tb .tb_last{border: 0; height: 142px; line-height: 142px;}
    .ly_pop .send_form .send_form_tb .tb_r input{height: 40px; border: 1px solid #dddddd; font-size: 14px; padding: 0 10px; vertical-align: middle;}
    .ly_pop .send_form .send_form_tb .tb_r .inp01{width: 487px;}
    .ly_pop .send_form .send_form_tb .tb_r .inp02{width: 169px;}
    .ly_pop .send_form .send_form_tb .tb_r select{height: 40px; border: 1px solid #dddddd; font-size: 14px; padding: 0 10px; vertical-align: middle; width: 110px;}
    .ly_pop .send_form .send_form_tb .tb_r textarea{height: 80px; border: 1px solid #dddddd; font-size: 14px; padding: 10px; vertical-align: middle;}

    .ly_pop .send_form .send_form_tb .tb_r input::-webkit-input-placeholder {font-size: 14px; color: #cccccc;}
    .ly_pop .send_form .send_form_tb .tb_r textarea::-webkit-input-placeholder {font-size: 14px; color: #cccccc;}

    /*일본어 로그인 */
    .wrap_login{padding: 0 20px;}
    .logo_header{padding: 70px 0 17px;background-color: #f5f5f5;border-bottom: 0;line-height: 1;zoom: 1;text-align: center;}
    .logo_header .txt{display: block;padding: 0 10px;font-size: 14px;color: #222222;line-height: 22px;max-width:330px;margin:16px auto 0px auto;}
    .logo_header .err_txt{display: block;padding: 0 10px;font-size: 14px;color: #ef351c;line-height: 36px;}
    .logo_header .id_txt{display: block; margin-top: 20px; padding: 15px 0; font-size: 16px; color: #4b96e6; line-height: 18px; background: #eee; max-width: 410px; margin: 0 auto; margin-top: 20px;}
    .logo_header .txt_end{display: block; margin-top: 50px; padding: 0 10px; font-size: 16px; color: #333; line-height: 18px;}
    .logo_header .txt_end span{color: #4b96e6;}
    .container_login{overflow: visible; min-height: 335px; background-color: #f5f5f5;}
    .container_login .login_cnt{margin: 0 auto;max-width: 330px;position: relative;/* padding-top: 30px; */}
    .container_login .login_cnt .chk_area{margin-top: 13px;position: relative;min-height: 20px;margin-bottom: 25px;/* padding-left: 4px; */zoom: 1;}
    .container_login .login_cnt .chk_area .cbx_prove2{position: absolute;top: 0;/* right: 0; */z-index: 200;padding-left: 20px;text-align: left;width: 50px;margin-top: 0;}
    .container_login .login_cnt .login_area{position: relative; z-index: 100; margin-top: 16px;}
    .container_login .login_cnt .login_area .input_txt_area{position: relative;display: block;height: 18px;margin-bottom: 8px;padding: 11px 14px 9px;background-color: #fff;border: 1px solid #e0e0e0;z-index: 10;max-width: 100%;padding-right: 35px;}
    .container_login .login_cnt .login_area .input_txt_area:focus-within{border: solid 1px #858585;}
    .container_login .login_cnt .login_area .input_txt_area input{overflow: hidden; width: 100%; height: 18px; font-size: 15px; line-height: 18px; vertical-align: middle; background-color: #fff; color: #333;}
    .container_login .login_cnt .login_area .input_txt_area .btn_del{overflow: hidden; display: inline-block; position: absolute; top: 0; right: 0px; width: 35px; height: 38px; line-height: 38px; text-align: center; cursor: pointer; vertical-align: top; background-color: #fff; z-index: 101;}
    .container_login .login_cnt .login_area .input_txt_area .btn_del img{position: relative; top: 14px;}
    .container_login .btn_v1{width: 100%; background-color: #4a96e6; color: #fff; display: block; height: 46px; line-height: 46px; text-align: center; font-size: 15px; font-weight: normal; cursor: pointer; margin-top: 12px;}
    .container_login .btn_v2{width: 100%; display: block; background-color: #777777; color: #fff; height: 46px; line-height: 46px; text-align: center; font-size: 15px; font-weight: normal; cursor: pointer; margin-top: 12px;}
    .container_login .login_cnt .login_area .fnd_area{margin: 23px 0 18px; text-align: center; font-size: 13px; vertical-align: top;}
    .container_login .login_cnt .login_area .fnd_area a{color: #777;text-decoration: underline;}
    .section{max-width: 410px; margin: 0 auto;}
    .argee_area{overflow: hidden; border-top: 1px solid #ddd; padding-top: 15px;}
    .argee_area .inner_wrap {margin: 35px 0 5px;}
    .argee_area .inner_wrap.v2 {padding: 19px; background-color: #ebebeb; border: 1px solid #e0e0e0; overflow: hidden; height: 50px;}
    .argee_area .inner_wrap .agree_lst li {position: relative;}
    .argee_area .inner_wrap .agree_lst li.bt{top: 32px;}
    .argee_area .more {position: absolute; top: 1px; right: 0; font-size: 13px; line-height: 15px; text-decoration: underline; color: #999;}

    .ly_pop_center{position: absolute; margin: -200px 0 0 -243px; top: 50%; left: 50%;}
    .ly_pop_center02{position: fixed; margin: -200px 0 0 -243px; top: 50%; left: 50%;}
    .ly_pop_center03{position: fixed; margin: -300px 0 0 -243px; top: 50%; left: 50%;}

    /* loading */
    .loading_area{position: absolute; left: 50%; top:50%; z-index: 135; margin-left: -100px; margin-top: -100px;}
    .uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4166666666666667s;animation-delay: -0.4166666666666667s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.33333333333333337s;animation-delay: -0.33333333333333337s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.25s;animation-delay: -0.25s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.16666666666666669s;animation-delay: -0.16666666666666669s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.08333333333333331s;animation-delay: -0.08333333333333331s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0s;animation-delay: 0s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.08333333333333337s;animation-delay: 0.08333333333333337s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.16666666666666663s;animation-delay: 0.16666666666666663s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.25s;animation-delay: 0.25s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(11){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.33333333333333337s;animation-delay: 0.33333333333333337s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
    .uil-default-css > div:nth-of-type(12){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: 0.41666666666666663s;animation-delay: 0.41666666666666663s;}
    .uil-default-css { position: relative;background:none;width:200px;height:200px;}
</style>