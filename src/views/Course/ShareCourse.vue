<template>
  <v-container fluid>
    <v-overlay :z-index="zIndex" :value="overlay" >
      <v-card class="errorCard" light elevation="2">
        <v-card-text>비공개 코스입니다.</v-card-text>
        <v-btn block class="info mt-8 mr-3 px-10" @click="goToMain()">돌아가기</v-btn>
      </v-card>
    </v-overlay>
    <div class="mainCourse" v-if="getCourse"> <MainCourse v-if="courseEditable"/> </div>
    <v-row class="lehgo-background">
      <div class="sideBarArea"><SideBar/></div>
      <v-row class="content">
      <div class="mainArea">
        <div class="profileCard">
            <h3>
            <a class="blueText">{{userId}}</a> 님이<br>
            공유한 <a class="blueText">{{courseName}}</a> 코스</h3>   
            <v-divider class="vDivider"></v-divider>
        </div>
        <div class="placeInfoArea" v-if="getPlace">
        <PlaceInfo/>
          <div class="buttonArea" type="button" @click="goToPlace(getPlace.placeId)">
            <div class="morePlaceInfo">더보기</div>
            <svg class="morePlaceInfoSvg" width="43" height="25.705" viewBox="0 0 43 25.705">
              <path d="M11.148,0,8.811,2.337l8.846,8.846H-19v3.338H17.657L8.811,23.368,11.148,25.7,24,12.852Z" transform="translate(19)" :class="getFirstCategory + '-fill'"/>
            </svg>
        </div>
        <v-row class="contentArea mt-5">
          <v-col cols="6">
          <div class="imageArea" v-bar>
          <div>
              <div class="placeImage" v-for="img in getImgList" :key="img" :style="bgImg(img)"/>
              <div class="placeImage" v-for="img in getNaverImg" :key="img" :style="bgImg(img.thumbnail)"/>
          </div>
          </div></v-col>
          <v-col cols="6" class="postArea">
            <div class="postListArea" v-bar>
              <div>
                  <!-- <v-progress-circular v-if="!getLoaded" :size="50" :width="7" indeterminate color="#2699fb"></v-progress-circular> -->
                  <div v-for="p, i in getPostList.items" :key="i" :class="getFirstCategory + '-border-1 postArea'"> 
                      <h3>{{getText(p.title)}}</h3>
                      <div class="text-right">{{getText(p.postdate).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}}</div>
                      <a :href="p.link"><div class="text-right">{{getText(p.bloggername)}}</div></a>
                      <v-divider></v-divider>
                      <div>{{getText(p.description)}}</div>
                  </div>
                  <div class="my-5"></div>
              </div>
            </div>
          </v-col>
        </v-row>
        </div>
      </div>
      <div class="sideArea">
        <CoursePlaceList @clickedPlace="clickedPlace" :courseEditable="courseEditable"/>
      </div>
      </v-row>
      <div id="mapArea">
        <Map :key="mapKey"/>
      </div>
    </v-row>
  </v-container>
</template>

<script>
  import SideBar from '../../components/SideBar'
  import MainCourse from '../../components/place/MainCourse'
  import Map from '../../components/map/Map'
  import CoursePlaceList from '../../components/placeList/CoursePlaceList'
  import PlaceInfo from '../../components/place/PlaceInfo'
  import { createNamespacedHelpers } from "vuex";
  const { mapActions : courseMapActions } = createNamespacedHelpers("courseStore");
  const { mapActions : placeMapActions, mapGetters : placeMapGetters } = createNamespacedHelpers("placeStore");
  const { mapGetters : listMapGetters, mapActions : listMapActions } = createNamespacedHelpers("placeListStore");

  export default {
    name: 'MyPage',

    data:() =>({
      isCoursePlaceList : false,
      sheet : false,
      newPlace : null,
      mapCol : 5.4,
      mapKey : 0,
      userId : null,
      courseName : '',
      overlay : false,
      courseEditable : false,
    }),
    components: {
      SideBar, MainCourse,
      CoursePlaceList,
      Map, PlaceInfo
    },
    methods:{
      clickedPlace(place){
        this.setPlace(place)
      },
      setCourseInfo(){
        if (this.getLoaded){
          this.courseEditable = this.getCourse.editable == 0 ? true : false
          this.userId = this.getCourse.userId
          this.courseName = this.getCourse.courseName
          this.visibility = this.getCourse.visibility == 0 ? true : false
          this.editable = this.getCourse.editable == 0 ? true : false
        }
      },
      bgImg(src) {
          return 'background-image : url("' + src + '");'
      },
      getText(text){
        return text.replace(/<b>/g, '').replace(/<\/b>/g, '')
      },
      goToMain(){
        this.$router.push({
            name: 'Login'
        })
      },
      goToPlace(placeId){
        this.$router.push({
            name: 'Place', query: {pId: placeId}
        })
      },
      ...placeMapActions(['setPlace']),
      ...courseMapActions(['setCoursePage', 'setMainCourseById']),
      ...listMapActions(['setPlaceList', 'setListByLiked', 'setListByVisited', 'setListByFolder', 'setListByCourse'])
    },
    computed: {
      ...placeMapGetters(['getPlace', 'getPostList', 'getCategory', 'getImgList', 'getNaverImg', 'getFirstCategory']),
      ...listMapGetters(['getLoaded', 'getPlaceList', 'getCoursePlaceList', 'getCourse'])
    },
    created() {
      this.setCourseInfo()
      this.setPlaceList(null);
      this.setListByCourse(this.$route.query.cId)
      this.setMainCourseById(this.$route.query.cId)
    },
    watch:{
      getPlaceList: function(){
        this.mapKey += 1
      },
      getCourse: function(){
        this.setCourseInfo()
      },
    }
  }
</script>

<style scoped>
.col{
  padding: 0;
  height: 100vh;
}
#listArea{
  height:70vh;
  overflow: auto;
}
#mapArea{
  height: 100vh;
  overflow: hidden;
}
.sideBarArea{
  width: 5vw;
}
.mainArea{
  width: 24vw;
  height: 95vh;
  overflow: hidden;
  overflow: hidden;
  background-color:white;
  border-radius: 20px;
  margin: 30px 30px 30px 40px;
  padding: 0px 20px;
}
.sideArea{
  width: 25vw;
  height: 95vh;
  overflow: hidden;
  overflow: hidden;
  background-color:white;
  border-radius: 20px;
  margin: 30px 25px 30px 0px;
}
.placeInfoArea{
  padding:0px 10px;
}
.content{
  width: 55vw;
}
.imageArea{
  height: 55%;
}
.postListArea{
  height: 55%;
  overflow: auto;
  overflow-y: scroll;
}
.postArea{
  margin-bottom: 10px;
  padding: 0px 10px 10px 10px;
  border-radius: 5px;
  font-family: 'Noto Sans KR';
}
.contentArea{
  overflow: hidden;
}
.profileCard{
  padding:0px 10px;
  margin-top: 1.5vw;
  font-size: 0.7vw;
  font-family: 'Noto Sans KR';
}
.fa-user-circle{
  color: lightgray;
}
.blueText{
  text-decoration: none;
  color : #0057FF;
}
.vDivider{
  margin-top: 20px;
  border: #0057FF solid 1px;
  background-color:#0057FF;
}
.mapArea{
  position:absolute;
  right:0;
  height: 100vh;
  width: 40vw;
  overflow: hidden;
}
.placeImage{
  width: 100%;
  height: 10vw;
  background-size: cover; 
  background-position: center; 
  box-sizing: content-box;
  margin-bottom: 10px;
  border-radius: 5px;
}
.buttonArea{
  position: relative;
  padding-right: 20px;
  margin-top: -2vw;
  margin-bottom: 2.5vw;
}
.morePlaceInfo{
  position: absolute;
  right: 45px;
  font-size: 16px;
  line-height: 25px;
  padding-right: 10px;
}
.morePlaceInfoSvg{
  position: absolute;
  right: 0;
}
.errorCard{
  padding: 50px;
  font-size: 20px !important;
  font-family: 'Noto Sans KR';
}
.errorCard .v-card__text{
  padding: 50px;
  font-size: 20px !important;
  font-family: 'Noto Sans KR';
}
.errorCard .v-btn{
  padding: 30px 10px;
  font-size: 18px !important;
  font-family: 'Noto Sans KR';
}
</style>