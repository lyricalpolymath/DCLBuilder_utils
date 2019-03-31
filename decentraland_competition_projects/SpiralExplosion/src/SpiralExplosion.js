import D from "./../DCLBuilderUtils.js";

/*
 EXODUS1_entities
var cubeId    = "23be3deb-964f-47f9-bac1-4491d28aad6d"; // entity
var phoneId   = "e7198e7c-a79c-4633-9dea-8b35cba70507" 
var thickRing = "87eacc51-9d7e-40de-999d-4b0f2ba7e391"
var thinRing  = "0171b662-f942-402a-87d2-ee35cb2d38b9"
var zion      = "feb1519a-9cc2-4cf8-9b17-36e8d4ac4e9a"
var mana      = "86c90c6f-c5a3-4e85-8eb7-c71e7f2e352a"
//*/

var objectId = cubeId;              // entity that you want to duplicate
var groupName = 'cubeSpiral1'       // name of the group created with the duplicated objects

// parameters you can change
var numItemsPerCircle = 25         // this will determine the density
var tStart = 1                     // starting point of the spiral, shouldn't be 0 
var tMax =   25                    // last step of the spiral > you will reach it by tIncrement define further down                 

var spiralHeightFactor = 0.9;      //0.3 // <1 = more compact; =1 normal spiral; >1 more vertical
var radius = 0.7                   // spiral radius <1 compact, >1 enlarges

var randomRot = true;              // randomize the rotation of each item?
var xOffset = 0                    // how many meters to wiggle to the left and right of the spiral point on the x axis
var zOffset = 0                    // how many meters to wiggle to the left and right of the spiral point on the z axis

// derived parameters you should not change
var  tIncrement = (2*Math.PI)/numItemsPerCircle
console.log("tIncrement :" +tIncrement);

// https://www.khanacademy.org/math/multivariable-calculus/thinking-about-multivariable-function/visualizing-vector-valued-functions/v/parametric-curves
// https://en.wikipedia.org/wiki/Helix
// t is continuously increasing and is the spiralling factor
function getSpiralPosition (t) {
    var randMax = t
    var randX = Math.random()*randMax;
    var randZ = Math.random()*randMax;
    var xPos  = Math.cos(t) * radius * t;//randX, //*t,
    var zPos  = Math.sin(t) * radius * t;//randZ, //*t
    return {
        x: xPos, //D.utils.randomFloatBetween( (xPos - xOffset), (xPos + xOffset) )
        z: zPos, //D.utils.randomFloatBetween( (zPos - zOffset), (xPos + zOffset) )
        y: t*spiralHeightFactor
    }
    /* clean spiral
    return {
        x: t*Math.cos(t),
        z: t*Math.sin(t),
        //y: t
        y: t*spiralHeightFactor
    }
    */
}


function generateSpiralWithEntity ( center, entityID, groupName, randomRotBool ) {
    console.log("generateSpiralWithEntity")    
    var t = tStart;
    var oldEntities = D.getEntities();
    var comp = D.getComponentFromEntity ( entityID );   // I'm always moving the same component
    
    D.selectEntity( entityID ); // it will be always the same
    //console.log("1- selected entity: " + D.getSelectedEntity()); // it's always the same
        
    do {
        console.log("t: "+ t);
        //1- find the next position in the spiral
        var pos = getSpiralPosition( t );
        //console.log("pos: ", pos);

        //2- offset it relative to the center
        var posCentered = {
            x: center.x + pos.x,
            y: center.y + pos.y,
            z: center.z + pos.z,
        }
        
        //3- add randomRotation
        var rot = (randomRotBool) ? D.utils.getRandomRotation() : D.utils.getResetRotation();
        //console.log("randomRotBool: " + randomRotBool + " > rot: ", rot);

        //4- position the item and duplicate it in that place                   
        D.transform( comp.id, posCentered, rot);
        D.duplicateEntity( entityID )       

        //5- increment t by tIncrement (proportional to the density = to the amount of elements you want in a circle)
        t += tIncrement;
    } while ( t <= tMax );

    // done the duplication - group them
    var newEntities = D.getNewerEntities( oldEntities );
    D.createGroup( groupName, newEntities);
    console.log("done generating the Spiral with entities: ", newEntities);
}

function generateSpiralWithGroupOfEntities ( center, entitiesArr, groupName, randomRotBool ) {
    console.log("generateSpiralWithGroupOfEntities")    
    var t = tStart;
    var oldEntities = D.getEntities();
    var comp = D.getComponentFromEntity ( entityID );   // I'm always moving the same component
    
    D.selectEntity( entityID ); // it will be always the same
    //console.log("1- selected entity: " + D.getSelectedEntity()); // it's always the same
        
    do {
        console.log("t: "+ t);
        //1- find the next position in the spiral
        var pos = getSpiralPosition( t );
        //console.log("pos: ", pos);

        //2- offset it relative to the center
        var posCentered = {
            x: center.x + pos.x,
            y: center.y + pos.y,
            z: center.z + pos.z,
        }
        
        //3- add randomRotation
        var rot = (randomRotBool) ? D.utils.getRandomRotation() : D.utils.getResetRotation();
        //console.log("randomRotBool: " + randomRotBool + " > rot: ", rot);

        //4- position the item and duplicate it in that place                   
        D.transform( comp.id, posCentered, rot);
        D.duplicateEntity( entityID )       

        //5- increment t by tIncrement (proportional to the density = to the amount of elements you want in a circle)
        t += tIncrement;
    } while ( t <= tMax );

    // done the duplication - group them
    var newEntities = D.getNewerEntities( oldEntities );
    D.createGroup( groupName, newEntities);
    console.log("done generating the Spiral with entities: ", newEntities);
}

//////////////////////////

// calculates the initial position of the component to duplicate so that it puts it back to where it started
function getEntityInitialPosition(eID) {
    eID = eID || objectId;
    console.log("getEntityInitialPosition eID: " + eID);
    return D.getComponentFromEntity(eID).data.position
}

// returns the duplicated component to it's original position and rotation so that you can select it again
function resetEntityPosition (eID) {
    var comp = D.getComponentFromEntity(D.getSelectedEntity())
    D.transform(comp.id, compInitialPos, D.utils.getResetRotation())
}

// quickly delete the last produced spiral if you dont' like it
function reset() {
    D.deleteGroup(groupName)
}


///////////////////////  LAUNCH IT

var compInitialPos = getEntityInitialPosition();                      // get the component's initial pos
var sceneCenter = D.getParcelMetrics().center
generateSpiralWithEntity( sceneCenter, objectId, groupName, true);    // create the spiral
resetEntityPosition(cubeId,  sceneCenter);                            // repositions the original component 

// deletes the last produced spiral if you want
//reset()