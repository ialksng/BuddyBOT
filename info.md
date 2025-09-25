way to interact with openai:
1. npm i openai
https://www.npmjs.com/package/openai
```js
import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const response = await client.responses.create({
  model: 'gpt-4o-mini',
  input: 'Joke related to CS',
});

console.log(response.output_text);
```
2. API calls: calling open ai endpoint
https://platform.openai.com/docs/api-reference/chat/create
API refernce --> chat completions
```js
import express from "express";
import "dotenv/config";
import cors from "cors";
import { Messages } from "openai/resources/chat/completions.js";

const app = express();
const PORT = 3000;

// middlewares - used when we use FE+BE
app.use(express.json()); // parse incoming request
app.use(cors());

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

app.post("/test", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: req.body.message
            }]
        })
    }
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        // console.log(data.choices[0].message.content); // reply
        res.send(data.choices[0].message.content);
    } catch(err) {
        console.log(err);
    }
})
```
backend:
* models
history -> thread => 1 individual chat sequence

1. ThreadSchema 
            threadId
            title
            messages
            createdAt
            updatedAt
2. messageSchema
            content
            role -> user, assistant
            timestamp
threads.js

* utils
// core logic
openai.js

* routes
before this, connect BE (server )with DB (mongoDB)
chat.js
// history track
* GET /thread -- all thread return: sort otb of updatedAt
* GET /thread/:threadld -- return messages of 1 specific route
* DELETE /thread/:threadIld
// newchat
* POST /chat -- [message + reply]

                            Back                                    Front
                         _______________                           _______________
                        |               |                         |  ___________  |
                        |               |                         | |           | |
                        |               |   POST/api/chat         | |        --------threadId
OpenAI API <----------- |               |<------------------------| |           | |
            ---reply--->|               |   {threadId, message}   | |  _______  | |
               \        |               |                         | | |_______|-----------message
                \       |               |-------response--------->| |___________| |
                 \      |_______________|                         |_______________|
    threadId      \       /
        /\         \     /
       /  \         \   /
      /    \         \ /      
    exist  new        DB

1. validate threadId, message
2. if threadId is not in DB
        create a new thread
3. save the message (user) in thread
DB store reply (assistant)

* Routes can be tested by Postman API

# FE
npm create vite@latest
npm i
npm run dev

Components

         sidebar                                    chatWindow = navbar + chatInput
            |                                           |
            |                                           |
 ___________________________________________________________________________________________
|                     |                                                                    ------------------- navbar
|                     |_____________________________________________________________________|
|                     |            ___________________________________________              |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |-------------------------- chat
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |                                           |             |  
|                     |           |                                           |             |
|                     |           |                                           |             |
|                     |           |___________________________________________|             |
|                     |              _______________________________________                |
|                     |             |                                       |               |
|                     |             |                                       |------------------------ chatInput
|                     |             |_______________________________________|               |
|_____________________|_____________________________________________________________________|

In React, a state variable is needed when your component’s UI needs to change dynamically based on some data.

Functionalites
1. sending prompt ---> reply
    loader
2. show our chats (prompt+reply)

revChats = [{role: user     }, {role: assistant     }]
             content:|          content:   |
                     |                     |
                  userDiv               buddyDiv


1. Formatting of reply
2. latestReply ==> typing effect

                            prompt1     |
reply1                                  |
                            prompt2     |
reply2: latestReply ==> typing effect   |
   |                                    |
latestReply                            latest

3. show all Threads --> DB (prevChats)

Future Scope of the Project:
1. Implement User Authentication &Authorization
2. Implement light & dark theme
3. Implement Functionality forDropdown 
4. Add Voice Feature
5. Deploy