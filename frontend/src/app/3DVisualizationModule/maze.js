import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import TWEEN, { Group, Tween } from '@tweenjs/tween.js';

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {


    constructor(parameters, camera, renderer, scene3D) {
            
        // Variáveis globais para controlar o overlay e a sala selecionada
        this.overlayVisible = false; // Controla a visibilidade do overlay

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

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.camera = camera;
            this.renderer = renderer;
            this.scene3D = scene3D;

            this.spotlight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 2, 0.5, 1);
            this.spotlight.position.set(0, 10, 0);
            this.spotlight.target = new THREE.Object3D();
            this.scene3D.add(this.spotlight);
            this.scene3D.add(this.spotlight.target);

        
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
            //this.initialPosition = this.cellToCartesian(description.initialPosition);
            //this.initialDirection = description.initialDirection;
            //this.exitLocation = this.cellToCartesian(description.exitLocation);

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
                     *          8          |       Pacient & Bed 
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
                    bedObject.position.set(i - description.size.width / 2.0, 0.1, j - description.size.height / 2.0);
                    bedObject.scale.set(0.003, 0.003, 0.003); // Ajuste da escala
                    bedObject.rotateY(-(Math.PI / 2));
                    bedObject.castShadow = true;
                    bedObject.receiveShadow = true;

                    const boxTable = this.createBoxTable(bedObject, 2.5);
                    boxTable.name = `Bed_${i}_${j}`;
                    this.object.add(boxTable);
                    console.log(boxTable);
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

                    if (cellValue == 8 && this.loadedBed && this.loadedPatient) {
                        const bedObject = this.bed.object.clone();
                        bedObject.position.set(i - description.size.width / 2.0 + 0.2, 0.1, j - description.size.height / 2.0 + 0.2);
                        bedObject.scale.set(0.0025, 0.0025, 0.0025); // Adjust scale
                        bedObject.rotateY( -(Math.PI / 2));
                        bedObject.castShadow = true;
                        bedObject.receiveShadow = true;

                        const boxTable = this.createBoxTable(bedObject, 2.5);
                        boxTable.name = `Patient_${i}_${j}`;
                        this.object.add(boxTable);
                        console.log(boxTable);
                        this.object.add(bedObject);
                        const patientObject = this.patient.object.clone();
                        patientObject.position.set(i - description.size.width / 2.0 + 0.1, 0.6, j - description.size.height / 2.0 + 0.2);
                        patientObject.scale.set(0.008, 0.008, 0.007); // Adjust scale
                        patientObject.rotateY( -(Math.PI / 2 * 3));
                        patientObject.castShadow = true;
                        patientObject.receiveShadow = true;
                        this.object.add(patientObject);
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
            error => this.onError(this.url, error),

            window.addEventListener('click', this.onMouseClick),
            window.addEventListener('keydown', (event) => {
                if (event.key === 'i') {
                    console.log("Tecla 'i' pressionada"); 
                        this.toggleOverlay(); 
                    }
            })
            
        );
    }

    createBoxTable(table, increaseFactor = 1) {
        const box = new THREE.Box3().setFromObject(table);
    
        // Get the size and center of the current box
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
    
        // New Height
        const adjustedHeight = size.y * increaseFactor;
    
        // Create new geometry
        const geometry = new THREE.BoxGeometry(size.x, adjustedHeight, size.z);
        const material = new THREE.LineBasicMaterial({
            color: 0x808080,
            transparent: true,
            opacity: 0,
        });
        const boxMesh = new THREE.Mesh(geometry, material);
    
        // Adjust the position of the box to remain aligned
        boxMesh.position.copy(center);
        boxMesh.position.y += (adjustedHeight - size.y) / 2;
    
        return boxMesh;
    }    

    onMouseClick = (event) => {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
        this.raycaster.setFromCamera(this.mouse, this.camera.object);
        const intersects = this.raycaster.intersectObjects(this.scene3D.children, true);
    
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log("Object clicked:", clickedObject.name);
    
            if (clickedObject.name && clickedObject.name.includes("Bed")) {
                const tablePosition = clickedObject.position;
                console.log("Selected operating table:", clickedObject.name, "Position:", tablePosition);
                this.moveCameraToRoom(tablePosition, this.camera,false);
            
                // Armazena a sala selecionada
            let selectedRoom = clickedObject.name; // Aqui você pode associar o nome do paciente à sala
            console.log("Sala selecionada:", selectedRoom);  // Verifique se o log aparece

            } else if (clickedObject.name && clickedObject.name.includes("Patient")) {
                const patientPosition = clickedObject.position;
                console.log("Selected patient:", clickedObject.name, "Position:", patientPosition);
                this.moveCameraToRoom(patientPosition, this.camera, true);
                
            // Armazena a sala selecionada
            selectedRoom = clickedObject.name; // Aqui você pode associar o nome do paciente à sala
            console.log("Sala selecionada:", selectedRoom);  // Verifique se o log aparece

            } else {
                console.log("The clicked object is not a surgical table or a patient.");
            }
        } else {
            console.log("No objects were clicked.");
        }
    };
    
    moveCameraToRoom(position, camera,activateSpotlightFlag) {
        console.log(activateSpotlightFlag);
        const [row, column] = this.cartesianToCell(position);
    
        const centerX = (column - this.size.width / 2.0 + 0.5) * this.scale.x;
        const centerZ = (row - this.size.height / 2.0 + 0.5) * this.scale.z;
    
        const cameraHeight = 5.0;
    
        const startPosition = {
            x: camera.object.position.x,
            y: camera.object.position.y,
            z: camera.object.position.z,
        };
    
        const endPosition = {
            x: centerX,
            y: cameraHeight,
            z: centerZ,
        };
    
        const lookAtTarget = new THREE.Vector3(centerX, 0, centerZ);
    
        var tween = new Tween(startPosition, true)
            .to(endPosition, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                camera.object.position.set(
                    startPosition.x,
                    startPosition.y,
                    startPosition.z
                );
                camera.object.lookAt(lookAtTarget);
            })
            .onComplete(() => {
                camera.object.position.set(
                    endPosition.x,
                    endPosition.y,
                    endPosition.z
                );
                camera.object.lookAt(lookAtTarget);
                if (activateSpotlightFlag) {
                    this.activateSpotlight(position);
                }
            })
            .start();
    
        tween.update();
    }

    activateSpotlight(position) {
        this.spotlight.position.set(position.x, position.y+5, position.z); 
        
        this.spotlight.target.position.set(position.x, position.y, position.z); 
        
        this.spotlight.color.set(0xADD8E6); // Cor amarela
        
        this.spotlight.intensity = 20; // Ajuste a intensidade conforme necessário

        this.spotlight.angle = Math.PI / 6; // Ângulo de 30 graus, você pode ajustar esse valor

        this.spotlight.distance = 10; // Ajuste a distância, por exemplo, 10 unidades
    
    
        
        console.log("Spotlight ativado para o paciente na posição:", position);
    }

    toggleOverlay (){
        this.overlayVisible = !this.overlayVisible;
        const overlayElement = document.getElementById("overlay");
        if (this.overlayVisible) {
            overlayElement.style.display = "none";
        
        setTimeout(() => {
            overlayElement.style.display = "block";  
            this.fetchRoomInfo(this.clickedObject);  
        }, 500);
        } else {
            overlayElement.style.display = "none";  // Esconde o overlay
        }
    }
    

    updateOverlayContent(data) {
        console.log(data);
        const overlayContent = document.getElementById("overlay-content");
        let contentHTML = "";
    
        if (data.id && data.equipment && data.roomCapacity && data.status && data.maintenanceSlots) {
            contentHTML += `
                <h2>Informações da Sala</h2>
                <p><strong>ID:</strong> ${data.id}</p>
                <p><strong>Equipment:</strong> ${data.equipment}</p>
                <p><strong>Capacity:</strong> ${data.roomCapacity}</p>
                <p><strong>Room Type:</strong> ${data.roomType.designation}</p>
                <p><strong>Maintenance Slots:</strong> ${data.maintenanceSlots}</p>
                <p><strong>Status:</strong> ${data.status}</p>
            `;
        }
    
        if (data.patientName && data.doctorName) {
            contentHTML += `
                <h2>Informações do Appointment</h2>
                <p><strong>Paciente:</strong> ${data.patientName}</p>
                <p><strong>Médico:</strong> ${data.doctorName}</p>
                <p><strong>Horário:</strong> ${data.startTime} - ${data.endTime}</p>
                <p><strong>Status:</strong> ${data.status}</p>
            `;
        }
    
        if (contentHTML === "") {
            contentHTML = `<p>Nenhuma informação disponível para exibição.</p>`;
        }
    
        overlayContent.innerHTML = contentHTML;
        this.showOverlay();
    }
    

    async fetchRoomInfo() {
        const intersects = this.raycaster.intersectObjects(this.scene3D.children, true);
        const clickedObject = intersects[0].object;
        console.log("Object clicked:", clickedObject.name);
        let surgeryRoomId = "";
    
        // Identificar o ID da Sala
        if (clickedObject.name.includes("2_2")) {
            surgeryRoomId = "SR001";
        } else if (clickedObject.name.includes("2_8")) {
            surgeryRoomId = "SR002";
        } else if (clickedObject.name.includes("8_2")) {
            surgeryRoomId = "SR003";
        } else if (clickedObject.name.includes("8_8")) {
            surgeryRoomId = "SR004";
        }
    
        try {
            // Buscar informações da Sala
            if (clickedObject.name.includes("Bed")) {
                const roomResponse = await fetch(`https://localhost:5001/api/surgeryRooms/${surgeryRoomId}`);
                const roomData = await roomResponse.json();
                this.updateOverlayContent(roomData);
            } 
            // Buscar informações do Appointment para a Sala
            else if (clickedObject.name.includes("Patient")) {
                const appointmentResponse = await fetch(`http://localhost:5000/api/hospitalModel/currentAppointment/${surgeryRoomId}`);
                const appointmentData = await appointmentResponse.json();
                this.updateOverlayContent(appointmentData);
            }
        } catch (error) {
            console.error("Erro ao buscar informações:", error);
        }
    }
    
    showOverlay() {
        const overlayElement = document.getElementById("overlay");
        if (this.overlayVisible) {
            overlayElement.style.display = "block";  // Exibe o overlay
        } else {
            overlayElement.style.display = "none";   // Esconde o overlay
        }
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position){
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