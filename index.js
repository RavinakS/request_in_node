const axios = require('axios')
const fs = require('fs');

const url = 'http://saral.navgurukul.org/api/courses';
const fileName = 'courses.json';

function storeData(filename, data){
    // fs.writeFile(filename, data, 'utf8', (err, data)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("Successfully Written.");
    // })
    return new Promise((resolve, reject)=>{
        fs.writeFile(filename, data, 'utf8', (err, data)=>{
            if(err){
                console.log(err);
            }
            console.log("Successfully Written.");
        })
    }
    )}

axios.get(url).then((response)=>{
    data = JSON.stringify(response.data, null, 2);
    return storeData(fileName, data);
}).then((courses)=>{
    // data = JSON.stringify(courses.data, null, 2)
    console.log("Hi");
})