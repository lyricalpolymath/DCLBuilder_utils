## Decentraland Builder Utilities

the Decentralan builder is very basic for now and it's a bit painful to work with. These utilities will allow you to create groups, shift one entity or the whole group by a certain amount, rotate, import and export your projects and more.

check the [`DCLBuilder.js`](src/DCLBuilderUtils.js) file
for the API and the usage examples
or see some examples further down 

## What can it be used for
if you want to computationally control the Decentraland builder entities, (without reliying on the SDK) you can use these functions. I imagine one day they will be made available inside the builder itself. Until then you can use these helpers.
Some screenshots of algorithmic projects built for the Decentraland Builder contest ( [read more](decentraland_competition_projects/SpiralExplosion/README.md) about the submissions).

It can be very helpful to use if you have to add more parcels to recenter all the entities without painfully having to move them by hand.

![Explosion_Exodus](decentraland_competition_projects/SpiralExplosion/builderProjects/Explosion_001_Exodus1/screenshots/Explosion_Exodus1_screenshot_07.jpg)
![Explosion_Exodus](decentraland_competition_projects/SpiralExplosion/builderProjects/Explosion_001_Exodus1/screenshots/Explosion_Exodus1_screenshot_08.jpg)
![Forest in the sky](decentraland_competition_projects/SpiralExplosion/builderProjects/Explosion_002_Forest_in_the_sky/screenshots/ForestInTheSky_09.jpg)
![Forest in the sky](decentraland_competition_projects/SpiralExplosion/builderProjects/Explosion_002_Forest_in_the_sky/screenshots/ForestInTheSky_14.jpg)


## How to use it

### Requirements
- requires [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
(you need to be able to use `$r` in the browser's console for the script to work)

### "install"

- open the browser developer tools > Sources > Snippets
- create a new snippet
- copy & paste the content of the `src/DCLBuilderUtils.js` in the browser console

### how to use it
- open the browser on https://builder.decentraland.org
- open any project
- open the React tab in the chrome developer tools (only if you installed the extension)
- then open the console and verify that `$r` is not `undefined`
- if it works open the DCLBuilder snippet and execute it (command+enter on mac)
- this will automatically perform the `init()` function and output some useful information about the project in the console.
- all functions are avaialable under the namespace `D` so you can quickly access them like `D.getSelectedEntity()`


now you have some useful functions to manipulate the entities in the builder.
Read the [`DCLBuilder.js`](src/DCLBuilderUtils.js) for the API os see some examples here

## Examples
<!-- format for youtube videos with display img
[![Alt text](link to image)](https://youtu.be/uSMqO6b8Z3I) 
link to the image: 
http://img.youtube.com/vi/{video-id}/0.jpg
-->

**Demo1 - Shift All by amount**
 
[![Demo1 - Shift All by amount](https://img.youtube.com/vi/uSMqO6b8Z3I/0.jpg)](https://youtu.be/uSMqO6b8Z3I)


**Demo2 - Group with conditions**

[![Demo2 - Group with Conditions](https://img.youtube.com/vi/Y8SzO1L2oIA/0.jpg)](https://youtu.be/Y8SzO1L2oIA)

**Demo3 - Duplicate Group**

[![Demo1 - Shift All by amount](https://img.youtube.com/vi/FZqdbhxHjS8/0.jpg)](https://youtu.be/FZqdbhxHjS8)

----

ETH tips and tokens :pray: : 0x9820909256A4f636322066f75b984899f1c3aa2f
