'use strict';
const axios = require('axios');
const URL = 'http://40d8cf8f7253.ngrok.io/auth/register';
const body = {
  email: 'artemsdsdfsdff@gmail.com',
  password: '12312313',
};

const getRes = async () => {
  axios
    .post(URL, body)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error.response.data);
    });
};
getRes();
