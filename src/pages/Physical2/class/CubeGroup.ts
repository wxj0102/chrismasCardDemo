import * as THREE from 'three'
import WorldObjectGroup from "./WorldObjectGroup";
import { Ammo } from '../../../utils/utils';

export default class CubeGroup extends WorldObjectGroup {
  constructor() {
    const mass = 1
    const height = 1
    const width = 1
    const depth = 1
    const material = new THREE.MeshStandardMaterial()
    const geometry = new THREE.BoxGeometry(width, height, depth)
    const massList = new Array(100).fill(mass)
    const boxShape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
    super(massList, geometry, material, boxShape)
    
    this.getObjectList().forEach((item, i) => {
      item.getMesh().setColorAt(i, new THREE.Color(Math.random() * 0xfffffff))
      item.getBody().setRestitution(0.3)
    })
  }
}
