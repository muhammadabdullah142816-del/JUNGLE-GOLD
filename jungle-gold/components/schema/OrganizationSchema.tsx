export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://junglegold.pk/#organization',
    name: 'Jungle Gold Raw Honey',
    url: 'https://junglegold.pk',
    logo: 'https://junglegold.pk/logo.png',
    image: 'https://junglegold.pk/og-image.jpg',
    description:
      'Pakistan premier producer of 100% pure, unpasteurized, unheated wild forest honey harvested from Swat, Skardu, and Margalla Hills.',
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
    areaServed: {
      '@type': 'Country',
      name: 'Pakistan',
    },
    priceRange: '$$',
    paymentAccepted: 'Cash, Bank Transfer',
    currenciesAccepted: 'PKR',
    knowsAbout: [
      'Raw Sidr Honey',
      'Organic Honey',
      'Unpasteurized Wild Honey',
      'Bee Pollen and Propolis',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
