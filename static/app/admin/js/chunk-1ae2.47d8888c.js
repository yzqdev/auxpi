(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1ae2"],{Kos7:function(t,e,a){"use strict";a.d(e,"b",function(){return s}),a.d(e,"d",function(){return l}),a.d(e,"e",function(){return o}),a.d(e,"c",function(){return n}),a.d(e,"g",function(){return r}),a.d(e,"h",function(){return c}),a.d(e,"a",function(){return p}),a.d(e,"f",function(){return u});var i=a("t3Un");function s(){return Object(i.a)({url:"/admin/get_rsa_key",method:"get"})}function l(t){return Object(i.a)({url:"/admin/update_site_config",method:"post",data:t})}function o(t){return Object(i.a)({url:"/admin/update_menu",method:"post",data:t})}function n(t){return Object(i.a)({url:"/options/stores",method:"get",params:t})}function r(t,e){return console.log(t),Object(i.a)({url:"/admin/update_stores_options/"+e,method:"post",data:t})}function c(t){return Object(i.a)({url:"/admin/update_store/",method:"post",data:t})}function p(t){return Object(i.a)({url:"/options/info",method:"get",params:t})}function u(t,e){return Object(i.a)({url:"/options/update?key="+e.key+"&group="+e.group,method:"post",data:t})}},"TF+7":function(t,e,a){},aFx9:function(t,e,a){"use strict";a.d(e,"c",function(){return s}),a.d(e,"a",function(){return l}),a.d(e,"d",function(){return o}),a.d(e,"f",function(){return n}),a.d(e,"e",function(){return r}),a.d(e,"b",function(){return c});var i=a("t3Un");function s(t){return Object(i.a)({url:"/admin/get_images_list",method:"get",params:t})}function l(t){return Object(i.a)({url:"/admin/del_images",method:"post",data:{id:t}})}function o(){return Object(i.a)({url:"/admin/get_store_list",method:"get"})}function n(t){return Object(i.a)({url:"/admin/sync_images",method:"post",data:{list:t}})}function r(t){return Object(i.a)({url:"/admin/get_sync_images",method:"get",params:t})}function c(t){return Object(i.a)({url:"/admin/del_sync_images",method:"post",data:{id:t}})}},uqMi:function(t,e,a){"use strict";a.r(e);var i=a("4d7F"),s=a.n(i),l=a("Kos7"),o=a("aFx9"),n={name:"SiteConfig",data:function(){return{show:!1,tableData:[],storeList:[],selectValue:"",mailPortList:[{info:"465 (ssl)",value:"465"},{info:"587 (tls)",value:"587"},{info:"22 (无加密)",value:"22"}],rootList:[{info:"本地图床",value:"local"},{info:"Gitee 仓库",value:"gitee"},{info:"Github 仓库",value:"github"}],privateKey:"",publicKey:"",loading:!0,site:null,api_config:null,ip_limit:null,dispatch:null}},watch:{siteBase:function(){console.log("hello")},config:function(){console.log("change")}},created:function(){this.loadConfig()},methods:{loadConfig:function(){var t=this,e=Object(l.a)({key:"site_base",group:"conf"}).then(function(e){t.site=JSON.parse(e.data)}),a=Object(l.a)({key:"api_option",group:"conf"}).then(function(e){t.api_config=JSON.parse(e.data)}),i=Object(l.a)({key:"ip_limit",group:"conf"}).then(function(e){t.ip_limit=JSON.parse(e.data)}),n=Object(o.d)().then(function(e){t.storeList=e.list}),r=Object(l.a)({key:"dispatch",group:"conf"}).then(function(e){t.dispatch=JSON.parse(e.data)});s.a.all([e,a,i,n,r]).then(function(){console.log("allDone----\x3e"),console.log(t.ip_limit),t.show=!0,t.loading=!1}),Object(l.b)().then(function(e){t.privateKey=e.data.private_key,t.publicKey=e.data.public_key})},reset:function(t,e){var a=this;Object(l.f)(t,{key:e,group:"conf"}).then(function(t){a.$message({message:"修改成功",type:"success"})})}}},r=(a("w6jk"),a("KHd+")),c=Object(r.a)(n,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dashboard-editor-container"},[a("el-row",[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",{staticStyle:{"font-size":"25px"}},[a("svg-icon",{attrs:{"icon-class":"config"}}),t._v("  站点设置")],1)]),t._v(" "),t.loading?a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("br"),t._v(" "),a("br"),t._v(" "),a("br"),t._v(" "),a("br")]):t._e(),t._v(" "),a("transition",{attrs:{name:"el-fade-in-linear"}},[t.show?a("el-row",{attrs:{gutter:8}},[a("el-col",{staticClass:"box",attrs:{xs:24,sm:24,md:12,lg:12,xl:12}},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("基本信息")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",plain:"",round:"",icon:"el-icon-success"},on:{click:function(e){t.reset(t.site,"site_base")}}},[t._v("保存")])],1),t._v(" "),a("div",{staticClass:"box"},[a("el-row",[a("el-input",{attrs:{placeholder:"请输入您的站点名称"},model:{value:t.site.site_name,callback:function(e){t.$set(t.site,"site_name",e)},expression:"site.site_name"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("此项会显示在您的首页和其他地方")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("站点名称")])],1)],1)],2)],1),t._v(" "),a("el-row",[a("el-input",{attrs:{placeholder:"请输入你的站点域名，需要带有 http或 https"},model:{value:t.site.site_url,callback:function(e){t.$set(t.site,"site_url",e)},expression:"site.site_url"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v('最后必须要有 "/",例如'),a("br"),t._v("http://abc.com/"),a("br"),t._v("此项决定了您的本地图床的链接")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("站点链接")])],1)],1)],2)],1),t._v(" "),a("el-row",[a("el-input",{attrs:{placeholder:""},model:{value:t.site.site_footer,callback:function(e){t.$set(t.site,"site_footer",e)},expression:"site.site_footer"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("此项将在您网站的页面底部显示")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("页脚文字")])],1)],1)],2)],1),t._v(" "),a("el-row",[a("el-input",{attrs:{placeholder:""},model:{value:t.site.logo,callback:function(e){t.$set(t.site,"logo",e)},expression:"site.logo"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("此项将于登录等地方显示")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("Logo链接")])],1)],1)],2)],1),t._v(" "),a("el-row",[t._v("\n                  一次性最大上传 :\n                  "),a("el-input-number",{staticStyle:{"margin-left":"25px"},model:{value:t.site.site_upload_max_number,callback:function(e){t.$set(t.site,"site_upload_max_number",e)},expression:"site.site_upload_max_number"}}),t._v("\n                  张\n                ")],1),t._v(" "),a("el-row",[t._v("\n                  允许的最大图片体积 :\n                  "),a("el-input-number",{staticStyle:{"margin-left":"25px"},model:{value:t.site.site_upload_max_size,callback:function(e){t.$set(t.site,"site_upload_max_size",e)},expression:"site.site_upload_max_size"}}),t._v("\n                  MB\n                ")],1),t._v(" "),a("el-row",[t._v("\n                  是否开启注册 :\n                  "),a("el-switch",{staticStyle:{"margin-left":"25px"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.site.allow_register,callback:function(e){t.$set(t.site,"allow_register",e)},expression:"site.allow_register"}})],1),t._v(" "),a("el-row",[t._v("\n                  是否允许游客上传 :\n                  "),a("el-switch",{staticStyle:{"margin-left":"25px"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.site.allow_tourists,callback:function(e){t.$set(t.site,"allow_tourists",e)},expression:"site.allow_tourists"}})],1)],1)]),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",{staticStyle:{"font-size":"25px"}},[t._v("分发配置")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",plain:"",round:"",icon:"el-icon-success"},on:{click:function(e){t.reset(t.dispatch,"dispatch")}}},[t._v("保存")])],1),t._v(" "),a("div",[a("el-row",[t._v("\n                  根节点图床 :\n                  "),a("el-select",{staticStyle:{"margin-left":"25px"},attrs:{placeholder:"请选择"},model:{value:t.dispatch.root,callback:function(e){t.$set(t.dispatch,"root",e)},expression:"dispatch.root"}},t._l(t.rootList,function(t){return a("el-option",{key:t.value,attrs:{label:t.info,value:t.value}})}))],1)],1)]),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",{staticStyle:{"font-size":"25px"}},[t._v("邮件配置")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",plain:"",round:"",icon:"el-icon-success"},on:{click:function(e){t.reset(t.site,"site_base")}}},[t._v("保存")])],1),t._v(" "),a("div",[a("el-row",[t._v("\n                  是否开启 SMTP 发邮件:\n                  "),a("el-switch",{staticStyle:{"margin-left":"25px"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.site.mail_config.status,callback:function(e){t.$set(t.site.mail_config,"status",e)},expression:"site.mail_config.status"}})],1),t._v(" "),a("transition",{attrs:{name:"el-zoom-in-center"}},[a("el-card",{directives:[{name:"show",rawName:"v-show",value:t.site.mail_config.status,expression:"site.mail_config.status"}],staticClass:"box-card"},[a("el-row",[a("el-input",{attrs:{placeholder:"邮件服务器地址"},model:{value:t.site.mail_config.host,callback:function(e){t.$set(t.site.mail_config,"host",e)},expression:"site.mail_config.host"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("例如 stmp.qq.com")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("服务器地址")])],1)],1)],2)],1),t._v(" "),a("el-row",[a("el-input",{attrs:{placeholder:"发件昵称"},model:{value:t.site.mail_config.from,callback:function(e){t.$set(t.site.mail_config,"from",e)},expression:"site.mail_config.from"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("即 来自 xxxx 的邮件")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("发件昵称")])],1)],1)],2)],1),t._v(" "),a("el-row",[a("el-input",{attrs:{placeholder:"用户名"},model:{value:t.site.mail_config.user,callback:function(e){t.$set(t.site.mail_config,"user",e)},expression:"site.mail_config.user"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("您 SMTP 服务的用户名")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("用户名")])],1)],1)],2)],1),t._v(" "),a("el-row",[a("el-input",{attrs:{placeholder:"密码"},model:{value:t.site.mail_config.pass,callback:function(e){t.$set(t.site.mail_config,"pass",e)},expression:"site.mail_config.pass"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("您 SMTP 服务的密码")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("密码")])],1)],1)],2)],1),t._v(" "),a("el-row",[t._v("\n                      发送端口 :\n                      "),a("el-select",{staticStyle:{"margin-left":"25px"},attrs:{placeholder:"请选择"},model:{value:t.site.mail_config.port,callback:function(e){t.$set(t.site.mail_config,"port",e)},expression:"site.mail_config.port"}},t._l(t.mailPortList,function(t){return a("el-option",{key:t.value,attrs:{label:t.info,value:t.value}})}))],1)],1)],1)],1)])],1),t._v(" "),a("el-col",{staticClass:"box",attrs:{xs:24,sm:24,md:12,lg:12,xl:12}},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("图床配置")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",plain:"",round:"",icon:"el-icon-success"},on:{click:function(e){t.reset(t.api_config,"api_option")}}},[t._v("保存")])],1),t._v(" "),a("el-row",[t._v("\n                是否启用 API 上传:\n                "),a("el-switch",{staticStyle:{"margin-left":"25px"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.api_config.status,callback:function(e){t.$set(t.api_config,"status",e)},expression:"api_config.status"}})],1),t._v(" "),a("transition",{attrs:{name:"el-zoom-in-center"}},[a("el-card",{directives:[{name:"show",rawName:"v-show",value:t.api_config.status,expression:"api_config.status"}],staticClass:"box-card"},[a("el-row",[t._v("\n                    默认图床API :\n                    "),a("el-select",{staticStyle:{"margin-left":"25px"},attrs:{placeholder:"请选择"},model:{value:t.api_config.api_default,callback:function(e){t.$set(t.api_config,"api_default",e)},expression:"api_config.api_default"}},t._l(t.storeList,function(t){return a("el-option",{key:t.id,attrs:{label:t.api,value:t.api}})}))],1),t._v(" "),a("el-row",[t._v("\n                    是否开启 API 认证(推荐开启) :\n                    "),a("el-switch",{staticStyle:{"margin-left":"25px"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.api_config.auth,callback:function(e){t.$set(t.api_config,"auth",e)},expression:"api_config.auth"}})],1)],1)],1)],1),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("上传限制")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",plain:"",round:"",icon:"el-icon-success"},on:{click:function(e){t.reset(t.ip_limit,"ip_limit")}}},[t._v("保存")])],1),t._v(" "),a("div",{staticClass:"box"},[a("el-row",[t._v("\n                  是否限制上传:\n                  "),a("el-switch",{staticStyle:{"margin-left":"25px"},attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.ip_limit.status,callback:function(e){t.$set(t.ip_limit,"status",e)},expression:"ip_limit.status"}})],1),t._v(" "),a("transition",{attrs:{name:"el-zoom-in-center"}},[a("el-card",{directives:[{name:"show",rawName:"v-show",value:t.ip_limit.status,expression:"ip_limit.status"}],staticClass:"box-card"},[a("el-row",[a("el-row",[t._v("\n                        在\n                        "),a("el-input-number",{staticStyle:{margin:"0px 5px 0px 5px"},model:{value:t.ip_limit.allow_time,callback:function(e){t.$set(t.ip_limit,"allow_time",e)},expression:"ip_limit.allow_time"}}),t._v("\n                        秒内允许上传\n                        "),a("el-input-number",{staticStyle:{margin:"0px 5px 0px 5px"},model:{value:t.ip_limit.allow_num,callback:function(e){t.$set(t.ip_limit,"allow_num",e)},expression:"ip_limit.allow_num"}}),t._v("\n                        张\n                      ")],1)],1),t._v(" "),a("el-row",[t._v("\n                      如果用户上传超额，则封 IP\n                      "),a("el-input-number",{staticStyle:{margin:"0px 5px 0px 5px"},model:{value:t.ip_limit.block_time,callback:function(e){t.$set(t.ip_limit,"block_time",e)},expression:"ip_limit.block_time"}}),t._v("\n                      秒\n                    ")],1),t._v(" "),a("el-row",[t._v("\n                      如果用户被封\n                      "),a("el-input-number",{staticStyle:{margin:"0px 5px 0px 5px"},model:{value:t.ip_limit.dead_line,callback:function(e){t.$set(t.ip_limit,"dead_line",e)},expression:"ip_limit.dead_line"}}),t._v("\n                      次以后, ip 会被加入黑名单，永远不允许上传\n                    ")],1)],1)],1)],1)]),t._v(" "),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("JWT 设置")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success",plain:"",round:"",icon:"el-icon-success"},on:{click:function(e){t.reset(t.site,"site_base")}}},[t._v("保存")])],1),t._v(" "),a("div",{staticClass:"box"},[a("el-row",[a("el-input",{attrs:{placeholder:"jwt_secret"},model:{value:t.site.jwt_secret,callback:function(e){t.$set(t.site,"jwt_secret",e)},expression:"site.jwt_secret"}},[a("template",{slot:"prepend"},[a("el-tooltip",{attrs:{placement:"top"}},[a("div",{attrs:{slot:"content"},slot:"content"},[t._v("请随意输入字符串用于认证加密")]),t._v(" "),a("el-button",{attrs:{type:"primary"}},[t._v("jwt_secret")])],1)],1)],2)],1),t._v(" "),a("el-row",[t._v("\n                  jwt签发时长 :\n                  "),a("el-input-number",{staticStyle:{"margin-left":"25px"},model:{value:t.site.jwt_due_time,callback:function(e){t.$set(t.site,"jwt_due_time",e)},expression:"site.jwt_due_time"}}),t._v(" 小时\n                ")],1)],1)])],1),t._v(" "),a("el-col",{staticClass:"box",attrs:{xs:24,sm:24,md:24,lg:24,xl:24}},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",{staticStyle:{"font-size":"25px"}},[t._v("RSA证书")])]),t._v(" "),a("div",[a("el-row",[a("el-col",{staticStyle:{margin:"10px"},attrs:{xs:24,sm:24,md:11,lg:11,xl:11}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("公钥")])]),t._v(" "),a("el-input",{attrs:{autosize:{minRows:10,maxRows:20},disabled:!0,type:"textarea"},model:{value:t.publicKey,callback:function(e){t.publicKey=e},expression:"publicKey"}})],1)],1),t._v(" "),a("el-col",{staticStyle:{margin:"10px"},attrs:{xs:24,sm:24,md:11,lg:11,xl:11}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("私钥")])]),t._v(" "),a("el-input",{attrs:{autosize:{minRows:10,maxRows:20},disabled:!0,type:"textarea"},model:{value:t.privateKey,callback:function(e){t.privateKey=e},expression:"privateKey"}})],1)],1)],1)],1)])],1),t._v(" "),a("el-col",{staticClass:"box",attrs:{xs:24,sm:24,md:24,lg:24,xl:24}},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",{staticStyle:{"font-size":"25px"}},[t._v("AUXPI 程序信息")]),t._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"primary",plain:"",round:"",icon:"el-icon-time"}},[t._v("检查更新")])],1),t._v(" "),a("div",[a("el-row",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:""}},[a("el-table-column",{attrs:{prop:"author",label:"作者",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"version",label:"版本",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"branch",label:"branch"}}),t._v(" "),a("el-table-column",{attrs:{prop:"repositories",label:"项目地址"}})],1)],1)],1)])],1)],1):t._e()],1)],1)],1)],1)},[],!1,null,"b6a7212a",null);c.options.__file="index.vue";e.default=c.exports},w6jk:function(t,e,a){"use strict";var i=a("TF+7");a.n(i).a}}]);