const fashionPhotos = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
];

// These are deliberately assigned by meaning instead of choosing a random photo.
// It keeps the category title and its visual in sync.
const namedPhotos = {
  "New Season Arrivals": "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  "Accessories": "https://plus.unsplash.com/premium_photo-1693222144259-c02fc9fd8de9",
  "Ethnic Wear": "https://plus.unsplash.com/premium_photo-1661964243697-734d7bd664ff",
  "Footwear": "https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb",
  "Men's Clothing": "https://plus.unsplash.com/premium_photo-1672239496593-f51cdc01c0f8",
  "Women's Clothing": "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a",
  "Sole Society": "https://plus.unsplash.com/premium_photo-1664476256352-909db0c31dbc",
  "Ethnic Bazaar": "https://plus.unsplash.com/premium_photo-1669977749819-d8737b4408f7",
  "Urban Threads": "https://plus.unsplash.com/premium_photo-1692650759344-84ff0f26ff1e",
  "Classic Oxford Shirt": "https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838",
  "Slim Fit Denim Jeans": "https://plus.unsplash.com/premium_photo-1674828600712-7d0caab39109",
  "Cotton Polo T-Shirt": "https://plus.unsplash.com/premium_photo-1682165232152-874f4a56b4f5",
  "Bomber Jacket": "https://plus.unsplash.com/premium_photo-1671030274122-b6ac34f87b8b",
  "Chino Trousers": "https://plus.unsplash.com/premium_photo-1683121134128-1867b48e9be5",
  "Graphic Print Hoodie": "https://plus.unsplash.com/premium_photo-1673866154288-eb720acfd38a",
  "Floral Maxi Dress": "https://plus.unsplash.com/premium_photo-1723535671118-ae4028123e40",
  "High-Waist Skinny Jeans": "https://plus.unsplash.com/premium_photo-1689536143095-eaa89c407aa7",
  "Silk Blouse": "https://plus.unsplash.com/premium_photo-1669977749819-d8737b4408f7",
  "A-line Midi Skirt": "https://plus.unsplash.com/premium_photo-1671379102281-7225f3d3d97d",
  "Off-Shoulder Top": "https://plus.unsplash.com/premium_photo-1671718110665-d6fcd488804f",
  "Wrap Around Dress": "https://plus.unsplash.com/premium_photo-1675107360188-111441548390",
  "Running Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "Leather Formal Shoes": "https://plus.unsplash.com/premium_photo-1670984281009-863453504c52",
  "Canvas Casual Shoes": "https://plus.unsplash.com/premium_photo-1705887351211-5608f389ed06",
  "Ankle Boots": "https://plus.unsplash.com/premium_photo-1673367751797-18c2790757a1",
  "Slip-on Loafers": "https://plus.unsplash.com/premium_photo-1705554330163-2e0ccc1808e2",
  "Chunky Platform Sneakers": "https://plus.unsplash.com/premium_photo-1728664898233-ad366f4cb584",
  "Leather Belt": "https://plus.unsplash.com/premium_photo-1726769202190-ad2a3f2f360b",
  "Aviator Sunglasses": "https://plus.unsplash.com/premium_photo-1692809752496-a4fa0a49531c",
  "Analog Wrist Watch": "https://plus.unsplash.com/premium_photo-1728582543460-1692e08eacbc",
  "Canvas Backpack": "https://plus.unsplash.com/premium_photo-1664110691115-790e20a41744",
  "Silk Scarf": "https://plus.unsplash.com/premium_photo-1729523163169-7b4c521615c8",
  "Beaded Necklace": "https://plus.unsplash.com/premium_photo-1673958390878-7d1bea717190",
  "Banarasi Silk Saree": "https://plus.unsplash.com/premium_photo-1691030255932-a510021e8815",
  "Anarkali Kurta Set": "https://plus.unsplash.com/premium_photo-1720798653748-061d0bfeb0a0",
  "Men's Nehru Jacket": "https://images.unsplash.com/photo-1618998300304-66165e377760",
  "Embroidered Lehenga": "https://plus.unsplash.com/premium_photo-1729708586826-0f7d8d8357d3",
  "Cotton Kurta Pyjama": "https://plus.unsplash.com/premium_photo-1691030256201-b73e0d0c60e1",
  "Chikankari Dupatta": "https://plus.unsplash.com/premium_photo-1769089324607-3e1bc945d32c",
};

const photoForProduct = (title) => {
  const name = title.toLowerCase();
  if (/(shoe|sneaker|boot|loafer)/.test(name)) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
  if (/(saree|kurta|lehenga|dupatta|nehru)/.test(name)) return "https://images.unsplash.com/photo-1610030469983-98e550d6193c";
  if (/(watch|belt|sunglass|backpack|scarf|necklace)/.test(name)) return "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561";
  if (/(dress|skirt|blouse|top)/.test(name)) return "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446";
  return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab";
};

function photoIndex(value) {
  return [...String(value)].reduce((total, char) => total + char.charCodeAt(0), 0) % fashionPhotos.length;
}

// The original seed data uses source.unsplash.com, an endpoint that no longer serves images.
// Keep existing uploaded images untouched and replace only those retired URLs.
export function imageUrl(url, label = "fashion") {
  if (url && !url.includes("source.unsplash.com")) return url;
  const photo = namedPhotos[label] || photoForProduct(label) || fashionPhotos[photoIndex(`${url || ""}${label}`)];
  return `${photo}?auto=format&fit=crop&w=1000&q=85`;
}
