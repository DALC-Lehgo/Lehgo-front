// import axios from 'axios'
class courseService{
   notCoursePlaceList(placeList, coursePlaceList){
        let newPlaceList = []
        for (let p in placeList){
            let noCourse = false;
            for (let cp in coursePlaceList){
                if(placeList[p].placeId == coursePlaceList[cp].placeId){
                    noCourse = true;
                    break;
                }
            }
            if (!noCourse){
                newPlaceList.push(placeList[p])
            }
        }
        return newPlaceList
   }
}

export default new courseService()
