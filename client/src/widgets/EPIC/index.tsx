import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useMemo, useState } from 'react'

import { type WidgetConfig } from '@lifeforge/configs'
import {
  Box,
  Button,
  Flex,
  IconTooltip,
  Image,
  LoadingScreen,
  Stack,
  Text,
  Widget,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import SelectCoordinateModal from './components/SelectCoordinateModal'

dayjs.extend(localizedFormat)

export interface EPICImage {
  identifier: string
  caption: string
  image: string
  date: string
  centroid_coordinates: { lat: number; lon: number }
  url: string
}

function EPIC() {
  const { open: openModal } = useModalStore()
  const [imageLoaded, setImageLoaded] = useState(false)

  const [selectedId, setSelectedId] = useState<string | null>(() =>
    localStorage.getItem('epic-selected-id')
  )

  const epicQuery = useQuery(
    forgeAPI.epic.get.queryOptions({
      staleTime: 1000 * 60 * 30
    })
  )

  const images = epicQuery.data ?? []

  const selectedImage = useMemo(
    () =>
      images.find(img => img.identifier === selectedId) ?? images[0] ?? null,
    [images, selectedId]
  )

  return (
    <>
      <Widget
        actionComponent={
          selectedImage && (
            <Flex align="center" gap="md" mr="md">
              {images.length > 1 && (
                <Button
                  icon="tabler:map-pin"
                  namespace={false}
                  p="sm"
                  variant="plain"
                  onClick={() =>
                    openModal(SelectCoordinateModal, {
                      images,
                      selectedId:
                        selectedImage?.identifier ?? images[0].identifier,
                      onSelect: (img: EPICImage) => {
                        setSelectedId(img.identifier)
                        localStorage.setItem('epic-selected-id', img.identifier)
                        setImageLoaded(false)
                      }
                    })
                  }
                />
              )}
              <IconTooltip
                icon="tabler:info-circle"
                id="epic-widget-tooltip"
                place="bottom-end"
                positionStrategy="absolute"
              >
                <Text as="p" leading="relaxed" style={{ maxWidth: '20rem' }}>
                  {selectedImage.caption}
                </Text>
                <Text as="p" color="muted" mt="sm" size="sm">
                  {dayjs(selectedImage.date).format('LLL')}
                </Text>
              </IconTooltip>
            </Flex>
          )
        }
        icon="tabler:globe"
        title="epic"
      >
        <WithQuery query={epicQuery} showRetryButton={false}>
          {() =>
            selectedImage ? (
              <Stack height="100%" minHeight="0">
                <Box
                  flex="1"
                  minHeight="0"
                  overflow="hidden"
                  position="relative"
                  r="md"
                  width="100%"
                >
                  {!imageLoaded && <LoadingScreen loaderSize="1rem" />}
                  <Image
                    alt="Earth"
                    fit="contain"
                    height="100%"
                    src={selectedImage.url}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                    width="100%"
                    onLoad={() => setImageLoaded(true)}
                  />
                </Box>
                <Text align="center" color="muted" size="sm">
                  {selectedImage.centroid_coordinates.lat.toFixed(2)}°
                  {selectedImage.centroid_coordinates.lat >= 0 ? 'N' : 'S'},{' '}
                  {selectedImage.centroid_coordinates.lon.toFixed(2)}°
                  {selectedImage.centroid_coordinates.lon >= 0 ? 'E' : 'W'}
                </Text>
              </Stack>
            ) : (
              <></>
            )
          }
        </WithQuery>
      </Widget>
    </>
  )
}

export default EPIC

export const config: WidgetConfig = {
  id: 'epic',
  icon: 'tabler:globe',
  minW: 2,
  minH: 2
}
