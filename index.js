const { rejects } = require('assert');
const axios = require('axios')
const fs = require('fs');
const { resolve } = require('path');

const url = 'http://saral.navgurukul.org/api/courses';
const fileName = 'courses.json';

function storeData(filename, data){
    return new Promise((resolve, reject)=>{
        const string_data = JSON.stringify(data.data, null, 2);

        fs.writeFile(filename, string_data, 'utf8', (err) =>{
            if(err){
                reject("something went wrong!");
            }else{
                resolve("Written successfully!")
            }
        })
    })
}

async function start(){
    const data = await axios.get(url);

    const wrote = await storeData(fileName, data);
    console.log(wrote);

    
}

start();
