const { App } = require('@slack/bolt');
require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});


// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
});

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


(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

//Bolt uses the /slack/events endpoint to listen to all incoming requests (whether shortcuts, events, or interactivity payloads). When configuring endpoints within your app configuration, you’ll append /slack/events to all request URLs.
//