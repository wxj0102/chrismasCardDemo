import * as THREE from "three";
import WorldObject from "./WorldObject";
import AmmoNamespace from "../../../types/ammo";
import { Ammo } from "../../../utils/utils";

export default class WorldObjectGroupItem extends WorldObject {
  constructor(
    mass: number,
    mesh: THREE.InstancedMesh,
    shape: AmmoNamespace.btCollisionShape,
    index: number
  ) {
    super(mass)
    this._mesh = mesh
    this.createBody(shape)
    this._index = index
  }

  protected _index

  protected _mesh: THREE.InstancedMesh

  // 重写设置mesh 因为是instance类型的 所以不能设置
  public override setMesh(): void {
    throw new Error('objectGroup 不能设置mesh')
  }

  public override getMesh() {
    return this._mesh
  }

  public override setPosition(pos: [x: number, y: number, z: number]): void {
    this._btTransform.setOrigin(new Ammo.btVector3(...pos))
    // 修改过位置后需要更新transform 否则设置不会生效
    this._btMotionState.setWorldTransform(this._btTransform)
    this.getBody().setWorldTransform(this._btTransform)
    // 这里需要改

    const matrix = new THREE.Matrix4();
    matrix.setPosition(...pos);
    this.getMesh().setMatrixAt(this._index, matrix);
    this.getMesh().instanceMatrix.needsUpdate = true;
    this._position = pos
  }

  public override setQuaternion(quat: [x: number, y: number, z: number, w: number]): void {
    this._btTransform.setRotation(new Ammo.btQuaternion(...quat))
    this._btMotionState.setWorldTransform(this._btTransform)
    this.getBody().setWorldTransform(this._btTransform)
    // 这里需要改

    const matrix = new THREE.Matrix4();
    matrix.makeRotationFromQuaternion(new THREE.Quaternion(...quat));
    this.getMesh().setMatrixAt(this._index, matrix);
    this.getMesh().instanceMatrix.needsUpdate = true;
    this._quaternion = quat
  }

  public override updateMeshByBody() {
    const motionState = this._body.getMotionState()
    motionState.getWorldTransform(this._btTransform)
    const pos = this._btTransform.getOrigin()
    const rotation = this._btTransform.getRotation()

    const matrixPos = new THREE.Matrix4();
    const matrixRotation = new THREE.Matrix4();
    // 位置
    matrixPos.setPosition(pos.x(), pos.y(), pos.z());
    // 旋转
    matrixRotation.makeRotationFromQuaternion(new THREE.Quaternion(rotation.x(), rotation.y(), rotation.z(), rotation.w()))
    // 位置 * 旋转 * 缩放 得到变换矩阵
    matrixPos.multiply(matrixRotation)
    this.getMesh().setMatrixAt(this._index, matrixPos);
    this.getMesh().instanceMatrix.needsUpdate = true;
  }
}