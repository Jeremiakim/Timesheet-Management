function formatRate(rate) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(rate);
}

module.exports = formatRate;
