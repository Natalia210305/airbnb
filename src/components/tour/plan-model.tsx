"use client"

import { useMemo } from "react"
import { useLoader } from "@react-three/fiber"
import { Color, DoubleSide, Mesh, Vector3, type Material } from "three"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { rebuiltWalls, removedObjRegions, tour } from "@/content/tour"
import { PlanInterior } from "./plan-interior"

/** Προσαρμογή των υλικών του Sweet Home 3D στη χρωματική παλέτα του site */
function styleMaterial(material: Material) {
  material.side = DoubleSide
  const m = material as Material & { color?: Color; opacity: number }
  if (material.name.startsWith("wall")) m.color?.set("#f5efe3")
  else if (material.name.startsWith("ground")) m.color?.set("#e6dccd")
  else if (material.name === "flltgrey") {
    // τζάμια παραθύρων
    m.color?.set("#cfe6f0")
    material.transparent = true
    material.opacity = 0.28
    material.depthWrite = false
  }
}

const hiddenPrefixes = rebuiltWalls.flatMap((w) => w.objPrefixes)
const hiddenByPrefix = (name: string) =>
  hiddenPrefixes.some((p) => name.startsWith(p))

/** Το κέντρο του αντικειμένου (εκατοστά → μέτρα) βρίσκεται σε περιοχή που αφαιρείται */
function isInRemovedRegion(mesh: Mesh) {
  mesh.geometry.computeBoundingBox()
  const c = mesh.geometry.boundingBox!.getCenter(new Vector3()).multiplyScalar(tour.scale)
  return removedObjRegions.some(
    (r) => c.x >= r.x1 && c.x <= r.x2 && c.z >= r.z1 && c.z <= r.z2,
  )
}

/**
 * Η κάτοψη από το Sweet Home 3D (public/models/miranda.obj + .mtl) μαζί με δάπεδα
 * και ενδεικτικά έπιπλα. Το μοντέλο είναι σε εκατοστά: μικραίνει ×0.01 και
 * μετακινείται ώστε το κέντρο του να είναι στο (0, 0, 0).
 */
export function PlanModel() {
  const materials = useLoader(MTLLoader, tour.mtlUrl)
  const obj = useLoader(OBJLoader, tour.objUrl, (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })

  const model = useMemo(() => {
    const root = obj.clone(true)
    root.traverse((child) => {
      if (!(child instanceof Mesh)) return
      // Τοίχοι που ξαναχτίζονται με κώδικα (με τα πραγματικά ανοίγματα) και
      // αντικείμενα του OBJ που αντικαθίστανται (π.χ. το παλιό παράθυρο)
      if (hiddenByPrefix(child.name) || isInRemovedRegion(child)) {
        child.visible = false
        return
      }
      child.castShadow = true
      child.receiveShadow = true
      // Το αρχείο OBJ έχει «κενές» κάθετες (0,0,0) → ξαναϋπολογισμός για σωστό φωτισμό
      child.geometry.computeVertexNormals()
      const mats: Material[] = Array.isArray(child.material)
        ? child.material
        : [child.material]
      mats.forEach(styleMaterial)
    })
    return root
  }, [obj])

  const { x, z } = tour.center
  return (
    <group position={[-x, 0, -z]}>
      <primitive object={model} scale={tour.scale} />
      <PlanInterior />
    </group>
  )
}
