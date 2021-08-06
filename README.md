<center>

<p align="center">
    <img height="150px" src="./public/images/logo_favicon/logo.png" >
</p>

</center>

<h1 align="center">Realtime Messenger Application</h1>

# [**Table of contents**](#table-of-contents)

- [**Table of contents**](#table-of-contents)
- [**Introduction**](#introduction)
- [**The reason why I write**](#the-reason-why-i-write)
- [**Architecture**](#architecture)
- [**Installation**](#installation)
- [**Features**](#features)
  - [**1.User Account Manager Functions**](#1user-account-manager-functions)
    - [**1.1.Login**](#11login)
    - [**1.2.Logout**](#12logout)
    - [**1.3.Update Avatar**](#13update-avatar)
    - [**1.4.Update Information**](#14update-information)
    - [**1.5.Update Password**](#15update-password)
  - [**2.Contact Management Functions**](#2contact-management-functions)
    - [**2.1.Search By Keyword**](#21search-by-keyword)
    - [**2.2.Send & Cancel Friend Request**](#22send--cancel-friend-request)
    - [**2.3.Contact Management**](#23contact-management)
    - [**2.4.Notification & notifications Management**](#24notification--notifications-management)
    - [**2.5.Unfriend**](#25unfriend)
- [**Timeline**](#timeline)
  - [**Phase 1** : **24-06-2021 to 16-07-2021**](#phase-1--24-06-2021-to-16-07-2021)
  - [**Phase 2** : **19-07-2021 to 06-08-2021**](#phase-2--19-07-2021-to-06-08-2021)
  - [**Phase 3** : **07-08-2021 to xx-xx-2021**](#phase-3--07-08-2021-to-xx-xx-2021)
  - [**Phase 4** : **xx-xx-2021 to xx-xx-2021**](#phase-4--xx-xx-2021-to-xx-xx-2021)
  - [**Phase 5** : **xx-xx-2021 to xx-xx-2021**](#phase-5--xx-xx-2021-to-xx-xx-2021)
- [**Third-party libraries**](#third-party-libraries)
- [**Post script**](#post-script)
- [**Made with 💘 and JavaScript <img src="https://upload.vectorlogo.zone/logos/javascript/images/239ec8a4-163e-4792-83b6-3f6d96911757.svg" width="25">**](#made-with--and-javascript-)

# [**Introduction**](#introduction)

[Facebook Messenger](https://www.facebook.com/) , [WhatsApp](https://www.whatsapp.com/?lang=en) , [Skype](https://www.skype.com/en/features/skype-web/) doesn't respect your private ?  Advertisements make you annoy ? You want some chatting application which protects your information & encrypts every single messenger  ? It's simple 😆 Get into Realtime Messenger Application . I can do it for you & for free forever 🤗.This is my idea


# [**The reason why I write**](#the-reason-why-i-write-)
When I make a start , I have been just a third-year student in [Posts and Telecommunications Institute of Technology HCM Branch](https://en.wikipedia.org/wiki/Posts_and_Telecommunications_Institute_of_Technology,_Ho_Chi_Minh_City).So I am hungry for a challenge , I want to learn & build some thing usefully . In addition , it can make employer impressive,so on 😎😋
# [**Architecture**](#architecture)

What type of architecture have I used ? I have written this application following **Model-View-Controller** architecture

# [**Installation**](#installation)
In folder `public/bower_components` contains third-party libraries.They have the same feature like `node_modules` so that I do not want to commit them to Github. To address the problem , [Bower](https://bower.io/#getting-started) was used to managing these libraries.

We have 2 important bower file:

**bowerrc** : it tell our PC where our libraries will be stored.There I choose `public` folder to store them.You can decide where the files will be stored after finishing process

       {
              "directory": "public/"
       }

**bower.json** : configuration file include many valuable information and what URL we have to download ? .This code below tell the application where to retrieve these files.You can push them to your github and replace the link below with your GitHub link

       "dependencies": 
       {
              "bower_components": "https://github.com/trungquan17/awesome-chat-third-party-libraries.git"
       }

To active , run :

        bower install

Installation will be activated automatically.

# [**Features**](#features)

## [**1.User Account Manager Functions**](#1user-account-manager-functions)

###   [**1.1.Login**](#11-login)

It is known that login function is one of the most important function with every chat application. It's too difficult to me for the first time to build it up . Overcome all the obstacle , I completed this function . So every single user can log in by 3 different ways : Local Account , Facebook Account & Google Account . [PassportJS](http://www.passportjs.org/) & [Nodemailer](https://nodemailer.com/about/) were used to build up.
 
With Facebook Account & Google Account : people user their Facebook account or Google account to  login by matched methods.
 
With Local Account :  they have to activate their account by click the link from verify e-mail after signing up successfully.

###   [**1.2.Logout**](#12-logout)

Of course , who don't need log out their account for going to sleep 😴 ?

### [**1.3.Update Avatar**](#13-update-avatar)

People can change whatever image to show their personality . It's a piece of cake.However , I set max size is 5 MB . SAVE  !! New avatar is updated 😎. 

### [**1.4.Update Information**](#14-update-information)

At user's convenient & connect with each other face to face easily , both phone number and address could be edited so as to get contact with someone in person . From now , we don't just friends on the Internet , we are real friend 👩🏻‍🤝‍👩🏻

### [**1.5.Update Password**](#15-update-password)

Some people are obsessed with their private 😨 . You are afraid of being read secret ? Don't worry,you can change your password whenever you're concerned


##  [**2.Contact Management Functions**](#2contact-management-functions)

### [**2.1.Search By Keyword**](#21-search-by-keyword)

User could find their friend with a searching tab.Just click on it & type name you want.All user having username relating to the keyword will be showed up. So easy 😋

### [**2.2.Send & Cancel Friend Request**](#22send--cancel-friend-request)

Of course, found friend ? Why don't you send a friend request, do you ? 😎 When you send a friend request to some one. They will receive your friend request & notification pops up immediately. This is a realtime function which was built by [Socket.io](https://socket.io/)

### [**2.3.Contact Management**](#23contact-management)

A full-scaled menu was designed to help user see every single contact easily. User could see their friend, see all user that they sent friend request & how many friend request they received.Consider accept or deny friend request that user received 😛

### [**2.4.Notification & notifications Management**](#24notification--notifications-management)

User could access all content of notification with icon or get a full-scaled tab.All notifications user received is here.

### [**2.5.Unfriend**](#25unfriend)

Nothing lasts forever ! If you don't want to be friend with some one.Just unfriend them ! 🙋‍♂️🙋‍♀️ Say google and go separate ways 👻👻. Whom you unfriend does not know anything about it.Every thing is secret

# [**Timeline**](#timeline)

 ## **Phase 1** : **24-06-2021 to 16-07-2021**

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

 - Authentication function : What type of account does users can use to log in ? To heighten performance and shorten code as possible as I can , [Passport JS](http://www.passportjs.org/) library was used to build up this function. In my [Realtime Messenger Application](https://github.com/Phong-Kaster/Realtime-Messenger-Application),people can login by 3 different ways : [Local Account](http://www.passportjs.org/packages/passport-local/) , [Facebook Account](http://www.passportjs.org/docs/facebook/) , [Google Account](http://www.passportjs.org/docs/google/)
  
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
 ## **Phase 2** : **19-07-2021 to 06-08-2021**
Note : 25-07-2021 to 31-07-2021 I did not do any thing because revising for Computing Network subject.
       
       1.Search by keyword function

       2.Send | cancel friend request function

       3.Set up & configure Socket.io library

       4.Realtime send | cancel friend request function

       5.Pour notification data into a compact tab

       6.Count unseen notifications & pour notification data into a full-scaled tab

       7.Read more notifications function

       8.Mark as read for all notification function

       9.Pour contact data into a full-scaled tab & count number of them

       10.Read more contacts function

       11.Cancel sent friend request function

       12.Deny received friend request from other people

       13.Accept received friend request from other people

       14.Unfriend function
 ## **Phase 3** : **07-08-2021 to xx-xx-2021**

 ## **Phase 4** : **xx-xx-2021 to xx-xx-2021**
 ## **Phase 5** : **xx-xx-2021 to xx-xx-2021**




# [**Third-party libraries**](#third-party-libraries)
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
# [**Post script**](#post-script)

- Begun on **24-06-2021**

- Finish on **xx-xx-2021**
  
# [**Made with 💘 and JavaScript <img src="https://upload.vectorlogo.zone/logos/javascript/images/239ec8a4-163e-4792-83b6-3f6d96911757.svg" width="25">**](#made-with-love-and-javascript)
