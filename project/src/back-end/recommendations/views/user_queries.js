const viewDescriptor = {
  views: {
  previous_checkout_sum: {
    map: function(doc) {
      const today = new Date().toUTCString().slice(0, 16);
      //get all the checkouts of the day
      if (doc.action === 'checkout' && doc.date.slice(0, 16) === today) {
        doc.log.items.forEach(function(item) {
          emit(item.name, item.quantity);
        });
      }
    },
    reduce: "_sum"
  }
}
}

module.exports = { viewDescriptor }
