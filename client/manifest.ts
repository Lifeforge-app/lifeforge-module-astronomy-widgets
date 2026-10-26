import { createForgeModule } from '@lifeforge/federation'

import type { Contract } from './contract'

const { forgeAPI, ...manifest } = createForgeModule<Contract>({
  routes: {},
  hidden: true,
  contract,
  widgets: [
    () => import('@/widgets/ISS'),
    () => import('@/widgets/APOD'),
    () => import('@/widgets/EPIC')
  ]
})

export default manifest

export { forgeAPI }
