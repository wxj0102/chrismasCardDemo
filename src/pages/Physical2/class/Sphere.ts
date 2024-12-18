import * as THREE from 'three';
import WorldObject from './WorldObject';
import { Ammo } from '../../../utils/utils';


export default class Sphere extends WorldObject {
  constructor(radius: number, color: number, mass: number) {
    super(mass);
    this.radius = radius;
    this.color = color;

    this.createMesh();

    const sphereShape = new Ammo.btSphereShape(this.radius * 1);
    this.createBody(sphereShape);
  }
  public radius: number;
  public color: number;

  createMesh() {
    const geometry = new THREE.SphereGeometry(this.radius);
    const material = new THREE.MeshStandardMaterial({ color: this.color, });
    const mesh = new THREE.Mesh(geometry, material)
    this.setMesh(mesh)
    mesh.receiveShadow = true;
    mesh.castShadow = true;
  }
}