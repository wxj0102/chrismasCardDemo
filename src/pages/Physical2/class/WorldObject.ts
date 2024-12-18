import * as THREE from 'three'
import AmmoNamespace from "../../../types/ammo"
import { Ammo } from '../../../utils/utils'

export default class WorldObject {
  constructor(mass: number) {
    this.mass = mass
  }
  public mass: number
  protected _position: [x: number, y: number, z: number] = [0, 0, 0]
  protected _quaternion: [x: number, y: number, z: number, w: number] = [0, 0, 0, 1]
  protected _mesh!: THREE.Mesh
  protected _body!: AmmoNamespace.btRigidBody
  protected _btTransform!: AmmoNamespace.btTransform
  protected _btMotionState!: AmmoNamespace.btMotionState
  protected _btInfo!: AmmoNamespace.btRigidBodyConstructionInfo
  protected _btShape!: AmmoNamespace.btCollisionShape

  public setPosition(pos: [x: number, y: number, z: number]) {
    this._btTransform.setOrigin(new Ammo.btVector3(...pos))
    // 修改过位置后需要更新transform 否则设置不会生效
    this._btMotionState.setWorldTransform(this._btTransform)
    this.getBody().setWorldTransform(this._btTransform)
    this.getMesh().position.copy(new THREE.Vector3(...pos))
    this._position = pos
  }

  public getPosition() {
    throw new Error('还没实现 之前的有问题')
  }

  public setQuaternion(quat: [x: number, y: number, z: number, w: number]) {
    this.getMesh().quaternion.copy(new THREE.Vector4(...quat))
    this._btTransform.setRotation(new Ammo.btQuaternion(...quat))
    this.getBody().setWorldTransform(this._btTransform)
    this._quaternion = quat
  }

  public getQuaternion() {
    return this._quaternion
  }

  protected createBody(shape: AmmoNamespace.btCollisionShape) {
    this._btShape = shape
    // 其实将是物体的变换信息 平移旋转缩放
    this._btTransform = new Ammo.btTransform()
    // 设置为单位矩阵 相当于初始化
    this._btTransform.setIdentity()
    const position = this._position
    const quat = this.getQuaternion()
    // 设置原点
    this._btTransform.setOrigin(new Ammo.btVector3(position[0], position[1], position[2]))
    this._btTransform.setRotation(new Ammo.btQuaternion(quat[0], quat[1], quat[2], quat[3]))
    this._btMotionState = new Ammo.btDefaultMotionState(this._btTransform)
    // 设置惯性矩阵
    const loc = new Ammo.btVector3(0, 0, 0)
    shape.calculateLocalInertia(this.mass, loc)
    this._btInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, this._btMotionState, shape, loc)
    this._body = new Ammo.btRigidBody(this._btInfo)
    return this._body
  }

  public setMesh(mesh: THREE.Mesh) {
    this._mesh = mesh
  }

  public getMesh () {
    return this._mesh
  }

  public getBody () {
    return this._body
  }

  

  public updateMeshByBody() {
    const motionState = this._body.getMotionState()
    motionState.getWorldTransform(this._btTransform)
    const pos = this._btTransform.getOrigin()
    const rotation = this._btTransform.getRotation()
    this.getMesh().position.copy(new THREE.Vector3(pos.x(), pos.y(), pos.z()))
    this.getMesh().quaternion.copy(new THREE.Vector4(rotation.x(), rotation.y(), rotation.z(), rotation.w()))
  }
}