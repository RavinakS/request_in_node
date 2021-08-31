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

async function start(){
    const all_data = await axios.get(url);

    const wrote = await storeData(courses_file, all_data);

    printCourses(all_data);
    console.log("");

    const course = parseInt(readline.question("Which course do you wanna go with:- "));
    const get_exercises = access_to_exercises(all_data, course);
    console.log("");

    const exercise_details = await caching(get_exercises.filename, get_exercises.url);

    const slug_list = printExercises(exercise_details);
    if(slug_list !== "no"){
        console.log("");
        let exercise_id = parseInt(readline.question("Which exercise will you go with(only parant exercises):- "));
        console.log("");
        if(exercise_id > slug_list.length){
            console.log("Please select only parant exercises not child ones.");
            console.log("do check once which is chiled and which is parant exercise.");
            console.log("");
            exercise_id = parseInt(readline.question("Which exercise will you go with(only parant exercises):- "));
            if(exercise_id > slug_list.length){
                console.log("");
                console.log("Wrong input.");
                console.log("");
            }else{
                content = await getContent(slug_list, get_exercises.url, exercise_id);
                // console.log(content);
                console.log("");
            }
        }else{
            content = await getContent(slug_list, get_exercises.url, exercise_id);
            // console.log(content);
            console.log("");
        }
    }else{
        console.log("Exercise not available.");
    }

}

start();
