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

//trigger message with 'read txt' command, will print the specified md file
//will need to replace hardcode file name with  variable
//Listens to 'read txt' and will print txt file
app.message('read txt', async({ message, say }) => {  
  fs.readFile('./1newMember.md','utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    say(`The text says: ${data}`);        
  });  
});

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
