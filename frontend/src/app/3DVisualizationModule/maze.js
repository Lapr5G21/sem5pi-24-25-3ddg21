import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {

    constructor(parameters) {

        this.bed  = null;
        this.patient = null;
        this.door = null;
        this.bench = null;
        this.loadedPatient = false;
        this.loadedBed = false;
        this.loadedDoor = false;
        this.loadedBench = false;

        this.onLoad = function (description) {

            const loader = new GLTFLoader();
        
            // Promises para carregar os modelos
            const loadBedPromise = new Promise((resolve, reject) => {
                loader.load("./models/gltf/hospital_bed.glb", (glb) => {
                    this.bed = { object: glb.scene };
                    this.loadedBed = true;
                    console.log("Bed loaded successfully:", this.bed);
                    resolve();
                }, undefined, (error) => {
                    console.error(`Error loading bed model (${error}).`);
                    reject(error);
                });
            });
        
            const loadPatientPromise = new Promise((resolve, reject) => {
                loader.load("./models/gltf/patient.glb", (glb) => {
                    this.patient = { object: glb.scene };
                    this.loadedPatient = true;
                    console.log("Patient loaded successfully:", this.patient);
                    resolve();
                }, undefined, (error) => {
                    console.error(`Error loading patient model (${error}).`);
                    reject(error);
                });
            });

            const loadDoorPromise = new Promise((resolve, reject) => {
                loader.load("./models/gltf/hospital_door.glb", (glb) => {
                    this.door = { object: glb.scene };
                    this.loadedDoor = true;
                    console.log("Door loaded successfully:", this.door);
                    resolve();
                }, undefined, (error) => {
                    console.error(`Error loading door model (${error}).`);
                    reject(error);
                });
            });

            const loadBenchPromise = new Promise((resolve, reject) => {
                loader.load("./models/gltf/tandem_seating_-_hospital.glb", (glb) => {
                    this.bench = { object: glb.scene };
                    this.loadedBench = true;
                    console.log("Bench loaded successfully:", this.bench);
                    resolve();
                }, undefined, (error) => {
                    console.error(`Error loading bench model (${error}).`);
                    reject(error);
                });
            });
            
            // Store the maze's map and size
            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });


            Promise.all([loadBedPromise, loadPatientPromise, loadBenchPromise, loadDoorPromise])
                .then(() => {
                    console.log("All models loaded successfully!");

            // Build the maze
            let wallObject;
            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                   
                    const cellValue = description.map[j][i];
                    /*
                     * description.map[][] | North wall | West wall
                     * --------------------+------------+-----------
                     *          0          |     No     |     No
                     *          1          |     No     |    Yes
                     *          2          |    Yes     |     No
                     *          3          |    Yes     |    Yes
                     *          4          |           Bed
                     *          5          |         Pacient
                     *          6          |           Door
                     *          7          |           Bench
                     */
                    if (cellValue == 2 || cellValue == 3) {
                        // Adiciona paredes
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0);
                        this.object.add(wallObject);
                    }
                    if (cellValue == 1 || cellValue == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                    if (cellValue == 4 && this.loadedBed) {
                        const bedObject = this.bed.object.clone();
                        bedObject.position.set(i - description.size.width / 2.0 + 0.2, 0.1, j - description.size.height / 2.0 + 0.2);
                        bedObject.scale.set(0.003, 0.003, 0.003); // Adjust scale
                        bedObject.rotateY( -(Math.PI / 2));
                        bedObject.castShadow = true;
                        bedObject.receiveShadow = true;
                        this.object.add(bedObject);
                    }
                    if (cellValue == 5 && this.loadedPatient) {
                        // Adiciona o paciente
                        const patientObject = this.patient.object.clone();
                        patientObject.position.set(i - description.size.width / 2.0 + 0.2, 0.1, j - description.size.height / 2.0 + 0.2);
                        patientObject.scale.set(0.005, 0.005, 0.005); // Adjust scale
                        patientObject.rotateY( -(Math.PI / 2));
                        patientObject.castShadow = true;
                        patientObject.receiveShadow = true;
                        this.object.add(patientObject);
                    }
                    if (cellValue == 6 && this.loadedDoor) {
                        // Adiciona o porta
                        const doorObject = this.door.object.clone();
                        doorObject.position.set(i - description.size.width / 2.0 + 0.5, 0.01, j - description.size.height / 2.0 );
                        doorObject.scale.set(0.3, 0.4, 0.5); // Adjust scale
                        doorObject.rotateY( -(Math.PI / 2));
                        doorObject.castShadow = true;
                        doorObject.receiveShadow = true;
                        this.object.add(doorObject);
                    }
                    if (cellValue == 7 && this.loadedBench) {
                        // Adiciona o banco
                        const benchObject = this.bench.object.clone();
                        benchObject.position.set(i - description.size.width / 2.0 - 0.1, 0.1, j - description.size.height / 2.0 - 0.8);
                        benchObject.scale.set(0.3, 0.4, 0.5); // Adjust scale
                        benchObject.rotateY( -(Math.PI / 2 * 1.95));
                        benchObject.castShadow = true;
                        benchObject.receiveShadow = true;
                        this.object.add(benchObject);
                    }

                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }).catch((error) => {
            console.error(`Error loading models (${error}).`);
        });
    };

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    foundExit(position) {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };
}