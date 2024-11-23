import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import Orientation from '../../../3DVisualizationModule/orientation.js';
import HospitalModel from "../../../3DVisualizationModule/hospitalModel.js";

@Component({
  selector: 'app-hospital-model',
  standalone: true,
  imports: [],
  templateUrl: './hospital-model.component.html',
  styleUrl: './hospital-model.component.scss'
})

export class HospitalModelComponent implements OnInit {

  hospitalModel: any;

  ngOnInit(): void {
    this.initialize();
    this.animate(); 
  }

  initialize() {
    try {
      
      // Create the game
      this.hospitalModel = new HospitalModel(
        {},
        { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
        {},
        { ambientLight: { intensity: 0.1 }, directionalLight1: { intensity: 1.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) }, directionalLight2: { intensity: 1.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) } }, // Lights parameters
        {}, // Fog parameters
        { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Fixed view camera parameters
        { view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // First-person view camera parameters
        { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // Third-person view camera parameters
        { view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 }, // Top view camera parameters
        { view: "mini-map", multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64 } // Mini-msp view camera parameters
        
      );
      this.animate();
      
    } catch (error) {
      console.error("Error initializing hospital model:", error);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.hospitalModel.update();

  }

}