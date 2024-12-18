import AmmoNamespace from "../../../types/ammo"
import { Ammo } from "../../../utils/utils"

export default class PhysicalScene {
  constructor() {
    
  }

  public g = -9.82
  physicalWorld!: AmmoNamespace.btDiscreteDynamicsWorld
  _collisionConfiguration!: AmmoNamespace.btCollisionConfiguration
  _dispatcher!: AmmoNamespace.btCollisionDispatcher
  _overlappingPairCache!: AmmoNamespace.btDbvtBroadphase
  _solver!: AmmoNamespace.btSequentialImpulseConstraintSolver

  init() {
    // 碰撞的配置 配置冲突检测堆栈分配器大小
    this._collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
    // 碰撞调度器 支持处理convex碰撞对 
    // 撞击时间 最近点和穿透深度
    this._dispatcher = new Ammo.btCollisionDispatcher(this._collisionConfiguration)
    // 宽相 快速确定哪些物体相交的碰撞检测算法
    this._overlappingPairCache = new Ammo.btDbvtBroadphase()
    // 解算器 约束物体的运动状态
    this._solver = new Ammo.btSequentialImpulseConstraintSolver()
    // 创建一个离散物理世界
    this.physicalWorld = new Ammo.btDiscreteDynamicsWorld(
      this._dispatcher,
      this._overlappingPairCache,
      this._solver,
      this._collisionConfiguration
    )
    // 设置加速度
    this.physicalWorld.setGravity(new Ammo.btVector3(0, this.g, 0))
  }

  update(d: number) {
    this.physicalWorld.stepSimulation(d)
  }
}
