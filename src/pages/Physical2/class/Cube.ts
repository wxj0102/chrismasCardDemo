import * as THREE from 'three';
import WorldObject from './WorldObject';
import { Ammo } from '../../../utils/utils';


export default class Cube extends WorldObject {
  constructor(width: number, height: number, depth: number, color: number, mass: number) {
    super(mass);
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;

    this.createMesh();

    const boxShape = new Ammo.btBoxShape(new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2));
    this.createBody(boxShape);
  }
  public width;
  public height;
  public depth;
  public color: number;

  createMesh() {
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshStandardMaterial({ color: this.color, });
    const mesh = new THREE.Mesh(geometry, material)
    this.setMesh(mesh)
    mesh.receiveShadow = true;
    mesh.castShadow = true;
  }
}