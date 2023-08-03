import * as BABYLON from '@babylonjs/core';
import * as GlobalVar from './global_var';

export function Move(beginFrame, toFrame, fromPos, toPos) {
    const animation = new BABYLON.Animation(
        '',
        'position',
        GlobalVar.FPS,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const animationKeys = [];
    if (beginFrame > 0){
        animationKeys.push({
            frame: 0,
            value: fromPos
        });
    }
    animationKeys.push({
        frame: beginFrame,
        value: fromPos
    });
    animationKeys.push({
        frame: toFrame,
        value: toPos
    });
    animation.setKeys(animationKeys);
    return animation;
}

export function Rotate(beginFrame, toFrame, fromRot, toRot) {
    const animation = new BABYLON.Animation(
        '',
        'rotation',
        GlobalVar.FPS,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const animationKeys = [];
    if (beginFrame > 0){
        animationKeys.push({
            frame: 0,
            value: fromRot
        });
    }
    animationKeys.push({
        frame: beginFrame,
        value: fromRot
    });
    animationKeys.push({
        frame: toFrame,
        value: toRot
    });
    animation.setKeys(animationKeys);
    return animation;
}

export function RunSequentAnimation(scene, obj, animationArray, fromFrame, toFrame) {
    if (animationArray.length == 1) {
        scene.beginDirectAnimation(obj, animationArray, fromFrame, toFrame, false);
        return;
    }
    var animationTemp = [animationArray[0]];
    var animationArrayTemp = animationArray.slice();
    animationArrayTemp.shift();
    scene.beginDirectAnimation(obj, animationTemp, fromFrame, toFrame, false, RunSequentAnimation(scene, obj, animationArrayTemp, fromFrame, toFrame));
}