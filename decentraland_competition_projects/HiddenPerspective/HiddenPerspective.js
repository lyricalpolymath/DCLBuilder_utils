// positions of the camera in editing and preview
// they are different because the builder has different camera settings for the 2 modes
var editingCameraPos = {x:28, y:1.4, z:28 }
var previewCameraPos = {x: 5.11, y: 1.4, z: 5.17}


//	viewFromDCLPerspective() // no parameters goes to default
//	viewFromDCLPerspective(11) // only pow, moves forward the camera
//	viewFromDCLPerspective(10, 1.5) // also with the heigh
function viewFromDCLPerspective (pos, height) {
    var posXZ = pos    || editingCameraPos.x
	    var h     = height || 2

	    window.editor.setCameraPosition({x:posXZ, y:1.4, z:posXZ})
	    window.editor.resetCameraZoom() // brings always to the default zoom

	    // setCameraRotation works in the editor but unfortunately not in preview mode
	    // I need to get the camera object and use the setTarget method camera.setTarget(new BABYLON.Vector3(0, 0, -10));
	    // as can be seen here
	    window.editor.setCameraRotation(-3/4*Math.PI, h)
}


// Switches back and forth between the perspective point and a 3d view that you can use to edit the elements on the stage
// you can also pass a string such as 'top', front, left, right, to see the different views
var viewBool = true
function switchViews (viewStr) {
    var viewName = ( !viewStr ) ? 'V3D' : viewStr;
    (viewBool == true) ? this.viewFromDCLPerspective() : this.view[viewName]();
    viewBool = !viewBool;
}


/// set the camera position while in Preview mode 
// (which has a different camera zoom level that I wasn't able to reproduce)
function viewFromDCLPerspective_inPreview(){
    window.editor.setCameraPosition ( previewCameraPos )
}


/*  SHOW HIDE THE LOGO
// this was used doring development

var logoEntID = "d82c7fe3-979d-4bd2-a111-833c05d0b0ce" // DCL logo entity id
var logoCom = D.getComponentFromEntity(logoEntID)
//var logoPos = D.getComponentFromEntity(D.getSelectedEntity()).data.position

var logoShowBool = true;
function showHideLogo() {
    // switches the visibility by moving it high or down out of the field of view
    var logoPos = {x: 8, y: 0.9285623189963126, z: 8}   //default pos
    var logoPosInvis = {x:logoPos.x, y:-5, z:logoPos.z} //invisible pos
    // switches the current status
    var show = !logoShowBool;
    var newPos = (show == true) ? logoPos : logoPosInvis;
    D.moveTo(logoCom.id, newPos);
    logoShowBool = show; //switches
}
showHideLogo()
*/


////////////// convenience object to quickly accssess the 2 functions

V = {}
V.viewFromDCLPerspective = viewFromDCLPerspective
V.switchViews = switchViews
//V.showHideLogo = showHideLogo

//V.view = D.view  /// gives access to top, left, right, front, V3D
V.view = {
    top:    function() { window.editor.setCameraRotation( -Math.PI/2, 0 ) },
    front:  function() { window.editor.setCameraRotation( -Math.PI/2, 2 ) },
    left:   function() { window.editor.setCameraRotation(  Math.PI  , 2 ) },
    right:  function() { window.editor.setCameraRotation(  Math.PI/2, 2 ) },
    V3D:    function() { 
        		window.editor.setCameraRotation(  -3/4*Math.PI, 1 ) 
        		window.editor.setCameraZoomDelta(30)
    		},
}