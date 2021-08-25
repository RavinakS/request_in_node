const axios = require('axios')
const fs = require('fs');

const url = 'http://saral.navgurukul.org/api/courses';
const fileName = 'courses.json';

function storeData(filename, data){
    fs.writeFile(filename, data, 'utf8', (err, data)=>{
        if(err){
            console.log(err);
        }
        console.log("Successfully Written.");
    })
    // return new Promise(resolve, reject){
    //     fs.writeFile(filename, data, 'utf8', (err, data)=>{
    //         if(err){
    //             console.log(err);
    //         }
    //         console.log("Successfully Written.");
    //     })
    // }
}

axios.get(url).then((response)=>{
    data = JSON.stringify(response, null, 2);
    storeData(fileName, data)
}).then((done)=>{
    console.log("Hi");
})