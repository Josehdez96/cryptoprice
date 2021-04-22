/**
 * Returns cryptocurrency price in USD.
 *
 * @param {"BTC"} crypto The cryptocurrency ticker you want to get.
 * @return The current price of the coin.
 * @customfunction
 */
function CRYPTOPRICE(crypto) {
  try {
    let price;
    let url = "https://api.coinlore.net/api/tickers";
    let cryptoData = {};
    let data = {};

    // Check if we have cache
    const cacheKey = crypto.toLocaleLowerCase() + "key";
    let cache = CacheService.getUserCache();
    let cached = cache.get(cacheKey);
    if (cached && cached != null && cached.length > 1) {
      data = JSON.parse(cached);
    } else {
      let response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        validateHttpsCertificates: true,
      });
      data = JSON.parse(response.getContentText()).data;
      if (data && response.getResponseCode() === 200 && data.length > 1) {
        cache.put(cacheKey, JSON.stringify(data), 60);
      } else {
        return "Error fetching the data";
      }
    }

    cryptoData = data.find((elem) => elem.symbol === crypto.toUpperCase());
    price = parseFloat(cryptoData.price_usd);
    return price;
  } catch (error) {
    return "An error has occurred";
  }
}
