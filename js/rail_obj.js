import * as BABYLON from '@babylonjs/core';

export function CreateRailObj(position, rotation, length, color) {
    var obj = new BABYLON.MeshBuilder.CreateBox('RailObj', {
            size: 10,
            width: length,
            height: 0.1,
            depth: 0.5  
        });
    obj.position = position;
    obj.rotation = rotation;
    var objMaterial = new BABYLON.StandardMaterial();
    obj.material = objMaterial;
    objMaterial.diffuseColor = color;
    return obj;
}