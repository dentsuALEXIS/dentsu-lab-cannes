const disposeObject = (el, scene) => {
	if (!el) {
		return
	}

	el.traverse((c) => {
		if (c.material) {
			if (c.material.uniforms) {
				Object.keys(c.material.uniforms).forEach((k) => {
					const uni = c.material.uniforms[k]

					uni.value?.dispose?.()
				})
			}

			c.material.alphaMap?.dispose()
			c.material.aoMap?.dispose()
			c.material.bumpMap?.dispose()
			c.material.emissiveMap?.dispose()
			c.material.envMap?.dispose()
			c.material.lightMap?.dispose()
			c.material.map?.dispose()
			c.material.metalnessMap?.dispose()
			c.material.normalMap?.dispose()
			c.material.roughnessMap?.dispose()

			c.material.dispose()
		}

		if (c.geometry) {
			c.geometry.dispose()
		}

		scene?.remove(c)
	})
}

export { disposeObject }
