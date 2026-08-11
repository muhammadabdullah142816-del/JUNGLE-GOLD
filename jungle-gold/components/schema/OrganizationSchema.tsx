export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://junglegold.pk/#organization',
    name: 'Jungle Gold Raw Honey Pakistan',
    url: 'https://junglegold.pk',
    logo: 'https://junglegold.pk/brand-logo.png',
    image: 'https://junglegold.pk/brand-logo.png',
    description:
      "Pakistan's premier producer of 100% pure raw jungle honey and unpasteurized organic Sidr honey harvested from Swat, Skardu, and Margalla Hills. Backed by the legacy & trust of Razzaq Pansar Store. Delivering nationwide via Cash on Delivery.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gujrat',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '32.5742',
      longitude: '74.0754',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Razzaq Pansar Store',
      description:
        'A trusted authority in authentic herbal, natural, and traditional wellness products in Pakistan.',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Pakistan',
      },
      {
        '@type': 'City',
        name: 'Lahore',
      },
      {
        '@type': 'City',
        name: 'Karachi',
      },
      {
        '@type': 'City',
        name: 'Islamabad',
      },
      {
        '@type': 'City',
        name: 'Rawalpindi',
      },
      {
        '@type': 'City',
        name: 'Peshawar',
      },
      {
        '@type': 'City',
        name: 'Gujrat',
      },
      {
        '@type': 'City',
        name: 'Faisalabad',
      },
      {
        '@type': 'City',
        name: 'Multan',
      },
    ],
    priceRange: 'PKR 1,200 - PKR 4,500',
    paymentAccepted: 'Cash on Delivery (COD), Online Bank Transfer',
    currenciesAccepted: 'PKR',
    knowsAbout: [
      'Pure Raw Jungle Honey',
      'Unpasteurized Organic Honey',
      'Organic Sidr Beri Honey Pakistan',
      'Wild Forest Honey Swat & Skardu',
      'PCSIR Lab Tested Raw Honey',
      'Bee Pollen and Propolis',
      'Razzaq Pansar Store Traditional Wellness',
    ],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Nationwide Cash on Delivery (COD) Raw Honey Shipping',
      },
      priceCurrency: 'PKR',
      price: '0.00',
      eligibleRegion: {
        '@type': 'Country',
        name: 'Pakistan',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
