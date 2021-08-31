const { rejects } = require('assert');
const axios = require('axios')
const fs = require('fs');
const { resolve } = require('path');
const readline = require('readline-sync')

const url = 'http://saral.navgurukul.org/api/courses';
const courses_file = 'courses.json';
let ifCache = true;

function storeData(filename, data){
    return new Promise((resolve, reject)=>{
        const string_data = JSON.stringify(data.data, null, 2);

        fs.writeFile(filename, string_data, 'utf8', (err) =>{
            if(err){
                reject("something went wrong!");
            }else{
                resolve("Successfully written!")
            }
        })
    })
}

function printCourses(data){
    var course = 0;
    var courses = data.data.availableCourses;

    for(course; course<courses.length; course++){
        console.log(`${course+1}.  ${courses[course].name}`);
    }
}

function access_to_exercises(mainData, userInput){
    const coursesDetails = mainData.data.availableCourses;  
    const exercise_url =  'http://saral.navgurukul.org/api/courses/' + coursesDetails[userInput-1]["id"] + '/exercises';
    const filename = 'course_' + coursesDetails[userInput-1]["id"] + '.json';
    const course_details = {
        'filename': filename,
        'url': exercise_url
    }
    return course_details;
}


async function caching(filename, url){
    let exericeses = "";
    // return new Promise((resolve, reject)=>{
        try{
            let json_data = fs.readFileSync(filename);
            exericeses = JSON.parse(json_data);
            console.log(exericeses);
            console.log(`reading ${filename} file.`);
            return exericeses;
        }catch{
            exericeses = await axios.get(url);
            const wrote = await storeData(filename, exericeses);
            console.log(`writing on ${filename} file.`);
            return exericeses;
        }
    // })
}

async function start(){
    const all_data = await axios.get(url);

    const wrote = await storeData(courses_file, all_data);

    printCourses(all_data);
    console.log("");

    const user = parseInt(readline.question("Which course do you wanna go with:- "));
    const get_exercises = access_to_exercises(all_data, user);
    console.log("");

    const exercise_details = await caching(get_exercises.filename, get_exercises.url);
    console.log("");
}

start();
