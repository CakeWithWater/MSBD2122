<template>
  <div id="app">
    <div id="header">
      <span style="color: orange; ">Album</span>
      <div style="position:absolute; right: 0px; margin-right: 10px;">
        <el-button v-if="showLogout" @click="logout" class="right" type="warning">Logout</el-button>
        <el-button v-if="showLogout" @click="update" class="right" type="warning">Refresh</el-button>
      </div>

    </div>
    <!-- <router-view/> -->
    <div class="loginFrom" v-if="!showLogout">
      <el-row>
        <el-col :span="8" :offset="8"><div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Welcome!</span>
            </div>
            
            <el-form label-position="top"  label-width="80px" :model="loginForm">
              <el-form-item>
                <el-input v-model="loginForm.name" placeholder="Username"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')">Login</el-button>
              </el-form-item>
            </el-form>
            

          </el-card>

        </div></el-col>
      </el-row>
    </div>

    <div class="photo" v-if="showLogout">
      <div class="upload" >
        <el-upload
        class="upload-demo"
        action="/api/up"
        name="photo"
        :data="{'name': getName}"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        list-type="picture">
        <el-button size="small" type="warning">Upload</el-button>
        <div slot="tip" class="el-upload__tip">It takes about 30 seconds to process the photo. Please refresh to check the update.</div>
        </el-upload>
      </div>
      
      <div class="display" >
        
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in photoList">
            <el-card >
              <div slot="header" class="clearfix">
                <el-image :src="item.url" fit="contain" class="image"></el-image>
              </div>
              <div>
                <span class="time">Uploaded: {{item.creation_time}}</span>
                <div class="info">
                  <span class="label">Detected labels: </span>
                  </div>
                <div>
                  <el-tag
                    v-for="tag in item.labels"
                    style="margin: 5px 5px 5px 0px;"
                    type="warning"
                    effect="plain"
                    size="mini">
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="info">
                  <span class="label">Image size: </span>{{item.file_size}}
                </div>
              </div>
            </el-card>
          </el-col>

        </el-row>
      </div>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      showLogout: false,
      loginForm: {
        name: ""
      },
      fileList: [],
      photoList: [],
      user: ""
    };
  },
  computed:{
    getName() {
      console.log(localStorage.getItem('user'));
      this.user = localStorage.getItem('user');
      return this.user;
    },
    isLogin(){
      return localStorage.getItem('user') != undefined;
    }
  },
  methods: {
    logout(){
      localStorage.setItem('user', undefined);
      this.showLogout = false;
      this.loginForm.name = "";
    },
    submitForm(){
      localStorage.setItem("user", this.loginForm.name)
      this.showLogout = true;
      this.update();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    update(){
      var user = localStorage.getItem('user');
      axios.get('/api/all/' + user, {
        params: {
          t: Date.parse(new Date())/1000
        },
      })
      .then(res => {
        // handle success
        // console.log(res);
        this.photoList = res.data;
        // console.log(this.photoList);
        this.photoList.forEach((item) => {
            item.url = "/api/pic/" + item.img_id;
            item.label_
        }); 
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    },
    uploadFile(params){
      console.log("uploadFile", params);
      const _file = params.file;

      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("file", _file);
      
      axios.post({
        url:'',
        data: formData
      })
      .then(res => {
        console.log(res);
        this.update();
      })
      .catch(err => {
        console.log(error);
      })
    }
  },
  mounted() {
    
    this.showLogout = (localStorage.getItem('user') != undefined);
    console.log(this.showLogout);
    this.update();
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

.right{
  /* align-items: center;
  justify-content: right; */
  float: right;
  padding: 10px;
  margin-right: 10px !important;
}

.loginFrom{
  margin-top: 10%;
}

.photo {
  margin-top: 20px;
}

.upload{
  padding: 20px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.display{
  margin-top: 20px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.image{
  /* width: 100%; */
  height: 200px;
  /* display: block; */
}

.time {
  font-size: 13px;
  color: #999;
}

.label{
  
  font-weight: bold;
}

.info{
  font-size: 13px;
}

#header{
  background-color: #545c64;
  color: #fff;
  height: 40px;
  display: flex;
  padding: 10px;
  line-height: 40px;
}
</style>
