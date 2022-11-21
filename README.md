# Websockets Chat

## Description

Easy chat with pseudo-authorisation. Notifies all the other users about joining/leaving of a user. Saves messages after you leave the chat, and shows all of them to you when you're back. 

Uses cookies for storage of authentification data. To add extra user, please log in via new incognito window.

![](https://user-images.githubusercontent.com/92443952/203043450-9b3b59fd-74df-4b63-93b3-96241a41599a.png)

Supports avatar edits. The new avatar can be selected by clicking on the photo area in the top left corner. Or you can just drag & drop it there! 

![](https://user-images.githubusercontent.com/92443952/203046881-8f7a2f92-3048-49bc-8208-95bfdd711fa8.png)

No DB connected. All messages, photos and auth tokens are stored locally in JSON files.


## Instructions

Run: 


* ``npm install`` 
to set dependencies;
* ``npx nodemon src/server.js`` to start backend;
* ``npm run build`` to build the project;
* ``npm run start`` to start webpack dev-server. The dev-server will give you a link where the project is running locally.

Enjoy chatting!

