import * as THREE from 'three'
import { BufferGeometryUtils } from 'three/addons'

export function mergeGroupGeometries(group: THREE.Group): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = []
  group.traverse(item => {
    if((item as THREE.Mesh).isMesh) {
      const mesh = item as THREE.Mesh
      geometries.push(mesh.geometry)
    }
  })
  return BufferGeometryUtils.mergeGeometries(geometries, false)

}