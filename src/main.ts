/// <reference path="../node_modules/wasm-vips/lib/node/vips.d.ts" />

function $<T extends Element>(s: string): T | null {
  return document.querySelector(s)
}

$<HTMLInputElement>('input')!.addEventListener('change', async (event: any) => {
  const vipsInstance = await (window as any).Vips()
  const files: File[] = Array.from(event.target.files)
  await Promise.all(
    files.map(async (file) => {
      const originalImageBuffer = await file.arrayBuffer()
      const image: vips.Image = vipsInstance.Image.newFromBuffer(
        originalImageBuffer
      )
      const webpImageBuffer = new Uint8Array(image.writeToBuffer('.webp'))
      const blob = new Blob([webpImageBuffer], { type: 'image/webp' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download =
        file.name
          .split('.')
          .filter((_, i, all) => {
            return i < all.length - 1
          })
          .join('') + '.webp'
      link.href = url
      console.log(url)
      link.click()
    })
  )
})

navigator.serviceWorker.register('/sw.worker.js', { scope: '/' })
