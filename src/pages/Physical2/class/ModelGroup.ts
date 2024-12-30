import { loadGltf } from '../../../utils/utils'


export default class ObjectGroup {
  constructor () {
    
  }

  async loadModel (path: string, isDraco = true) {
    console.log(111)
    const gltf = await loadGltf(path, isDraco)
    gltf.scene.traverse((item) => {
      console.log(item)
    })
    console.log(gltf)
  }

  action () {

  }
}