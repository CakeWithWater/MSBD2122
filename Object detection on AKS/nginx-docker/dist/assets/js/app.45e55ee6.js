(function(t){function e(e){for(var a,r,s=e[0],l=e[1],c=e[2],p=0,d=[];p<s.length;p++)r=s[p],Object.prototype.hasOwnProperty.call(n,r)&&n[r]&&d.push(n[r][0]),n[r]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);u&&u(e);while(d.length)d.shift()();return i.push.apply(i,c||[]),o()}function o(){for(var t,e=0;e<i.length;e++){for(var o=i[e],a=!0,s=1;s<o.length;s++){var l=o[s];0!==n[l]&&(a=!1)}a&&(i.splice(e--,1),t=r(r.s=o[0]))}return t}var a={},n={app:0},i=[];function r(e){if(a[e])return a[e].exports;var o=a[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=a,r.d=function(t,e,o){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(o,a,function(e){return t[e]}.bind(null,a));return o},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var c=0;c<s.length;c++)e(s[c]);var u=l;i.push([0,"chunk-vendors"]),o()})({0:function(t,e,o){t.exports=o("56d7")},"034f":function(t,e,o){"use strict";o("85ec")},"56d7":function(t,e,o){"use strict";o.r(e);o("e260"),o("e6cf"),o("cca6"),o("a79d");var a=o("8bbf"),n=o.n(a),i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{attrs:{id:"app"}},[o("div",{attrs:{id:"header"}},[o("span",{staticStyle:{color:"orange"}},[t._v("Album")]),o("div",{staticStyle:{position:"absolute",right:"0px","margin-right":"10px"}},[t.showLogout?o("el-button",{staticClass:"right",attrs:{type:"warning"},on:{click:t.logout}},[t._v("Logout")]):t._e(),t.showLogout?o("el-button",{staticClass:"right",attrs:{type:"warning"},on:{click:t.update}},[t._v("Refresh")]):t._e()],1)]),t.showLogout?t._e():o("div",{staticClass:"loginFrom"},[o("el-row",[o("el-col",{attrs:{span:8,offset:8}},[o("div",{staticClass:"grid-content bg-purple-light"},[o("el-card",{staticClass:"box-card"},[o("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[o("span",[t._v("Welcome!")])]),o("el-form",{attrs:{"label-position":"top","label-width":"80px",model:t.loginForm}},[o("el-form-item",[o("el-input",{attrs:{placeholder:"Username"},model:{value:t.loginForm.name,callback:function(e){t.$set(t.loginForm,"name",e)},expression:"loginForm.name"}})],1),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.submitForm("loginForm")}}},[t._v("Login")])],1)],1)],1)],1)])],1)],1),t.showLogout?o("div",{staticClass:"photo"},[o("div",{staticClass:"upload"},[o("el-upload",{staticClass:"upload-demo",attrs:{action:"/api/up",name:"photo",data:{name:t.getName},"on-preview":t.handlePreview,"on-remove":t.handleRemove,"file-list":t.fileList,"list-type":"picture"}},[o("el-button",{attrs:{size:"small",type:"warning"}},[t._v("Upload")]),o("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[t._v("It takes about 30 seconds to process the photo. Please refresh to check the update.")])],1)],1),o("div",{staticClass:"display"},[o("el-row",{attrs:{gutter:20}},t._l(t.photoList,(function(e){return o("el-col",{attrs:{span:6}},[o("el-card",[o("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[o("el-image",{staticClass:"image",attrs:{src:e.url,fit:"contain"}})],1),o("div",[o("span",{staticClass:"time"},[t._v("Uploaded: "+t._s(e.creation_time))]),o("div",{staticClass:"info"},[o("span",{staticClass:"label"},[t._v("Detected labels: ")])]),o("div",t._l(e.labels,(function(e){return o("el-tag",{staticStyle:{margin:"5px 5px 5px 0px"},attrs:{type:"warning",effect:"plain",size:"mini"}},[t._v(" "+t._s(e)+" ")])})),1),o("div",{staticClass:"info"},[o("span",{staticClass:"label"},[t._v("Image size: ")]),t._v(t._s(e.file_size)+" ")])])])],1)})),1)],1)]):t._e()])},r=[],s=(o("b0c0"),o("d3b7"),o("159b"),o("bc3a")),l=o.n(s),c={name:"App",data:function(){return{showLogout:!1,loginForm:{name:""},fileList:[],photoList:[],user:""}},computed:{getName:function(){return console.log(localStorage.getItem("user")),this.user=localStorage.getItem("user"),this.user},isLogin:function(){return void 0!=localStorage.getItem("user")}},methods:{logout:function(){localStorage.setItem("user",void 0),this.showLogout=!1,this.loginForm.name=""},submitForm:function(){localStorage.setItem("user",this.loginForm.name),this.showLogout=!0,this.update()},handleRemove:function(t,e){console.log(t,e)},handlePreview:function(t){console.log(t)},update:function(){var t=this,e=localStorage.getItem("user");l.a.get("/api/all/"+e,{params:{t:Date.parse(new Date)/1e3}}).then((function(e){t.photoList=e.data,t.photoList.forEach((function(t){t.url="/api/pic/"+t.img_id,t.label_}))})).catch((function(t){console.log(t)}))},uploadFile:function(t){var e=this;console.log("uploadFile",t);var o=t.file,a=new FormData;a.append("file",o),l.a.post({url:"",data:a}).then((function(t){console.log(t),e.update()})).catch((function(t){console.log(error)}))}},mounted:function(){this.showLogout=void 0!=localStorage.getItem("user"),console.log(this.showLogout),this.update()}},u=c,p=(o("034f"),o("2877")),d=Object(p["a"])(u,i,r,!1,null,null,null),f=d.exports;n.a.config.productionTip=!1,new n.a({render:function(t){return t(f)}}).$mount("#app")},"85ec":function(t,e,o){},"8bbf":function(t,e){t.exports=Vue}});
//# sourceMappingURL=app.45e55ee6.js.map