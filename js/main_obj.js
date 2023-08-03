import * as BABYLON from '@babylonjs/core';
import * as GlobalVar from './global_var';

export function CreateTrainObj(position, rotation, color) {
    var obj = new BABYLON.MeshBuilder.CreateBox('MainObj', {
            size: 1,
            width: 1,
            height: 0.5,
            depth: 0.5,
        });
    obj.position = position;
    obj.rotation = rotation;
    var objMaterial = new BABYLON.StandardMaterial();
    obj.material = objMaterial;
    objMaterial.diffuseColor = color;
    return obj;
}

export function CreateStation(position, rotation, color) {
    var obj = new BABYLON.MeshBuilder.CreateBox('MainObj', {
        size: 0.5,
        width: 5,
        height: 2,
        depth: GlobalVar.RAIL_DISTANCE * 2,
    });
    obj.position = position;
    obj.rotation = rotation;
    var objMaterial = new BABYLON.StandardMaterial();
    obj.material = objMaterial;
    objMaterial.diffuseColor = color;
    objMaterial.alpha = 0.5;
    return obj;
}