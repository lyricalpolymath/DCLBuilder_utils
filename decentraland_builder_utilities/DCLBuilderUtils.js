/* TODO
- solve bugs in import group (does it import also the entities and the components? or when you reload it actually creates other entities?)
- Rotate Group
- getSceneCenter
- delete entity from group if it's deleted by hand in the scene
*/

DCLBuilderUtils = {
        localStorageKey: null, //"builder-storage", // online is only 'builder' will be defined by getLocalStoreObject() if left empy
        localStorageGroupKey: "builder-scene-groups",
        localStorageObj: null,
        //projectId: null,
        //project: null,
        //sceneId: null,
        groups: {},
        //scene: null,   // scene is not a static object - always retrieved live from state
        //state: null,   // state is not a static object 
        // entities: this.getScene().entities
        // components: this.getScene().components

        init: function() {
            if (!$r) console.warn("$r could not be found: you should first open the react tab in developer tools and select the first component")

            this.getProjectId();
            //this.getLocalStoreObject(); 
            //this.getProject();
            this.getSceneId();
            
            console.log("\n------------------------------------------\nDecentraland Builder Utils init succesfull \n------------------------------------------")
            console.log("localStorageObj: ", this.getLocalStoreObject());
            console.log("state: ", this.getState());
            console.log("projectId: " + this.getProjectId());
            console.log("project: ", this.getProject());
            console.log("sceneId: " + this.getSceneId())
            console.log("scene: ", this.getScene());
            console.log("groups: ", this.getAllGroups());
            console.log("---------------------------------------------")

        },

        // Requires React
        getState: function() {
             return $r.state.store.getState();
        },

        getProjectId: function() {
            return location.pathname.split("/").pop(); // always find the most current project
        },

        getProject: function() {
            var ls = this.getLocalStoreObject();
            var pID = this.getProjectId();
            return ls.project.data[ pID ];
        },

        // Requires React
        getSceneId: function() {
            return this.getState().project.data[this.getProjectId()].sceneId
        },

        // Requires React
        getScene: function() { 
            return $r.state.storeState.scene.present.data[this.getSceneId()];
        },

        getParcelMetrics: function() {
            var p = this.getProject();
            var parcelSize = 16
            var maxX = p.layout.rows * parcelSize;
            var maxZ = p.layout.cols * parcelSize;
            return {
                maxX,
                maxZ,
                center: {
                    x: maxX / 2,
                    y: 0,
                    z: maxZ / 2
                }
            }
        },

        // utility function that outputs the state of this component to the console
        getComponent: function (id) {
            var c = this.getScene().components[id];
            //console.log("getComponent1 id: " + id + " data:", c.data);
            return c
        },

        //returns the transform component if passed a full entity [compoentId, componentTransformId]
        getComponentFromEntity: function (entityId) {
            var transformComponentId = this.getScene().entities[entityId].components[1];
            return this.getComponent(transformComponentId);
        },

        /**
         * returns the component[0] of a given entity
         * or if no parameter is passed of the currently selectedEntity
         * @param {*} entityId 
         */
        getComponentType: function (entityId) {
            var scene = this.getScene();
            var eID = entityId || this.getSelectedEntity();
            var ent = scene.entities[eID];
            return scene.components[ ent.components[0] ]
        },

        getSelectedEntity: function() {
            return this.getState().editor.selectedEntityId;
        },

        // returns an array with the current entities
        getEntities: function() {
            return Object.keys(this.getScene().entities);
        },

        /**
         * utility function to find all new entities inserted by a script
         * to be able to group them if you want
         * you need to remember to save the current entities array before doing any duplication
         * save it like this
         *      var oldEntites = Object.keys(this.getScene().entities);
         * then at the end of all the operations use this function to find the new ones
         * @param {Array of Strings} oldEntities 
         */
        getNewerEntities: function ( oldEntities ) {
            var updatedEntities = this.getEntities();
            return updatedEntities.filter( eID => (oldEntities.includes(eID) == false))
        },


        ///////////////     REACT ACTIONS

        // launch like this // $r.state.store.dispatch( action_updateTransform(componentId, {x: 8, y:0, z:8} ));
        
        action_updateTransform: function (componentId, position, rotation) {
            var sceneId = this.getSceneId();
            var data = { position, rotation }

            // If rotation is null I add the default no transformation quaternion
            if (!data.rotation) data.rotation = { x: 0, y: 0, z: 0, w: 1 };
        
            return {
                type: "Update transform",
                payload: {
                    sceneId: sceneId,
                    componentId: componentId,
                    data: data
                }
            }
        },

        action_selectEntity: function (entityId) {
            return { 
                type: "Select entity", 
                payload: { entityId: entityId }, 
            }
        },

        action_duplicateEntity: function () {
            return {
                type: "Duplicate item",
                payload: {}
            }   
        },

        action_provisionScene: function() {
            var sceneId = this.getSceneId();
            // get scene from localStorage rather than the state (through this.getScene()) because we might want to manipulate the localStoreObject like in importGroup
            var lsObj = this.getLocalStoreObject();
            var scene = lsObj.scene[sceneId];

            return {
                type: "Provision scene",
                payload: {
                    newScene: scene
                }
            }
        },

        action_deleteEntity: function() {
            // uses the currently selected entity to delete it
            return {
                type: "Delete item",
                payload: {}
            }
        },



        ///////////////     MANIPULATE

        /**
         * this selects the entity in the editor so you can also for instance duplicate it programmatically
         * however consider that you also have the custom getComponentFromEntity which will return the transform component of a given entity
         * @param {String} entityId 
         */
        selectEntity: function( entityId ) {
            $r.state.store.dispatch( this.action_selectEntity( entityId )); 
            // normally the editor would do a 'Update transform' action to show the selected glow but we don't care
        },


        duplicateEntity: function ( entityId ) {
                if (this.getSelectedEntity() != entityId) this.selectEntity (entityId);
                $r.state.store.dispatch( this.action_duplicateEntity());
        },


        deleteEntity: function( entityId ) {
            this.selectEntity ( entityId );
            $r.state.store.dispatch( this.action_deleteEntity());
        },

        // Requires React - TODO -  do a move and Rotate that modifies the localStorage
        moveTo: function (componentId, newPos) {

           // retrive current rotation
           var component = this.getScene().components[componentId];
           var rotation = component.data.rotation

            // do the actual moving with React or localStorage
            $r.state.store.dispatch( this.action_updateTransform( componentId, newPos, rotation )); 
        },

        /** Requires React - TODO -  do a move and Rotate that modifies the localStorage
         * Rotate a single component
         * can receive a quaternion {x,y,z,w} or a vector 3 representing euler angles in radians {x,y,z} // = full circle 0 -> 2*Math.PI
         * usage: 
         * D.rotateTo(componentId,{x:0, y:0, z:Math.PI})  // eg turns upside down on one axis
         * @param {String} componentId 
         * @param {Vector3|Quaternion} newRot 
         */
        rotateTo: function (componentId, newRot){
            
            // I'm passing only the rotation retrieve the current position
            var component = this.getScene().components[componentId];
            var position = {
                x: component.data.position.x,
                y: component.data.position.y,
                z: component.data.position.z
            }
            
            // verify if it has the w component it's a quaternion ready to go, otherwise convert it with normalizeRotation
            var finalRot = (!newRot.w) ? this.utils.normalizeRotation(newRot): newRot;
    
            //console.log("rotateTo      euler: ", newRot)
            //console.log("rotateTo quaternion: ", finalRot)

            // do the actual rotation
            $r.state.store.dispatch( this.action_updateTransform( componentId, position, finalRot ));
        },

        /**
         * Moves the component relative to its current position by the amounts found in positionOffset {x:10, y:0 z:-2}
         * @param {String} componentId 
         * @param {Vector3} positionOffset 
         */
        shiftByAmount: function(componentId, positionOffset) {
            var component = this.getScene().components[componentId];
            var newPosition = {
                x: component.data.position.x + positionOffset.x,
                y: component.data.position.y + positionOffset.y,
                z: component.data.position.z + positionOffset.z
            }
            this.transform( componentId, newPosition, component.data.rotation ) // reuse the current rotation
        },

        /**
         * moves all elements by a certain amount.
         * it allows you to move the whole group to a new center mantaining the relative position of all elements among themselves
         * Decentraland uses the lower left corner as 0,0,0
         * usage:
         * D.shiftEntitiesByAmount(5,0,0, 'carpets')
         * @param {Number} xOffset 
         * @param {Number} yOffset 
         * @param {Number} zOffset 
         * @param {String} [groupName] optional
         */
        shiftEntitiesByAmount: function (xOffset, yOffset, zOffset, groupName) {
            var scene = this.getScene() 
            var entities = scene.entities; // this returns the object
            var entitiesArr = (groupName) ? this.getGroup(groupName).entities : Object.keys(entities);
            console.log("shiftEntitiesByAmount  - iteraring over entitiesArr: ", entitiesArr);

            for (var i in entitiesArr) {
                //var entity = entitiesArr[eID];
                //var componentId = entity.components[1] // entities are [componentObject, componentTransform] and we want to modify only the transform
                //var component = scene.components[componentId]
                var entityId = entitiesArr[i]
                var component = this.getComponentFromEntity(entityId)

                // TODO >  if component == undefined (might have been deleted by hand from the scene) > then delete it's entity from the group too

                // find offset from current center in y so that we are simply overwriting x and z
                var newX = component.data.position.x + xOffset
                var newY = component.data.position.y + yOffset
                var newZ = component.data.position.z + zOffset
                var newPos = {x: newX, y: newY, z: newZ};

                // do the moving
                this.moveTo (component.id, newPos);         
            }  
        },

        
        //simple Wrapper for moving all entities without groupname
        shiftAllByAmount: function (xOffset, yOffset, zOffset) {
            this.shiftEntitiesByAmount(xOffset, yOffset, zOffset);
        },

        /**
         * performs both a move and Rotate together instead of in 2 separate steps
         * @param {Vector3} position - {x:Number, y:Number, z:Number}
         * @param {Vector3|Quaternion} rotation - {x,y,z} angles in Radians OR Quaternion {x,y,z,w}
         */
        transform: function (componentId, position, rotation) {
            var finalRot = this.utils.normalizeRotation(rotation) // converts or returns the quaternion
            // do the actual moving
            $r.state.store.dispatch( this.action_updateTransform( componentId, position, finalRot ));
        },

        

        ///////////////     GROUPS
        
        /** OK
         * it's better to store entities ID (future proof) rather than directly only the transform objects (faster)
         * automatically stores them also on localstorage
         * @param {string} name 
         * @param {Array} entities 
         * usage test:
         * testEntityId1 = "dc57444e-a119-43c9-b9e1-4d7a62ea18a6"
         * testEntityId2 =  "0992ae47-c4f9-46f4-befe-e7d7f934c56d"
         * D.createGroup("testGroup", [testEntityId1, testEntityId2])
         * 
         * LocalStorage.builder-scene-groups = { 
         *          sceneId: "abc",
         *          groups: { name: "groupName", entities: [] }
         * }
         * while in this.groups we only save the groups
         *      this.groups = LocalStorage.builder-scene-groups.groups
         * 
         * TODO - evaluate if you want to add also the sceneId to each group
         */
        createGroup: function(name, entities) {
            this.groups[name] = { name, entities }  //basic
            this.saveGroupsToLocalStorage();        // persist them to localStorage
        },

        // OK - returns the group object
        getGroup: function(name) {
            // find in local Storage if it doesn't exist in this scope
            if (!this.groups[name]) {
                var sceneId = this.getSceneId();
                var gLS = this.getLocalStoreObject( this.localStorageGroupKey );
                var group = gLS[sceneId].groups[name];

                if (group != undefined) this.groups[name] = group; //adds it as a local object too
                else { 
					console.log("GetGroup: no group '" + name + "' was found in localStore");
					return undefined;
                }
            }
            return this.groups[name]//.entities; // return the local objects TODO - do you want to return the localStoreObject instead?
        },

        //OK retrieves them from localStorage - used for saving purposes
        getAllGroups: function() {
            var groupStorage = this.getLocalStoreObject( this.localStorageGroupKey );
            
            if (!groupStorage) {
                console.log("there is no '" + this.localStorageGroupKey + "' key in the localStorage!")
                this.setLocalStoreObject( this.localStorageGroupKey, {});
                return;
            }

            var sceneGroups = groupStorage[ this.getSceneId() ];
            if (sceneGroups != undefined) this.groups = sceneGroups.groups;
            return sceneGroups;
        },

        /** OK
         * saves all groups to localStorage
         * LocalStorage.builder-scene-groups[sceneId] = {sceneId: "", groups: { name:{name:String, entities:[]} } } 
         * */
        saveGroupsToLocalStorage: function() {
            var sceneId = this.getSceneId()
            var gLS = this.getLocalStoreObject( this.localStorageGroupKey ); // retrieve existing
            
            // if no builder-scene-groups key exists in localStorage
            if (!gLS) {
                var gLS = {}
                gLS[sceneId] = {sceneId: sceneId, groups: []}
            }
            
            // if local storage doesn't have the groups belonging to this scene
            if (!gLS[sceneId]) {
                gLS[sceneId] = {sceneId: sceneId, groups: this.groups}
                console.log(" sceneID didn't exist - created it - gLS: ", gLS);
    
            } else {
                //localStorage DOES have the contents > overwrite the groups
                console.log( " scene ID DOES exist in groups - modify gLS: ", gLS)
                gLS[sceneId].groups = this.groups 
            }
            
            // step2 - add/overwrite what exists for the group in this scene
            this.setLocalStoreObject( this.localStorageGroupKey, gLS )
        },

        /** OK 
         * usage:
         * D.addEntityToGroup('testGroup', "397deb72-e3b7-4f94-bbb8-762d99f1cadf")
        */
        addEntityToGroup: function(groupName, entityId) {
            this.groups[groupName].entities.push(entityId);
            this.saveGroupsToLocalStorage()
        },

        /** OK
         * Allows to group a number of entities according to some conditions.
         * by type/name (if the component's name have a certain string).
         * by position: if the components are in < or > of a certain x and/or y and/or z position 
         * conditions { namePart:String, xCond:String, yCond:String, zCond:String }
         * example conditions:
         * conditionAll { namePart:"Bush", xCond:" <=10 ", yCond:" >2 ", zCond:"<=8"} // or only some of these conditions
         * condition2_some { namePart:"Bush", xCond:" <=10 "} // only Bushes to the right of x=10
         * 
         * if you want to select within a range add the condition like this ">4 && cp.x<10"    
         *  where the "&& cp.x<10" is the dirty hack to check for ranges between 4 and 10
         *  it works because the script uses "cp.x as a reference point to compare
         * condition3 = {xCond:" >=10 && cp.x < 18", zCond: ">30 && cp.z <38"}
         * example:
         * D.groupEntitiesWithConditions('nature_size1', {xCond:">80 && cp.x<88", zCond:">32 && cp.z<40"})
         * @param {*} groupName 
         * @param {{ namePart:String, xCond:String, yCond:String, zCond:String }} conditions 
         */
        groupEntitiesWithConditions: function( groupName, conditions ) {
            var entities = this.getScene().entities;
            var components = this.getScene().components
            var retEntities = [];
            
            for (var eID in entities) {
                var e = entities[eID];
                var idCompType = e.components[0] // the type is always index 0
                var idCompTranform = e.components[1];
                
                // verify the name condition
                var hasNameCondition = conditions.hasOwnProperty('namePart');
                var nameCondition = false;
                var comp = components[ idCompType ];
                if( hasNameCondition && (comp.type == 'GLTFShape') && (comp.data.src.indexOf( conditions.namePart ) != -1)) {
                    nameCondition = true; // this entity passes the name condition,
                    //console.log("\nentity: " + eID + " - comp.id: " + comp.id + " - comp.type: " + comp.type + " - name: " + comp.data.src.split('/').pop());
                    //console.log("check it's transform comp: " + idCompTranform);
                }
                
                // verify all other conditions
                if (!hasNameCondition || (hasNameCondition && nameCondition == true)){
                    comp = components[ idCompTranform ]; //check transform obj
                    var cp = comp.data.position;
                    //console.log("comp: ", comp)
                    //console.log("cp: ", cp)

                    var hasX = conditions.hasOwnProperty('xCond');
                    var hasY = conditions.hasOwnProperty('yCond');
                    var hasZ = conditions.hasOwnProperty('zCond');
                    
                    // short          hasNot  OR  has_the_condition +  CurrentPos  < 10
                    var xCondition = ( !hasX || ( hasX && eval(cp.x + conditions.xCond)) ) ? true : false ;
                    var yCondition = ( !hasY || ( hasY && eval(cp.y + conditions.yCond)) ) ? true : false ;
                    var zCondition = ( !hasZ || ( hasZ && eval(cp.z + conditions.zCond)) ) ? true : false ;
                    //console.log("xCondition: " + xCondition + " - yCondition: " + yCondition + " - zCondition: " + zCondition);
                    
                    if (xCondition && yCondition && zCondition) {
                        retEntities.push(eID)   // component passes all requirements add them to the list
                        console.log("\nadding entity " + eID )
                        console.log("component type: ", components[idCompType])
                        console.log("component transform: ", comp)
                    }
                }
            } 

            // done > create the group
            this.createGroup( groupName, retEntities );
            console.log(" Group '" + groupName + "' created with entities: ", retEntities)
        },

        /** OK 
         * duplicates the group by creating a new one and moving all new entities by the amounts set in positionOffset {x,y,z}
         * @param {String} groupName 
         * @param {String} newGroupName 
         * @param {Vector3} positionOffset 
         */
        duplicateGroup: function (groupName, newGroupName, positionOffset) {
            var entToDuplicate = this.getGroup(groupName).entities;
            // since It seems I can't use promises in the console I have to hack this solution
            // 1 register all current entityIDs and then find those that are missing in this array after they have all been created
            var pastEntities = this.getEntities() //Object.keys(this.getScene().entities);

            for (var i in entToDuplicate) {
                var eID = entToDuplicate[i];
                console.log("\n------\nduplicating entity: " + eID + " - currently selected entity: " + this.getSelectedEntity() );
                
                //1 select the entity
                this.selectEntity( eID );
                console.log("1- selected entity: " + this.getSelectedEntity());

                //2 duplicate the entity
                this.duplicateEntity( eID )
            }
            
            // now that all entities are duplicated, diff the entities array
            var newEntities = this.getNewerEntities(pastEntities)
            newEntities.forEach( eID => {
                var comp = this.getComponentFromEntity (eID)
                this.shiftByAmount(comp.id, positionOffset );
            })

            /* This worked but I've refactored it to the above case which is more compact
            var newEntities = []
            var updatedEntities = this.getEntities() //Object.keys(this.getScene().entities);
            updatedEntities.forEach( eID => { 
                console.log("looking at eID: " + eID);
                if ( pastEntities.includes( eID ) == false ) {
                    newEntities.push(eID)   // add to array
                    console.log("\t new ID found - adding it to the array: " + eID);
                    // move the component
                    var comp = this.getComponentFromEntity (eID)
                    this.shiftByAmount(comp.id, positionOffset );
                }
            });
            */
            console.log("newEntities: ", newEntities);
            this.createGroup( newGroupName, newEntities);
            console.log("finished creating group '" + newGroupName + "' - with entities: " + this.getGroup(newGroupName).entities);
        },
        
        /** OK 
         * deletes the entities and the reference to the group itself
         * @param {String} groupName 
         */
        deleteGroup: function (groupName) {
            var entitiesToDelete = this.getGroup(groupName).entities;
            for (var i in entitiesToDelete) {
                var eID = entitiesToDelete[i];
                this.deleteEntity( eID );
            }
            delete this.groups[groupName]; 
            this.saveGroupsToLocalStorage()
        },

        /** OK
         * deletes the object that contains the references to the entity both in this.groups and in localstorage
         * but does not delete the entities themselves
         * @param {String} groupName 
         */
        deleteGroupReference: function (groupName) {
            var groupToDelete = this.groups[ groupName ];
            console.log("deleting references of group '" + groupToDelete.name);
			delete this.groups[ groupName ]
            this.saveGroupsToLocalStorage();
        },



        
        ///////////////      IMPORT-EXPORT

        /**
         * usage: without key will retrieve the builder information stored in LocalStorage
         * by passing a key you can retrieve the specific object to find for example the groups
         * @param {String} [key] - optional
         */
        getLocalStoreObject: function (key) {
            var lsKey;
            // if nothing is passed find the appropriate builder storage key
            if (!key && !this.localStorageKey) {
                if      (localStorage.getItem('builder-storage') != null ) lsKey = 'builder-storage'
                else if (localStorage.getItem('builder') != null ) lsKey = 'builder'
                this.localStorageKey = lsKey;
            }
            lsKey = (!key) ? this.localStorageKey : key;
            
            var lsObj = JSON.parse(localStorage.getItem( lsKey ))
            //console.log(lsKey + " : ", lsObj)
            return lsObj
        },


        setLocalStoreObject: function (key, obj) {
            localStorage.setItem(key, JSON.stringify(obj) );                 // overwrite local storage
        },

        /** 
         * exports a custom object with the minimal information that you can use to import back again
         * it also adds the groups if you have any
         * by default it copies the output to clipboard that you can then copy paste into a variable 
         * or into a file
         * the object looks like this {project, scene, groups}
         */
        exportProject: function(){
            var builderStorage = this.getLocalStoreObject(); //JSON.parse(localStorage.getItem( this.localStorageKey ))
            var DCLBuilderProject = {
                project: this.getProject(),
                scene: builderStorage.scene.present.data[ this.getSceneId() ], //this.getScene() gests it from react but we want the localStorage version,
                groups: this.getAllGroups() //this.groups
            }
            copy(JSON.stringify(DCLBuilderProject)); // copy to clipboard
            console.log("Project " + this.getProject().title + " >> succesfully exported to clipboard as String and returned as the object \n> now go and import it into the builder or save it in a file")
            return DCLBuilderProject;
        },

        // full backup, not just the current project - TODO create an importALLprojects
        exportAllProjects: function() {
            var builderStorage = this.getLocalStoreObject(); // this will also make available this.localStorageKey if undefined so it's better to leave it here
            var exportObj = {}
            exportObj[ this.localStorageKey ] = builderStorage;
            exportObj[ this.localStorageGroupKey ] = this.getLocalStoreObject( this.localStorageGroupKey );
            copy(JSON.stringify(exportObj)); // copy to clipboard
            console.log("All project succesfully exported to clipboard as String and returned as the object \n> now go and import it into the builder or save it in a file")
            return exportObj;
        },

        /**
         * imports from the custom simplified object created with exportProject()
         * use this as testing object to see if you imported the groups too     
            var groups: {
                    groupName1: {name: "groupName1", entities:[1,2,3]},
                    groupName2: {name: "groupName2", entities:[3,4,5]},
                    carpets:    {name: "carpets"   , entities:[1,2,3]}
            }
         */
        importProject: function( projectToImport ){
            var builderStorage = this.getLocalStoreObject();

            // check for collisions in projects and ask the user to confirm overwriting it
            if( builderStorage.project.data[ projectToImport.project.id ] != null ) {
                var warningString = "WARNING! \nthere is already a project \nID " + projectToImport.project.id + "\ntitle: " + projectToImport.project.title + "\n are you sure you want to Overwrite the current project?"
                console.log(warningString);
                var conf = confirm( warningString );
                if (conf == false) {
                    console.log("**** IMPORT STOPPED - nothing was overwritten *****");
                    return
                 }
            } 

            console.log("adding / overwriting project " + projectToImport.project.id + " - " + projectToImport.project.title );
            builderStorage.project.data[projectToImport.project.id] = projectToImport.project;      // add the project
            builderStorage.scene.present.data[projectToImport.scene.id] = projectToImport.scene     // add the scene
            localStorage.setItem(this.localStorageKey, JSON.stringify(builderStorage) );                 // overwrite local storage

            // import the groups too if any
            if (projectToImport.groups != undefined) this.importProjectGroups( projectToImport )

            // TODO find another way to refresh rather than realoading? via react?
            location.reload()
        },

        /**
         * PRIVATE function this should not be called directly. it is a convenient wrapper to simplify the importProject()
         * if called alone you should perform a location.reload() at the end
         * @param {Object} projectToImport 
         */
        importProjectGroups: function( projectToImport ) {
            var sceneId = this.getSceneId();
            var gLS = this.getLocalStoreObject( this.localStorageGroupKey ); // retrieve existing
            var groupsToImport = projectToImport.groups.groups // because I'm saving the whole object that includes the sceneId

            // verify that the sceneId to import == the currentSceneId /// This probably never happens
            if (projectToImport.groups.sceneId != sceneId) {
                console.log("you are trying to import the groups into a wrong project");
                return;
                /*
                var conf = confirm ("you are trying to import the groups into a wrong project. are you sure?")
                if (conf == false) {
                    console.log("no groups have been imported")
                    return;
                }
                */
            }

            // 1- verify if local storage exists and create it if not (then in stage2 simply insert everything in projectToImport.groups
            if (!gLS) {
                var gLS = {}
                console.log("importProjectGroups - No " + this.localStorageGroupKey + " found in localStorage! going to create it and add the contents")
            }
            
            // 2- localStorage exists - but doesn't have the current sceneId > create it and dump the contents
            if (!gLS[sceneId]) {
                //gLS[sceneId] = {sceneId: sceneId, groups: projectToImport.groups }
                this.groups = groupsToImport;
                this.saveGroupsToLocalStorage();
                console.log("importProjectGroups - the current scene " + sceneId + " didn't exist or have groups. I created it with the imported project groups: ", groupsToImport);
            
            // 3-   localStorage exists AND the current group[sceneId] Does have content > ask for confirmation to overwrite it
            } else {
                var currentGroups = Object.keys( gLS[sceneId].groups );
                var importGroups  = Object.keys( groupsToImport );
                var warningString =  "WARNING! \nthe current project already has some groups!"
                warningString  += "\n " + currentGroups.length + " groups in the localStore:        " + currentGroups
                warningString  += "\n " + importGroups.length  + " groups in the project To Import: " + importGroups
                warningString  += "\nAre you sure you want to overwrite it?";

                console.log(warningString);
                var conf = confirm( warningString );
                if (conf == false) {
                    console.log("importProjectGroups - groups were NOT imported *****");

                } else {
                    //gLS[sceneId].groups = projectToImport.groups;
                    console.log("importProjectGroups - groups successfully imported *****");
                    this.groups = groupsToImport
                    this.saveGroupsToLocalStorage();        // persist it
                }

            }
        },

        /** works to import the objects into localstorage, but requires a page reload to make changes effective
         * Allows to import from another scene a group of entities (and it's components)
         * this assumes that you already have the project scene imported in the same builder editor
         * this does not allow to just import into the current project from a saved backup file
         * if you want to do that use importGroupFromExportedProject()
         * TODO - refactor it so that the parameters are (groupName. fromSceneOrObject) and it has a different behavior if the second parameter is a string (sceneID) or an object (projectToImport)
         * @param {String} sceneId 
         * @param {String} groupName 
         */
        importGroup: function (fromSceneId, groupName) {
             //1 read the list of entities form the group
            var gLS = this.getLocalStoreObject( this.localStorageGroupKey );
            var group = gLS[fromSceneId].groups[groupName];
            var entitiesToImport = group.entities;

            var lsObj = this.getLocalStoreObject();
            var sceneOrigin = lsObj.scene.present.data[ fromSceneId ] //.entities   & .components
            var sceneDestination = lsObj.scene.present.data[ this.getSceneId() ]
            console.log("copy group '" + groupName + "' from scene id " + fromSceneId + " >> to scene id: " + sceneDestination.id );
            console.log("current scene metrics: ", sceneDestination.metrics);

            //2 loop the scene.entities from localstorage
            for (i in entitiesToImport) {
            //for (var i=0; i < 1; i++) { /// TEST temporarily I try to import only 1 object
                var eID = entitiesToImport[i];
                
                // read the components that are part of this entity
                var rEntity = sceneOrigin.entities[eID]
                var compTypeID      = rEntity.components[0] 
                var compTransformID = rEntity.components[1]
                
                //3- add the entity and all components of those entities
                sceneDestination.entities[eID] = rEntity
                sceneDestination.components[compTypeID]      = sceneOrigin.components[compTypeID];
                sceneDestination.components[compTransformID] = sceneOrigin.components[compTransformID];
                console.log("\nwriting to destination scene " +this.getSceneId() + "\nadded entity " + eID );
                console.log("added components \n" + compTypeID + " (type) and \n" + compTransformID + " (transform) \nto destination scene: ",sceneDestination)
            }

            //4- copy the group also in the groups of the current scene
            gLS[ this.getSceneId() ].groups[groupName] = group;

            //5- save localStorage and reload
            console.log("going to write this to LocalStorage group: ", gLS);
            console.log("going to write this to LocalStorage scene: ", lsObj);
            this.setLocalStoreObject( this.localStorageGroupKey,  gLS)
            this.setLocalStoreObject( this.localStorageKey,  lsObj)
            console.log("scene metrics after update: ", lsObj.scene.present.data[ this.getSceneId() ].metrics);

            // reload page (probably more appropriate as it will update the metrics) 
            // $r.state.store.dispatch( this.action_provisionScene() ); // doesn't work
            location.reload();
        },
        // var sceneIDToImportFrom = "12662434-e357-487e-b2d2-3b72d9fae0df"
        // var groupToImport = "floatingObject"
        // D. importGroup (sceneIDToImportFrom, groupToImport);

        /**
         * wapper to importGroup that allows you to import all elements from a string object
         * @param {Object} projectToImport 
         */
        importGroupFromExportedProject: function ( projectToImport, groupName ) {
            //var p = projectToImport;
            //var originSceneId = p.groups.sceneId;

            var group = projectToImport.groups.groups[groupName];
            var entitiesToImport = group.entities;

            var lsObj = this.getLocalStoreObject();
            var sceneOrigin = projectToImport.scene; //.entities   & .components
            var sceneDestination = lsObj.scene.present.data[ this.getSceneId() ]

            for (i in entitiesToImport) {
                var eID = entitiesToImport[i];

                // read the components that are part of this entity
                var rEntity = sceneOrigin.entities[eID]
                var compTypeID      = rEntity.components[0] 
                var compTransformID = rEntity.components[1]

                //3- add the entity and all components of those entities
                sceneDestination.entities[eID] = rEntity
                sceneDestination.components[compTypeID]      = sceneOrigin.components[compTypeID];
                sceneDestination.components[compTransformID] = sceneOrigin.components[compTransformID];
            }

            //4- copy the group also in the groups of the current scene
            var gLS = this.getLocalStoreObject( this.localStorageGroupKey );
            if (!gLS[ this.getSceneId() ]) this.saveGroupsToLocalStorage() //this.setLocalStoreObject ( this.localStorageGroupKey, {})
            gLS[ this.getSceneId() ].groups[groupName] = group;

            //5- save localStorage and reload
            console.log("going to write this to LocalStorage group: ", gLS);
            console.log("going to write this to LocalStorage scene: ", lsObj);
            this.setLocalStoreObject( this.localStorageGroupKey,  gLS)
            this.setLocalStoreObject( this.localStorageKey,  lsObj)
            
            // reload page (probably more appropriate as it will update the metrics) 
            // $r.state.store.dispatch( this.action_provisionScene() ); // doesn't work
            //location.reload();
            console.log("Group '" + groupName + "' imported - Reload the page to see the changes")

        },

        //////////////////////// UTILITIES

        utils: {
            randomIntBetween:   function (min,max) { return Math.floor(Math.random()*(max-min+1)+min); },
            randomFloatBetween: function (min,max) { return Math.random()*(max-min+1)+min;},

            /**
             * converts Vector3 Rotations to Quaternions
             * @param {*} rotation 
             */
            normalizeRotation: function(rotation ) {
                if (!rotation.w ) {
                    // the input rotation is a Vector3 > convert it to Quaternion
                    // it's a YXZ     Yaw = y, Pitch = x, Roll = z
                    return BABYLON.Quaternion.RotationYawPitchRoll(rotation.y, rotation.x, rotation.z)
                } else {
                    return rotation
                } 
            },

            // returns the unitary quaternion that resets any rotation
            // D.rotateTo( D.getComponentFromEntity(D.getSelectedEntity()).id, D.utils.getResetRotation() )
            getResetRotation: function() { return {x:0, y:0, z:0, w:1} },

            // returns a quaternion with randomized values
            getRandomRotation: function() {
                // rotation goes from Max: 2*Math.PI
                var max = 2*Math.PI;
                var rot = {
                    x: this.randomFloatBetween(0,max),
                    y: this.randomFloatBetween(0,max),
                    z: this.randomFloatBetween(0,max),
                }
                //console.log("random rot euler: ", rot)
                var rotQuaternion = this.normalizeRotation( rot );
                //console.log("random rot quaternion: ", rotQuaternion)
                return rotQuaternion;
            },

            
        },

        view: {
            top:    function() { window.editor.setCameraRotation( -Math.PI/2, 0 ) },
            front:  function() { window.editor.setCameraRotation( -Math.PI/2, 2 ) },
            left:   function() { window.editor.setCameraRotation(  Math.PI  , 2 ) },
            right:  function() { window.editor.setCameraRotation(  Math.PI/2, 2 ) },
            V3D:    function() { window.editor.setCameraRotation(  -3/4*Math.PI, 1 ) },
        }



};
window.D = DCLBuilderUtils;
D.init();
