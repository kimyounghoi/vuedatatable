const rowHeight = 24
export default {
  watch: {
    items () {
      this.computeDisplayItems()
    },
    containerHeight () {
      this.computeDisplayItems()
    }
  },
  mounted () {
    this.computeDisplayItems()
  },
  methods: {
    handlerScroll () {
      this.computeDisplayItems()
    },
    computeDisplayItems () {
      const scrollTop = this.$el.scrollTop || 0
      const blockNumber = this.blockSize === 0 ? 0 : Math.floor(scrollTop / this.blockSize)
      const blockStart = this.blockSize * blockNumber
      const blockEnd = blockStart + this.blockSize
      const apertureTop = Math.max(0, blockStart - this.preloadSize)
      const apertureBottom = Math.min(this.totalScrollableHeight, blockEnd + this.preloadSize)
      const displayIndexStart = Math.floor(apertureTop / rowHeight)
      const nonZeroIndex = Math.ceil(apertureBottom / rowHeight)
      const displayIndexEnd = nonZeroIndex > 0 ? nonZeroIndex - 1 : nonZeroIndex

      if (displayIndexStart === this.preStart && displayIndexEnd === this.preEnd) {
        return
      }
      this.preStart = displayIndexStart
      this.preEnd = displayIndexEnd
      this.activeItems = this.items.slice(displayIndexStart, displayIndexEnd + 1)
      this.topBufferStyle.height = displayIndexStart * rowHeight + 'px'
      this.bottomBufferStyle.height = Math.max(0, (this.items.length - displayIndexEnd - 1) * rowHeight) + 'px'
    }
  }
}
