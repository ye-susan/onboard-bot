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

// All the room in the world for your code
app.event('team_join', async ({ event, context }) => {
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: welcomeChannelId,
      text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
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
    
    //fields to get from user object
    for (let user of userList) {
      //console.log(`Name: ${user.real_name}`);
      usersStore.push(user.real_name);
    }
    return usersStore;
   
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
