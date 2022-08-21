import { GifReader } from "omggif"

export const loadGifFrameList = async (
  gifUrl: string
): Promise<ImageData[]> => {
  const response = await fetch(gifUrl)
  const blob = await response.blob()
  const arrayBuffer = await blob.arrayBuffer()
  const intArray = new Uint8Array(arrayBuffer)

  const reader = new GifReader(intArray as Buffer)

  const info = reader.frameInfo(0)

  return new Array(reader.numFrames()).fill(0).map((_, k) => {
    const image = new ImageData(info.width, info.height)

    reader.decodeAndBlitFrameRGBA(k, image.data as any)

    return image
  })
}
