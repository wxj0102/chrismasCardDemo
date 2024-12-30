import * as THREE from 'three'
import { BufferGeometryUtils, GLTFLoader, DRACOLoader } from 'three/addons'

/**
 * AmmoNamespace的type.d.ts文件 ammo包本身不会生成 需要自己去通过第三方工具将ammo库中的ammo.idl转为ammo.d.ts
 * 以下为具体操作
 * 1 下载 ammojs-typed 库
 * 2 将ammo.js的对应版本的 ammo.idl下载并放到该库的./ammo文件夹下
 * 3 安装webidl-dts-gen依赖 
 * 4 将package.json中脚本里面的webidl2ts替换为webidl-dts-gen --注: 原本的webidl2ts有问题 已经且已经不维护了 在另一个fork版本webidl-dts-gen中修复了这个问题
 * 5 该包中同时使用了npm和yarn 根据自己需要调整
 * 6 执行 npm run generate
 * 7 将产物ammo/ammo.d.ts放到项目中
 * 8 将对应版本的ammo.wasm.js通过script加入到项目
 */
import AmmoNamespace from "../types/ammo"

export function mergeGroupGeometries(group: THREE.Group): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = []
  group.traverse(item => {
    if ((item as THREE.Mesh).isMesh) {
      const mesh = item as THREE.Mesh
      geometries.push(mesh.geometry)
    }
  })
  return BufferGeometryUtils.mergeGeometries(geometries, true)
}

export let Ammo: typeof AmmoNamespace
export function loadAmmo(): Promise<typeof AmmoNamespace> {
  return new Promise<typeof AmmoNamespace>((resolve) => {
    if (Ammo) {
      resolve(Ammo)
    } else if (typeof (window.Ammo) === 'function') {
      window.Ammo().then((lib) => {
        Ammo = lib
        resolve(Ammo)
      })
    }
  })
}

export function loadGltf(path: string, isDraco = true): Promise<any> {
  const gltfLoader = new GLTFLoader();
  if (isDraco) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');
    gltfLoader.setDRACOLoader(dracoLoader);
  }
  return new Promise((resolve) => {
    gltfLoader.load(path, (gltf) => {
      resolve(gltf)
    })
  })
}

export function getAmmoShapeByThreeGeometry(geometry: THREE.BufferGeometry): AmmoNamespace.btConcaveShape {
  // const vertices = geometry.getAttribute('position').array;
  // const indices = geometry?.getIndex()?.array || [];
  // const ammoVertices = new Float32Array(vertices);
  // const ammoIndices = new Uint32Array(indices);

  // const triangleMesh = new Ammo.btTriangleMesh();
  // for (let i = 0; i < ammoIndices.length; i += 3) {
  //   const index1 = ammoIndices[i];
  //   const index2 = ammoIndices[i + 1];
  //   const index3 = ammoIndices[i + 2];
  //   const vertex1 = new Ammo.btVector3(
  //     ammoVertices[index1 * 3],
  //     ammoVertices[index1 * 3 + 1],
  //     ammoVertices[index1 * 3 + 2]
  //   );
  //   const vertex2 = new Ammo.btVector3(
  //     ammoVertices[index2 * 3],
  //     ammoVertices[index2 * 3 + 1],
  //     ammoVertices[index2 * 3 + 2]
  //   );
  //   const vertex3 = new Ammo.btVector3(
  //     ammoVertices[index3 * 3],
  //     ammoVertices[index3 * 3 + 1],
  //     ammoVertices[index3 * 3 + 2]
  //   );
  //   triangleMesh.addTriangle(vertex1, vertex2, vertex3);
  // }

  // const meshShape = new Ammo.btBvhTriangleMeshShape(triangleMesh, true);

  let triangle_mesh = new Ammo.btTriangleMesh()
  //declare triangles position vectors
  let vectA = new Ammo.btVector3(0, 0, 0)
  let vectB = new Ammo.btVector3(0, 0, 0)
  let vectC = new Ammo.btVector3(0, 0, 0)

  //retrieve vertices positions from object
  let verticesPos = geometry.getAttribute('position').array
  let triangles = []
  for (let i = 0; i < verticesPos.length; i += 3) {
    triangles.push({
      x: verticesPos[i],
      y: verticesPos[i + 1],
      z: verticesPos[i + 2]
    })
  }

  for (let i = 0; i < triangles.length - 3; i += 3) {

    vectA.setX(triangles[i].x)
    vectA.setY(triangles[i].y)
    vectA.setZ(triangles[i].z)

    vectB.setX(triangles[i + 1].x)
    vectB.setY(triangles[i + 1].y)
    vectB.setZ(triangles[i + 1].z)

    vectC.setX(triangles[i + 2].x)
    vectC.setY(triangles[i + 2].y)
    vectC.setZ(triangles[i + 2].z)

    triangle_mesh.addTriangle(vectA, vectB, vectC, true)
  }

  Ammo.destroy(vectA)
  Ammo.destroy(vectB)
  Ammo.destroy(vectC)

  let meshShape = new Ammo.btConvexTriangleMeshShape(triangle_mesh, true)
  return meshShape
}