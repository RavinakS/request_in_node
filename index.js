const { rejects } = require('assert');
const axios = require('axios')
const fs = require('fs');
const { resolve } = require('path');
const readline = require('readline-sync')

const url = 'http://saral.navgurukul.org/api/courses';
const fileName = 'courses.json';
let ifCache = false;

function storeData(filename, data){
    return new Promise((resolve, reject)=>{
        const string_data = JSON.stringify(data.data, null, 2);

        fs.writeFile(filename, string_data, 'utf8', (err) =>{
            if(err){
                reject("something went wrong!");
            }else{
                resolve(string_data)
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

function courseID(data, userInput){
    const coursesDetails = data.data.availableCourses;  
    return coursesDetails[userInput-1]["id"];
}

function exerciseDetails(courseID){
    const exercise_url =  'http://saral.navgurukul.org/api/courses/' + courseID + '/exercises';
    return exercise_url;
}

function caching(filename, data){
    return new Promise((resolve, reject)=>{
        try{
            
        }
    })
}

async function start(){
    const data = await axios.get(url);

    const wrote = await storeData(fileName, data);

    printCourses(data);
    console.log("");

    const user = parseInt(readline.question("Which course you wanna go with:- "));
    const course_id = courseID(data, user);

    console.log(exerciseDetails(course_id));

    
}

start();
