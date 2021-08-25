const axios = require('axios')

const url = 'http://saral.navgurukul.org/api/courses';

axios.get(url).then((response)=>{
    let data = response;
    console.log(data.data);
})