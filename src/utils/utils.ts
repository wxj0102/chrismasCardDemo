import * as THREE from 'three'
import { BufferGeometryUtils } from 'three/addons'

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
  return BufferGeometryUtils.mergeGeometries(geometries, false)
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