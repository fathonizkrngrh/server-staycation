module.exports = {
  countDuration: async (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return duration;
  },
  createInvoice: async (item, total, duration) => {
    const itemName = item.split(" ");
    let uniqItem = "";
    for (let i = 0; i < itemName.length; i++) {
      uniqItem = itemName[i].charAt(0) + uniqItem;
    }
    const invoice =
      "SCT" +
      uniqItem +
      Math.floor(22 + Math.random() * 10000000 + total + duration);
    return invoice;
  },
};
