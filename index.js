const axios = require('axios')
const fs = require('fs');

const url = 'http://saral.navgurukul.org/api/courses';
const fileName = 'courses.json';

function storeData(filename){
    return new Promise(resolve, reject){
        
    }
}

axios.get(url).then((response)=>{
    let data = response;
    console.log(data.data);
})