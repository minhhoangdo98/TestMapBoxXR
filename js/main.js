import * as BABYLON from '@babylonjs/core';
import {CreateStation, CreateTrainObj} from "./main_obj.js"
import {CreateRailObj} from "./rail_obj.js"
import * as AnimationControll from "./animation_controll.js"
import * as GlobalVar from './global_var';
import mapboxgl from 'mapbox-gl'; 
import "@babylonjs/loaders/glTF";

mapboxgl.accessToken = 'pk.eyJ1IjoibWluaGhvYW5nZG85OCIsImEiOiJjbGtjYmJ5enAwNGcwM2Rxam5jaTB6NXhvIn0.3abl-YTSO-C_FhfKnboq4Q';
let center =  [106.62542965907438, 10.854184491836564];

let map = (window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 20,
    center : center,
    pitch: 70,
    antialias: true,
    // interactive: false //disable for custom key control
}));

let world;
function computeWorld() {
    let rotateX = Math.PI / 2, rotateY = Math.PI / 1.25, rotateZ = 0;
    let mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        center,
        0
    );
    world = BABYLON.Matrix.Identity().setTranslationFromFloats(mercatorCoordinate.x, mercatorCoordinate.y, mercatorCoordinate.z);
    let scaleFactor = mercatorCoordinate.meterInMercatorCoordinateUnits();
    let scale = BABYLON.Matrix.Scaling( scaleFactor, -scaleFactor, scaleFactor);
    world = scale.multiply(world);
    world = BABYLON.Matrix.RotationX(rotateX).multiply(world);
    world = BABYLON.Matrix.RotationY(rotateY).multiply(world);
    world = BABYLON.Matrix.RotationZ(rotateZ).multiply(world);
};

async function createScene(engine) {
    computeWorld();
    const scene = new BABYLON.Scene(engine);
        
    scene.createDefaultLight();
    scene.activeCamera = new BABYLON.UniversalCamera('mapbox-Camera', new BABYLON.Vector3(5, 3, -8), scene);
    scene.autoClear = false;
    scene.detachControl();
    var camera = scene.activeCamera;
    camera.attachControl();

    RailTest1(scene);

    var floor = new BABYLON.MeshBuilder.CreateBox('', {
        size: 0.5,
        width: 100,
        height: 0.5,
        depth: 100,
    });
    var objMaterial = new BABYLON.StandardMaterial();
    floor.material = objMaterial;
    objMaterial.alpha = 0.1;

    // const environment = scene.createDefaultEnvironment();
    const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [floor],
        disableTeleportation: true
    });
    const featureManager = xr.baseExperience.featuresManager;
    const movementFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
        xrInput: xr.input,
        // add options here
        movementOrientationFollowsViewerPose: true, // default true
    });

    scene.registerBeforeRender(function () {
        engine.wipeCaches(true);
    })
    return scene;
}

const canvas = document.getElementById('renderCanvas');
let engine;
let scene;
let globalMatrix;

// if (!engine) {
//     engine = new BABYLON.Engine(canvas, true);
// }

// if (!scene) {
//     scene = await createScene(engine);
// }

// engine.runRenderLoop(function() {
//     // if (globalMatrix) {
//     //     let projection = BABYLON.Matrix.FromArray(globalMatrix);
//     //     projection._m = globalMatrix;
//     //     scene.activeCamera.freezeProjectionMatrix(world.multiply(projection));
//     // }
//     scene.render();
//     // engine.wipeCaches(false);
//     // map.triggerRepaint();
// });

// window.addEventListener('resize', function() {
//     engine.resize();
// });

function RailTest1(scene) {
    var trainObj = CreateTrainObj(new BABYLON.Vector3(9, 3, 0), new BABYLON.Vector3(0, 0, 0), new BABYLON.Color3(1, 1, 0));
    var trainObj2 = CreateTrainObj(new BABYLON.Vector3(-30, 3, 0), new BABYLON.Vector3(0, 0, 0), new BABYLON.Color3(0.98, 0.545, 0.078));

    var railObj1 = CreateRailObj(new BABYLON.Vector3(-10, 2.7, 0), new BABYLON.Vector3(0, 0, 0), 40, new BABYLON.Color3(0, 1, 0));
    var railObj2 = CreateRailObj(new BABYLON.Vector3(railObj1.position.x, railObj1.position.y, railObj1.position.z + GlobalVar.RAIL_DISTANCE), new BABYLON.Vector3(0, 0, 0), 40, new BABYLON.Color3(0.412, 0.961, 0.922));
    
    var station = CreateStation(new BABYLON.Vector3(-9, 3, railObj1.position.z + GlobalVar.RAIL_DISTANCE/2), new BABYLON.Vector3(0, 0, 0), GlobalVar.STATION_COLOR)
    
    var cross1 = CreateRailObj(new BABYLON.Vector3(station.position.x, 2.5, station.position.z), GlobalVar.CROSS_ROTATION[0], GlobalVar.RAIL_DISTANCE * 1.5, new BABYLON.Color3(1, 1, 1));
    var cross2 = CreateRailObj(new BABYLON.Vector3(station.position.x, 2.5, station.position.z), GlobalVar.CROSS_ROTATION[1], GlobalVar.RAIL_DISTANCE * 1.5, new BABYLON.Color3(1, 1, 1));
    
    AnimateObjectTest(scene, trainObj);
    AnimateObjectTest2(scene, trainObj2);

    //Cursor hover event
    trainObj.actionManager = new BABYLON.ActionManager(scene);
    trainObj.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){	
        console.log("Test hover");
	}));
}

function AnimateObjectTest(scene, obj) {
    var animationArray = [
        AnimationControll.Move(0, 240, new BABYLON.Vector3(9, obj.position.y, 0), new BABYLON.Vector3(-8, obj.position.y, 0)),
        AnimationControll.Rotate(240, 300, new BABYLON.Vector3(0, 0, 0), GlobalVar.CROSS_ROTATION[0]),
        AnimationControll.Move(300, 480, new BABYLON.Vector3(-8, obj.position.y, 0), new BABYLON.Vector3(-10, obj.position.y, GlobalVar.RAIL_DISTANCE)),
        AnimationControll.Rotate(480, 540, new BABYLON.Vector3(0, Math.PI/4, 0), new BABYLON.Vector3(0, 0, 0)),
        AnimationControll.Move(540, 760, new BABYLON.Vector3(-10, obj.position.y, GlobalVar.RAIL_DISTANCE), new BABYLON.Vector3(-30, obj.position.y, GlobalVar.RAIL_DISTANCE))
    ];
    AnimationControll.RunSequentAnimation(scene, obj, animationArray, 0, 760);
}

function AnimateObjectTest2(scene, obj) {
    var animationArray = [
        AnimationControll.Move(0, 240, new BABYLON.Vector3(-30, obj.position.y, 0), new BABYLON.Vector3(-10, obj.position.y, 0)),
        AnimationControll.Move(480, 760, new BABYLON.Vector3(-10, obj.position.y, 0), new BABYLON.Vector3(9, obj.position.y, 0))
    ];
    AnimationControll.RunSequentAnimation(scene, obj, animationArray, 0, 760);
}

let customLayer = {
    'id': '3d-model',
    'source': 'composite',
    'type': 'custom',
    'renderingMode': '3d',
    onAdd: async function (map, gl) {
        this.map = map;
        if(!engine) {
            engine = new BABYLON.Engine(gl, true);
        }
        window.dispatchEvent(new Event('resize'));
        await createScene(engine).then((sceneLocal) => {
            if(!scene) {
                scene = sceneLocal;
            }
        });
    },
        render: function(gl, matrix) {
            globalMatrix = matrix;
            if(scene) {
                let projection = BABYLON.Matrix.FromArray(matrix);
                projection._m = matrix;
                scene.activeCamera.freezeProjectionMatrix(world.multiply(projection));
                engine.wipeCaches(false);
                scene.render();
            }
            this.map.triggerRepaint();
        }
    };

//For custom controll
// pixels the map pans when the up or down arrow is clicked
const deltaDistance = 100;
     
// degrees the map rotates when the left or right arrow is clicked
const deltaDegrees = 25;
     
function easing(t) {
    return t * (2 - t);
}

map.on("load", function() {
    //Add rail layer
    map.addLayer(customLayer);
    //Add 3d building layer
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']).id;
    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
            ],
            'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );
    //Custom key control
    // map.getCanvas().addEventListener(
    //     'keydown',
    //     (e) => {
    //     e.preventDefault();
    //     if (e.key == "ArrowUp") {
    //         // up
    //         map.panBy([0, -deltaDistance], {
    //         easing: easing
    //         });
    //     } else if (e.key == "ArrowDown") {
    //         // down
    //         map.panBy([0, deltaDistance], {
    //         easing: easing
    //         });
    //     } else if (e.code == "ArrowLeft") {
    //         // left
    //         map.easeTo({
    //         bearing: map.getBearing() - deltaDegrees,
    //         easing: easing
    //         });
    //     } else if (e.code == "ArrowRight") {
    //         // right
    //         map.easeTo({
    //         bearing: map.getBearing() + deltaDegrees,
    //         easing: easing
    //         });
    //     }
    //     },
    //     true
    // );
});
