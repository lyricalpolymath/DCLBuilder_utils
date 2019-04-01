Decentraland-builder-competition submission
# Spiral Explosion

a script to help you generatively manipulate groups of entities, to create computational sculptures or parts of a scenes.

it requires and uses the [Decentraland Builder Utilies](https://github.com/lyricalpolymath/DCLBuilder_utils) that I build after incurring in some pain while using the first version of the Decentraland Builder, and discovering that triangle limits meant that you had to to rebuild everything from scratch in a new position.

install the in your browser console
[`DCLBuilder.js`](https://github.com/lyricalpolymath/DCLBuilder_utils/blob/master/decentraland_builder_utilities/DCLBuilderUtils.js)

there are 2 different projects that were produced with this script.
The spiralling script was used multiple times on the same project, with different entities, and assigning different parameters for each entity, until the desired effect was found.

Both projects where also worked by hand

##1- Exodus:
a computational sculpture made with the HTC items. 
![Explosion_Exodus](builderProjects/Explosion_001_Exodus1/screenshots/Explosion_Exodus1_screenshot_07.jpg)
![Explosion_Exodus](builderProjects/Explosion_001_Exodus1/screenshots/Explosion_Exodus1_screenshot_08.jpg)
See [all screenshots](builderProjects/Explosion_001_Exodus1/screenshots/)

##1- Forest in the sky:
a spiralling forest that explores what could be built in a limited space but still creating tiny stories at each corner. 
![Forest in the sky](builderProjects/Explosion_002_Forest_in_the_sky/screenshots/ForestInTheSky_09.jpg)
![Forest in the sky](builderProjects/Explosion_002_Forest_in_the_sky/screenshots/ForestInTheSky_14.jpg)
See [all screenshots](builderProjects/Explosion_002_Forest_in_the_sky/screenshots/)





## Why I think / hope this is still valid for the builder competition :)
All submissions have been created with the Builder, not another SDK or other assets.

The Decentraland Builder [competition terms](https://decentraland.org/contest-terms) mention scripts and "macros"

> 
Decentraland has the right, in its sole discretion, to maintain the integrity of the Contest, to void votes for any reason, including, but not limited to: the use of bots, macros, scripts, or other **technical means for entering**. 
Any attempt by an entrant to deliberately damage any website or undermine the legitimate operation of the Contest may be a violation of criminal and civil laws. 

I interpret this as creating scripts that create fake identities and/or that automatically signs up to the competition, I imagine in order to get the 100 Mana reward. This is not what this script is for and I'm not trying to hack the competition. **I'm just trying to express some ideas with the Decentraland builder**

**This script and the [`DCLBuilder.js`](https://github.com/lyricalpolymath/DCLBuilder_utils/blob/master/decentraland_builder_utilities/DCLBuilderUtils.js) utilites only help working with the builder, everything you can do with these scripts you could do by hand, it only helps doing it faster.** 

I started writing the [Decentraland Builder Utilies](https://github.com/lyricalpolymath/DCLBuilder_utils) out of frustration: after discovering the triangle limit, and increasing the size of the parcel, I would have had to move all items by hand or recreate the scene from scratch. with `shiftAllByAmount` you can simply call a function that automatically moves all the components to the desired offset, to the new parcel center.

I'm making available these tools for everyone to use in the future...although there is here already a lot that **could be integrated directly in the builder itself.**




## What is it
`Spiral Explosions` is only a simple script to generatively create groups of entities 

changing the parameters changes the effects so it allows for play and experimentation

## How to use it

### Requirements
- requires [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
(you need to be able to use `$r` in the browser's console for the script to work)

- you need the DCLBuilder utilities available in
`../../../decentraland_builder_utilities/DCLBuilder.js` 

### "install"

- open the browser developer tools 
- If on Chrome open the Sources tab > Snippets
- create a new snippet 
- copy & paste the content of the `decentraland_builder_utilities/DCLBuilderUtils.js` in the new snippet (or in the browser console)
- create another snippet (or paste it in the console) 
for the 
`src/SpiralExplosion.js`
- run both snippets (command+enter on mac)



### how to use it
- open the browser on https://builder.decentraland.org
- open any project
- open the browser Developer tools
- open React tab in the devtools
- ensure that `$r` doesn't return undefined

- drag and drop an entity that you want to use as a pattern
- leave it selected and type in the console
`D.getSelectedEntity()`
- take note of the id of the object you want to reproduce and insert it in `SpiralExplosion.js` snippet
- configure the parameters of the spiral
- launch the snippet (command+enter)
- enjoy and play with the parameters


------
#### Licence

Artworks produced with the scripts:
Copyright Beltran Berrocal | [@lyricalpolymath](https://twitter.com/lyricalpolymath) 
all rights reserved. 
(Limited licence under the terms of the decentraland competition)

The Software is released, without any warranty, under the [GNU AGPLv3](../../LICENCE)  


