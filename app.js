const express = require("express");
const router = express.Router();
const { App } = require('@slack/bolt');
require('dotenv').config();
//const { Users } = require("../models/users.model");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});


//Listens to 'users list' and will print users list
app.message('users list', async({ message, say }) => {  
  const users = await fetchUsers();  
  say(`I tried to get users: ${users}`);        
});

// Fetch users using the users.list method
async function fetchUsers() {
  try {
    let usersStore = [];
    //Call the users.list method using the built-in WebClient
    const results = await app.client.users.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN
    });
    
    const userList = results.members;
    
    //Output list of user names
    for (let user of userList) {
      usersStore.push(user.real_name);
    }
    return usersStore;
   
  }
  catch (error) {
    console.error(error);
  }
}

//----------------------------------------------------------
//function to return list of users who are less than 30days new to HFLA
function findNewUsers() {
  let newUserList = [];
  for (let id in db) {
    if(checkStartDate(db[id]) <= 30) {
      newUserList.push(db[id]);
    }
  }
  return newUserList;  
}

//function to check how long a user has been with the org (according to the date they created their VRMS account)
function checkStartDate(user) {
  let userStartDate = user.createdDate;
  let userStartparsed = Date.parse(userStartDate);
  
  let dateNow = new Date();
  let diff = dateNow - userStartparsed;
  let diffDays = diff/1000/60/60/24;
  
  return diffDays;
}


//based on user ID, will send user a DM from the bot with a message
async function botDmChat() {
  try {
    
    //using conversations.open to find user's conversation object
    const userConversations = await app.client.conversations.open({
      token: process.env.SLACK_BOT_TOKEN,
      users: process.env.USER_ID
    });
    
    //extracting user's DM id from conversation object
    let userDmId = userConversations.channel.id;
    
    //grabbing user's name from user object api
    let userObj = await app.client.users.info({
      token: process.env.SLACK_BOT_TOKEN,
      users: process.env.USER_ID
    });
    let userName = userObj.users[0].real_name;
    let textData=`*Hello* ${userName}!`;

    //using user userDmId to send message to user
    const sendUserMsgObj = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userDmId,
      mrkdown: true,
      text: textData
    });
  }
  catch (error) {
    console.error(error);
  }
}

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

//Bolt uses the /slack/events endpoint to listen to all incoming requests (whether shortcuts, events, or interactivity payloads). When configuring endpoints within your app configuration, you’ll append /slack/events to all request URLs.
//

module.exports = router;
