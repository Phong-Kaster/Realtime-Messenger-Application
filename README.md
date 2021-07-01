# Realtime-Messenger-Application

With front-end , I used third-party libraries which have its version as :

- bootstrap: **^3.3.7**
- font-awesome **^4.7.0**
- jquery **^3.3.1**
- AlertifyJS **^1.11.0**
- jquery.nicescroll **^3.7.6**
- moment **^2.21.0**
- emojionearea **^3.0.0**
- peerjs **^0.3.14**
- sweetalert2 **^7.33.1**
- photoset-grid **^1.0.1**
- jquery-colorbox **^1.6.4**


In folder public/bower_components contain them.They have the same feature like node_modules so that I do not want to commit them to Git Hub.To address the problem , Bower was used to managing these libraries.
You can read more about Bower at : https://bower.io/#getting-started

We have 2 important bower file:
1.bowerrc : it tell our PC where our libraries will be stored.There I choose public/bower_components
2.bower.json : configuration file include many valuable information and what URL we have to download ?

To active , run :

        bower install

Installation will be activated automatically.
