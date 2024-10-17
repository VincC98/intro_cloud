const viewDescriptor = {
  views: {
    products: {
      map: function (doc) {
        if (doc.category) {
          /* eslint-disable */
          emit(doc._id, doc.image, doc.price, doc.category, doc.description)
          /* eslint-enable */
        }
      }
    }
  }
}
module.exports = { viewDescriptor }
