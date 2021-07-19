<center>

<p align="center">
    <img height="150px" src="./public/images/logo_favicon/logo.png" >
</p>

</center>

<h1 align="center">Realtime Messenger Application</h1>

## [**Table of contents**](#table-of-contents)

- [**Table of contents**](#table-of-contents)
- [**Introduction**](#introduction)
- [**Architecture**](#architecture)
- [**Installation**](#installation)
- [**Timeline**](#timeline)
  - [**Phase 1** : **24-06-2021** to **16-07-2021**](#phase-1--24-06-2021-to-16-07-2021)
  - [**Phase 2** : **19-07-2021** to **xx-xx-2021**](#phase-2--19-07-2021-to-xx-xx-2021)
  - [**Phase 3** : **xx-xx-2021** to **xx-xx-2021**](#phase-3--xx-xx-2021-to-xx-xx-2021)
  - [**Phase 4** : **xx-xx-2021** to **xx-xx-2021**](#phase-4--xx-xx-2021-to-xx-xx-2021)
  - [**Phase 5** : **xx-xx-2021** to **xx-xx-2021**](#phase-5--xx-xx-2021-to-xx-xx-2021)
- [**Third-party libraries**](#third-party-libraries)
- [**Post script**](#post-script)
- [**Made with 💘 and JavaScript <img src="https://upload.vectorlogo.zone/logos/javascript/images/239ec8a4-163e-4792-83b6-3f6d96911757.svg" width="25">**](#made-with--and-javascript-)

## [**Introduction**](#introduction)

[Facebook Messenger](https://www.facebook.com/) , [WhatsApp](https://www.whatsapp.com/?lang=en) , [Skype](https://www.skype.com/en/features/skype-web/) doesn't respect your private ?  Advertisements make you annoy ? You want some chatting application which protects your information & encrypts every single messenger  ? It's simple 😆 Get into [Realtime Messenger Application](https://github.com/Phong-Kaster) . I can do it for you & for free forever 🤗.This is my idea

## [**Architecture**](#architecture)

What type of architecture have I use ? I have written this application following **Model-View-Controller** architecture

## [**Installation**](#installation)
In folder `public/bower_components` contain third-party libraries.They have the same feature like `node_modules` so that I do not want to commit them to Github. To address the problem , Bower was used to managing these libraries.Detail about [third party libraries](#third-party-libraries)
You can read more about [Bower](https://bower.io/#getting-started)

We have 2 important bower file:

1.bowerrc : it tell our PC where our libraries will be stored.There I choose `public` folder to store them

       {
              "directory": "public/"
       }

2.bower.json : configuration file include many valuable information and what URL we have to download ?

To active , run :

        bower install

Installation will be activated automatically.
## [**Timeline**](#timeline)

 ### **Phase 1** : **24-06-2021** to **16-07-2021**

 - Prepare knowledge and tools : I learn about what I will use to build up this application :

        1. Set up Visual Studio Code , MongoDB Compass , Git & GitHub

        2. Learn about BabelJS to convert some statement in Javascript ES6

        3. Search & learn some basic knowledge about asynchronous & await
     
        4. Draft database diagram
 
 - Configure basis : I set up root parts of this project: 

        1. Connect MongoDB with Mongoose

        2. Insert front-end template into project

        3. Configure routers & controllers

        4. Configure view engine with EJS

 - Authentication function : What type of account does users can use to log in ? [Passport JS](http://www.passportjs.org/) library was used to build up this function. In my [Realtime Messenger Application](https://github.com/Phong-Kaster/Realtime-Messenger-Application),people can login by 3 different ways : [Local Account](http://www.passportjs.org/packages/passport-local/) , [Facebook Account](http://www.passportjs.org/docs/facebook/) , [Google Account](http://www.passportjs.org/docs/google/)
  
        1. Client-side account registration function

        2. Server-side account registration function

        3. Sending e-mail function for verifying local account

        4. Account logout function

        5. Registration function via Facebook account
     
        6. Registration function via Google account

        7. Client-side updating avatar function

        8. Server-side updating avatar function

        9. Updating Information function
     
        10. Changing Password function
 ### **Phase 2** : **19-07-2021** to **xx-xx-2021**

 ### **Phase 3** : **xx-xx-2021** to **xx-xx-2021**

 ### **Phase 4** : **xx-xx-2021** to **xx-xx-2021**
 ### **Phase 5** : **xx-xx-2021** to **xx-xx-2021**




## [**Third-party libraries**](#third-party-libraries)
With front-end , I used third-party libraries which have its version as :

1. bootstrap : 3.3.7
   
2. font-awesome : 4.7.0

3. jquery : 3.3.1

4. AlertifyJS : 1.11.0

5. jquery.nicescroll : 3.7.6
   
6. moment : 2.21.0
   
7. emojionearea : 3.0.0
   
8. peerjs : 0.3.14
   
9. sweetalert2 : 7.33.1
    
10. photoset-grid : 1.0.1
    
11. jquery-colorbox : 1.6.4

They will be installed immediately when `bower install` command run
## [**Post script**](#post-script)

- Begun on **24-06-2021**

- Finish on **xx-xx-2021**
  
## [**Made with 💘 and JavaScript <img src="https://upload.vectorlogo.zone/logos/javascript/images/239ec8a4-163e-4792-83b6-3f6d96911757.svg" width="25">**](#made-with-love-and-javascript)
