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
    const exercise_url =  'http://saral.navgurukul.org/api/courses/' + mainData[userInput-1]["id"] + '/exercises';
    const filename = 'course_' + mainData[userInput-1]["id"] + '.json';
    const course_details = {
        'filename': filename,
        'url': exercise_url
    }
    return course_details;
}


async function caching(filename, url){
    let exericeses = "";
    try{
        let json_data = fs.readFileSync(filename);
        exericeses = JSON.parse(json_data);
        return exericeses;
    }catch{
        exericeses = await axios.get(url);
        await storeData(filename, exericeses);
        return exericeses.data;
    }
}

function printExercises(exercise_data){
    const exercise_list = exercise_data.data;
    let childExercises_list = [];
    let slug_list = [];
    var index = 0;
    var numbring = 1;
    for(index; index<exercise_list.length; index++){
        console.log(`${numbring}. ${exercise_list[index]["name"]}`);
        slug_list.push(exercise_list[index]["slug"]);
        numbring++;
        if(exercise_list[index].childExercises !== null){
            childExercises_list = exercise_list[index].childExercises;
            var count = 0;
            for(count; count<childExercises_list.length; count++){
                console.log(`    ${numbring}. ${childExercises_list[count].name}`);
                slug_list.push(childExercises_list[count].slug);
                numbring++;
            }
        }
    }
    if(index===0){
        return "no"
    }
    return slug_list;
}

async function getContent(slugs, course_url, slug_id){
    const url = course_url.slice(0, -1); // removing last character from the urls "courses<>course"
    const content_url = url + '/getBySlug?slug=' + slugs[slug_id-1];
    const exercise_content = await axios.get(content_url);
    const content =JSON.parse(exercise_content.data.content); 
    
    console.log("    ***");
    var index = 0;
    for(index; index<content.length; index++){
        console.log(content[index]["value"]);
    }
}

async function choosingExercise(slugList, exercise_link, exerciseID){
    if(slugList !== "no"){
        content = await getContent(slugList, exercise_link, exerciseID);
        console.log("");
    }else{
        console.log("Exercise not available.");
    }

}

function checkingUserinput(item, array){
    return new Promise((resolve, reject)=>{
        while(true){
            console.log("");
            var input = readline.question(`Which ${item} do you wanna go with:- `);
            let e_id = parseInt(input); // e_id = exercise_id/course_id
            if(e_id !== e_id){
                console.log("");
                console.log("          Invalid input.");
                console.log("");
                console.log(`     Only enter ${item} number.`);
                console.log("");
            }
            else if(e_id>array.length || e_id<1){
                console.log("");
                console.log("              Wrong input");
                console.log("");
                console.log(`    Enter the exact number of the ${item}`);
                console.log("");
            }
            else{
                resolve(e_id);
                break;
            }
        }
    })
}

async function start(){
    const all_data = await axios.get(url);

    const wrote = await storeData(courses_file, all_data);

    printCourses(all_data);
    console.log("");
    var coursesDetails = all_data.data.availableCourses;
    var valid = await checkingUserinput("course", coursesDetails);

    var get_exercises = access_to_exercises(coursesDetails, valid);
    var exercise_details = await caching(get_exercises.filename, get_exercises.url);

    console.log("");
    var slugList = printExercises(exercise_details);
    valid = await checkingUserinput("exercise", slugList);
    choosingExercise(slugList, get_exercises.url, valid);
    console.log("");
}

start();
