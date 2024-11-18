import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object, animations) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            });
        }

        function createEmoteCallback(animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }

        // Create the graphical user interface
        this.gui = new GUI({ hideable: false });

        // Create the lights folder
        const lightsFolder = this.gui.addFolder("Lights");

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: "#" + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.addColor(ambientColor, "color").onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(lights.object.ambientLight, "intensity", 0.0, 1.0, 0.01);

        // Create point light #1 folder
        const directionalLight1Folder = lightsFolder.addFolder("Directional light #1");
        const directionalLight1 = lights.object.directionalLight1;
        const pointColor1 = { color: "#" + new THREE.Color(directionalLight1.color).getHexString() };
        directionalLight1Folder.addColor(pointColor1, "color").onChange(color => colorCallback(directionalLight1, color));
        directionalLight1Folder.add(lights.object.directionalLight1, "intensity", 0.0, 2.0, 1.0);
        directionalLight1Folder.add(lights.object.directionalLight1, "distance", 0.0, 20.0, 0.01);
        directionalLight1Folder.add(lights.object.directionalLight1.position, "x", -10.0, 10.0, 0.01);
        directionalLight1Folder.add(lights.object.directionalLight1.position, "y", 0.0, 20.0, 0.01);
        directionalLight1Folder.add(lights.object.directionalLight1.position, "z", -10.0, 10.0, 0.01);

        // Create point light #2 folder
        const directionalLight2Folder = lightsFolder.addFolder("Directional light #2");
        const directionalLight2 = lights.object.directionalLight2;
        const pointColor2 = { color: "#" + new THREE.Color(directionalLight2.color).getHexString() };
        directionalLight2Folder.addColor(pointColor2, "color").onChange(color => colorCallback(directionalLight2, color));
        directionalLight2Folder.add(lights.object.directionalLight2, "intensity", 0.0, 2.0, 1.0);
        directionalLight2Folder.add(lights.object.directionalLight2, "distance", 0.0, 20.0, 0.01);
        directionalLight2Folder.add(lights.object.directionalLight2.position, "x", -10.0, 10.0, 0.01);
        directionalLight2Folder.add(lights.object.directionalLight2.position, "y", 0.0, 20.0, 0.01);
        directionalLight2Folder.add(lights.object.directionalLight2.position, "z", -10.0, 10.0, 0.01);

        // Create the shadows folder
        const shadowsFolder = this.gui.addFolder("Shadows");
        shadowsFolder.add(renderer.shadowMap, "enabled").onChange(enabled => shadowsCallback(enabled));

        // Create the fog folder
        const fogFolder = this.gui.addFolder("Fog");
        const fogColor = { color: "#" + new THREE.Color(fog.color).getHexString() };
        fogFolder.add(fog, "enabled").listen();
        fogFolder.addColor(fogColor, "color").onChange(color => colorCallback(fog.object, color));
        fogFolder.add(fog.object, "near", 0.01, 1.0, 0.01);
        fogFolder.add(fog.object, "far", 1.01, 20.0, 0.01);

        // Create the character folder
        const characterFolder = this.gui.addFolder("Character");

        // Create the emotes folder and add emotes
        const emotesFolder = characterFolder.addFolder("Emotes");
        const callbacks = [];
        for (let i = 0; i < animations.emotes.length; i++) {
            createEmoteCallback(animations, animations.emotes[i]);
        }

        // Create the expressions folder and add expressions
        const expressionsFolder = characterFolder.addFolder("Expressions");
        const face = object.getObjectByName("Head_4");
        const expressions = Object.keys(face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.show();
        }
        else {
            this.gui.hide();
        }
    }
}