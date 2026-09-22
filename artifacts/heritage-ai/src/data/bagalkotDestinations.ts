export type DestinationCategory =
  | 'Heritage'
  | 'Pilgrimage & culture'
  | 'Museums'
  | 'Nature / tourism'
  | 'Unique Bagalkot experience';

export type DestinationPhoto = {
  src: string;
  alt: string;
  credit: string;
};

export type BagalkotDestination = {
  slug: string;
  name: string;
  location: string;
  category: DestinationCategory;
  accent: string;
  summary: string;
  about: string;
  significance: string;
  attractions: string[];
  thingsToSee: string[];
  visitorInfo: string[];
  photos: DestinationPhoto[];
  sourceLabel: string;
  sourceUrl: string;
  verificationStatus: 'verified' | 'requires-verification';
  verificationNote?: string;
  nearbySlugs: string[];
  specialSection?: {
    title: string;
    paragraphs: string[];
  };
};

const districtSource = 'https://bagalkot.nic.in/en/tourist-places/';
const tourismSource = 'https://bagalkot.nic.in/en/tourism/';
const canineSource = 'https://kvafsu.edu.in/crict_bagalkot.html';
const officialPhotoCredit = 'Bagalkot district official tourism gallery';

const photos = (urls: string[], name: string, credit = officialPhotoCredit): DestinationPhoto[] =>
  urls.map((src, index) => ({ src, alt: `${name}, official photograph ${index + 1}`, credit }));

export const bagalkotDestinations: BagalkotDestination[] = [
  {
    slug: 'badami-cave-temples',
    name: 'Badami Cave Temples',
    location: 'Badami, Bagalkot district',
    category: 'Heritage',
    accent: 'Rock-cut sanctuaries',
    summary: 'Four rock-cut caves shaped into the sandstone cliffs of Badami.',
    about:
      'The Badami cave temples are rock-cut sanctuaries in the former Chalukyan capital of Badami. The district record describes four caves with Hindu and Jain imagery carved into the red sandstone landscape.',
    significance:
      'The caves show how sacred architecture, sculpture, and the natural cliff were made into one composition during the early Chalukyan period.',
    attractions: ['Cave I', 'Cave II', 'Cave III', 'Cave IV'],
    thingsToSee: ['Rock-cut columns and sanctums', 'Carved Hindu imagery', 'The Jain cave and its figures', 'The sandstone cliff setting'],
    visitorInfo: ['The district tourism page provides the official site description and gallery.', 'Check current access conditions locally before travelling.'],
    photos: photos(
      [
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/07/2018072683-300x204.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/07/2018072729.gif',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/07/2018072725.gif',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/07/2018072785.gif',
      ],
      'Badami Cave Temples',
    ),
    sourceLabel: 'Bagalkot district · Badami Caves',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/badami-caves',
    verificationStatus: 'verified',
    nearbySlugs: ['badami-fort', 'mahakuta', 'pattadakal', 'aihole'],
  },
  {
    slug: 'pattadakal',
    name: 'Pattadakal',
    location: 'Pattadakal, Bagalkot district',
    category: 'Heritage',
    accent: 'Chalukyan temple ensemble',
    summary: 'A temple group on the Malaprabha river valley where architectural styles meet.',
    about:
      'The Pattadakal monuments sit in the Malaprabha river valley. The district describes a group of temples and smaller shrines representing the climax of early Western Chalukyan architecture.',
    significance:
      'Pattadakal is the ceremonial and architectural high point of the Badami Chalukyan tradition, with northern and southern temple forms represented together.',
    attractions: ['Virupaksha Temple', 'Mallikarjuna Temple', 'Sangameshwar Temple', 'Jain Temple'],
    thingsToSee: ['Temple sculpture', 'Northern and southern tower forms', 'The river valley setting', 'The group of monuments and minor shrines'],
    visitorInfo: ['The district tourism page provides the official site description and gallery.', 'Check current access conditions locally before travelling.'],
    photos: photos(
      [
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/03/2018072139-1-300x210.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072827-rssv6f6nw3hp0tavcqjcyqevromi6bv0o6r2cc1dhm.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072831-1-rssv6f6nw3hp0tavcqjcyqevromi6bv0o6r2cc1dhm.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072889-1-rssv6ol1sfuk8wx7tulmno1hpjc6bawc1h9x53nfre.jpg',
      ],
      'Pattadakal',
    ),
    sourceLabel: 'Bagalkot district · Pattadakal',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/pattadakal',
    verificationStatus: 'verified',
    nearbySlugs: ['aihole', 'badami-cave-temples', 'mahakuta'],
  },
  {
    slug: 'aihole',
    name: 'Aihole',
    location: 'Aihole, Bagalkot district',
    category: 'Heritage',
    accent: 'Early temple experimentation',
    summary: 'An early temple landscape with forms that were tested, changed, and refined in stone.',
    about:
      'The district describes Aihole as a place of historical importance and a cradle of Hindu rock architecture, with temple groups spread across the village and surrounding landscape.',
    significance:
      'Aihole makes architectural change visible: different plans, elevations, and sacred spaces sit close enough to compare as a field study.',
    attractions: ['Durga Temple', 'Ladh Khan Temple', 'Meguti Temple', 'Ravanphadi Cave'],
    thingsToSee: ['Apsidal and rectangular plans', 'Rock-cut and structural temples', 'Meguti hillocks', 'The village-wide temple landscape'],
    visitorInfo: ['The district tourism page provides the official site description and gallery.', 'Check current access conditions locally before travelling.'],
    photos: photos(
      [
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/06/2018071651-300x207.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072858-rssv6jvuu9o4mv41lakht786qlzc8tdocu0hqpuemi.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072817-rssv6daziff4dldlnpq3tqvykwvrqxnjzxg3ds45u2.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072881-rssv6nn7llt9xaykzc7036a145gt3lslpcmfntotxm.jpg',
      ],
      'Aihole',
    ),
    sourceLabel: 'Bagalkot district · Aihole',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/aihole/',
    verificationStatus: 'verified',
    nearbySlugs: ['pattadakal', 'badami-cave-temples', 'aihole-museum'],
  },
  {
    slug: 'mahakuta',
    name: 'Mahakuta',
    location: 'Mahakuta village, Bagalkot district',
    category: 'Heritage',
    accent: 'Shaiva temple complex',
    summary: 'A Shaiva temple group connected to the early Chalukyan landscape around Badami.',
    about:
      'The Mahakuta group of temples is located in Mahakuta village. The district identifies it as an important Hindu place of worship and the location of a Shaiva monastery.',
    significance:
      'The district dates the temples to the 6th or 7th century and connects their architectural style to the early Chalukya temples of nearby Aihole.',
    attractions: ['Mahakuta temple group', 'Shaiva monastery', 'Temple inscriptions'],
    thingsToSee: ['Temple masonry and sculpture', 'The complex setting', 'The Mahakuta Pillar inscription context', 'The relationship to nearby Chalukyan sites'],
    visitorInfo: ['The district tourism page provides the official site description and gallery.', 'Respect active worship and check current access locally.'],
    photos: photos(
      [
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/07/2018072193-300x94.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072895-2-rssv6pivz9vukivuod0985syax7jj002dlxemdm1l6.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072871-2-rssv6mpderrzlozy4tsdioikirlfvwovd7yy6jq83u.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072881-3-rssv6nn7llt9xaykzc7036a145gt3lslpcmfntotxm.jpg',
      ],
      'Mahakuta',
    ),
    sourceLabel: 'Bagalkot district · Mahakuta',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/mahakuta',
    verificationStatus: 'verified',
    nearbySlugs: ['badami-cave-temples', 'badami-fort', 'pattadakal'],
  },
  {
    slug: 'badami-fort',
    name: 'Badami Fort',
    location: 'Badami, Bagalkot district',
    category: 'Heritage',
    accent: 'Hilltop fort landscape',
    summary: 'A hilltop fort landscape above Badami, reached through the same sandstone setting as the caves.',
    about:
      'The official Badami Caves record describes Badami Fort as strategically situated on the hill, with granaries, a treasury, temples, and an old gun reached by steps cut between the caves.',
    significance:
      'The fort adds the political and defensive layer to Badami’s better-known sacred cliff architecture.',
    attractions: ['Hilltop fort area', 'Malegitti Shivalaya', 'Old gun', 'Views over Badami'],
    thingsToSee: ['Cliff paths and steps', 'Fort walls and hilltop remains', 'The relationship between fort and caves', 'Temple remains on the hill'],
    visitorInfo: ['The fort is documented within the official Badami Caves tourism page.', 'Access, walking conditions, and permissions should be checked locally.'],
    photos: photos(
      [
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/2018/07/2018072785.gif',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072842-1-rssv6h2c9rk9o1851rcm3pxsygd8lq2hcg21avyl56.jpg',
        'https://cdn.s3waas.gov.in/s3a1d33d0dfec820b41b54430b50e96b5c/uploads/bfi_thumb/2018072821-rssv6e8tp9gep7c8i84qe8nf6ar4ymrac23kv22rnu.jpg',
      ],
      'Badami Fort',
    ),
    sourceLabel: 'Bagalkot district · Badami Caves',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/badami-caves',
    verificationStatus: 'verified',
    nearbySlugs: ['badami-cave-temples', 'mahakuta', 'pattadakal'],
  },
  {
    slug: 'kudalasangama',
    name: 'Kudalasangama',
    location: 'Kudalasangama, Bagalkot district',
    category: 'Pilgrimage & culture',
    accent: 'River confluence pilgrimage',
    summary: 'A pilgrimage landscape at the confluence of the Krishna and Malaprabha rivers.',
    about:
      'The district identifies Kudalasangama as an important Lingayat pilgrimage centre. Its name is also written as Kudala Sangama in official district material.',
    significance:
      'The confluence gives the site both geographic and devotional meaning, with the river landscape central to the experience of place.',
    attractions: ['River confluence', 'Kudalasangama temple precinct', 'Basavanna pilgrimage tradition'],
    thingsToSee: ['The meeting of the rivers', 'Temple architecture', 'Pilgrimage activity', 'The wider river landscape'],
    visitorInfo: ['The district tourism pages identify the site and its pilgrimage importance.', 'Check local festival conditions and access before travelling.'],
    photos: [],
    sourceLabel: 'Bagalkot district · Places of interest',
    sourceUrl: 'https://bagalkot.nic.in/en/places-of-interest/',
    verificationStatus: 'verified',
    nearbySlugs: ['almatti-dam', 'chikka-sangama'],
  },
  {
    slug: 'shivayogi-mandir',
    name: 'Shivayogi Mandir',
    location: 'Bagalkot district · exact location requires verification',
    category: 'Pilgrimage & culture',
    accent: 'Pilgrimage and culture',
    summary: 'A requested Bagalkot pilgrimage entry retained as a verification-safe record.',
    about: 'The destination name was supplied for the Bagalkot catalogue, but an authoritative location and destination page were not confirmed in the available official district records.',
    significance: 'Detailed cultural claims are intentionally withheld until the place can be matched to an official or institutional source.',
    attractions: ['Exact site identification pending'],
    thingsToSee: ['Confirm the official name and location before publishing visitor guidance.'],
    visitorInfo: ['Requires verification: do not infer opening hours, access, ticketing, or travel details.'],
    photos: [],
    sourceLabel: 'Verification required',
    sourceUrl: districtSource,
    verificationStatus: 'requires-verification',
    verificationNote: 'The catalogue keeps this requested destination visible without inventing a location or visitor information.',
    nearbySlugs: ['kudalasangama', 'banashankari-temple'],
  },
  {
    slug: 'chikka-sangama',
    name: 'Chikka Sangama',
    location: 'Bagalkot district · exact location requires verification',
    category: 'Pilgrimage & culture',
    accent: 'River and temple landscape',
    summary: 'A district-listed cultural entry awaiting a complete verified destination record.',
    about: 'Chikka Sangama appears in the Bagalkot district tourism navigation, but the exact destination details needed for a full visitor catalogue entry were not confirmed from the available source pages.',
    significance: 'The exact cultural and historical significance is left open until an official destination record is confirmed.',
    attractions: ['Exact site identification pending'],
    thingsToSee: ['Confirm the official temple or river-site name before planning a visit.'],
    visitorInfo: ['Requires verification: do not infer opening hours, access, ticketing, distances, or travel times.'],
    photos: [],
    sourceLabel: 'Bagalkot district navigation · details require verification',
    sourceUrl: tourismSource,
    verificationStatus: 'requires-verification',
    verificationNote: 'The district names Chikka Sangama, but this page does not publish enough verified detail for a richer guide.',
    nearbySlugs: ['kudalasangama', 'almatti-dam'],
  },
  {
    slug: 'banashankari-temple',
    name: 'Banashankari Temple',
    location: 'Near Badami, Bagalkot district',
    category: 'Pilgrimage & culture',
    accent: 'Temple and festival tradition',
    summary: 'A temple near Badami included in the district’s festival and tourism references.',
    about: 'The official Badami tourism record names the Banashankari Temple and notes its festival near Badami during January and February.',
    significance: 'The temple is part of the living pilgrimage and festival landscape around Badami.',
    attractions: ['Temple precinct', 'Banashankari festival tradition'],
    thingsToSee: ['Active worship', 'Temple details', 'Festival atmosphere when locally confirmed'],
    visitorInfo: ['The district source confirms the temple name and festival reference.', 'Check current festival dates, access, and worship protocols locally.'],
    photos: [],
    sourceLabel: 'Bagalkot district · Badami Caves',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/badami-caves',
    verificationStatus: 'verified',
    nearbySlugs: ['badami-cave-temples', 'badami-fort', 'mahakuta'],
  },
  {
    slug: 'badami-archaeological-museum',
    name: 'Badami Archaeological Museum / Museum & Art Gallery',
    location: 'Badami, Bagalkot district',
    category: 'Museums',
    accent: 'Archaeology and sculpture',
    summary: 'A museum entry for reading the archaeological record alongside Badami’s monuments.',
    about: 'The museum name is retained as requested for the Bagalkot catalogue. The available source set did not confirm a complete official visitor page for the combined name.',
    significance: 'A museum visit can provide context for sculpture, inscriptions, and archaeological material connected to the region, but the exact collection should be checked against the institution before publication.',
    attractions: ['Archaeological collection record pending'],
    thingsToSee: ['Confirm current galleries and artifact categories with the museum or responsible institution.'],
    visitorInfo: ['Requires verification: do not infer opening hours, ticket prices, photography rules, or access permissions.'],
    photos: [],
    sourceLabel: 'Verification required',
    sourceUrl: districtSource,
    verificationStatus: 'requires-verification',
    verificationNote: 'The requested museum entry is present, but the exact institutional record and photo set require confirmation.',
    nearbySlugs: ['badami-cave-temples', 'badami-fort'],
  },
  {
    slug: 'navanagar-museum',
    name: 'Navanagar Museum, Bagalkot',
    location: 'Navanagar, Bagalkot district',
    category: 'Museums',
    accent: 'Local history and material culture',
    summary: 'A Bagalkot museum entry held for a verified institutional record.',
    about: 'The museum name and location were supplied for the catalogue. A complete official museum record was not confirmed in the available source pages, so the guide does not invent collection details.',
    significance: 'The museum’s historical and cultural significance should be described from its own institutional material once verified.',
    attractions: ['Collection details pending verification'],
    thingsToSee: ['Confirm the museum’s current galleries and artifact categories.'],
    visitorInfo: ['Requires verification: do not infer opening hours, ticket prices, photography rules, or access permissions.'],
    photos: [],
    sourceLabel: 'Verification required',
    sourceUrl: districtSource,
    verificationStatus: 'requires-verification',
    verificationNote: 'The catalogue keeps the requested museum visible while avoiding unsupported collection claims.',
    nearbySlugs: ['almatti-dam', 'kudalasangama'],
  },
  {
    slug: 'aihole-museum',
    name: 'Aihole Museum',
    location: 'Aihole, Bagalkot district',
    category: 'Museums',
    accent: 'Archaeology and temple sculpture',
    summary: 'A museum entry to pair with Aihole’s open-air temple landscape.',
    about: 'The museum name is retained as requested. A dedicated official museum page was not confirmed in the available district tourism source set, so collection details remain deliberately general.',
    significance: 'Its value should be read through the archaeological and sculptural context of Aihole, subject to confirmation from the responsible institution.',
    attractions: ['Museum record pending verification'],
    thingsToSee: ['Confirm the current artifact categories and galleries before travelling.'],
    visitorInfo: ['Requires verification: do not infer opening hours, ticket prices, photography rules, or access permissions.'],
    photos: [],
    sourceLabel: 'Verification required',
    sourceUrl: 'https://bagalkot.nic.in/en/tourist-place/aihole/',
    verificationStatus: 'requires-verification',
    verificationNote: 'The nearby Aihole monument record is verified; this separate museum entry still needs an institutional source.',
    nearbySlugs: ['aihole', 'pattadakal'],
  },
  {
    slug: 'almatti-dam',
    name: 'Almatti Dam',
    location: 'Almatti, Bagalkot district',
    category: 'Nature / tourism',
    accent: 'River, reservoir, and engineering',
    summary: 'A Krishna River hydroelectric project and reservoir landscape in northern Karnataka.',
    about: 'The Bagalkot district tourism record identifies Almatti Dam as a hydroelectric project on the Krishna River in North Karnataka.',
    significance: 'The site offers a different way to read Bagalkot: through river infrastructure, water, and the scale of a modern regional landscape.',
    attractions: ['Almatti Dam', 'Reservoir landscape', 'Krishna River setting'],
    thingsToSee: ['The dam and water landscape', 'Publicly accessible viewpoints where confirmed', 'Seasonal changes in the reservoir'],
    visitorInfo: ['The district source confirms the dam as a tourism entry.', 'Do not assume access to operational or restricted areas; verify locally.'],
    photos: [],
    sourceLabel: 'Bagalkot district · Tourist places',
    sourceUrl: districtSource,
    verificationStatus: 'verified',
    nearbySlugs: ['kudalasangama', 'chikka-sangama'],
  },
  {
    slug: 'mudhol-hound-thimmapur',
    name: 'Mudhol Hound / Canine Research & Information Centre, Thimmapur',
    location: 'Thimmapur, Mudhol Taluk, Bagalkot district',
    category: 'Unique Bagalkot experience',
    accent: 'Breed conservation and research',
    summary: 'A university-run research and conservation centre connected to the Mudhol Hound.',
    about: 'KVAFSU identifies the Canine Research and Information Center (Mudhol Hound) at Thimmapur, Bagalkot. The centre works on the development and conservation of the Mudhol Hound breed.',
    significance:
      'The centre connects a locally named breed with institutional conservation and research rather than treating it as a generic attraction.',
    attractions: ['Canine Research & Information Centre', 'Mudhol Hound conservation work', 'KVAFSU institutional context'],
    thingsToSee: ['Research and conservation context', 'The centre’s official information', 'The Mudhol Hound as a breed'],
    visitorInfo: ['The official KVAFSU page confirms the centre and its location.', 'Visitor access, permissions, and animal interaction are not assumed; contact the institution before planning a visit.'],
    photos: photos(
      [
        'https://kvafsu.edu.in/cric_bagalkot/images/home.jpg',
        'https://kvafsu.edu.in/images/header_inner_img.jpg',
        'https://kvafsu.edu.in/images/header_inner_img1.jpg',
        'https://kvafsu.edu.in/images/header_inner_img2.jpg',
      ],
      'Mudhol Hound / Canine Research & Information Centre',
      'Karnataka Veterinary, Animal and Fisheries Sciences University',
    ),
    sourceLabel: 'KVAFSU · Canine Research & Information Center',
    sourceUrl: canineSource,
    verificationStatus: 'verified',
    nearbySlugs: ['navanagar-museum', 'almatti-dam'],
    specialSection: {
      title: 'Discover the Mudhol Hound',
      paragraphs: [
        'The Mudhol Hound is a sighthound associated with Mudhol and the Bagalkot region. Its identity is tied to local breeding history and the long, lean form of a running dog.',
        'The Canine Research & Information Centre at Thimmapur is part of KVAFSU’s work on the development and conservation of the breed. The university describes the centre as beginning its conservation work during 2010–11.',
        'This guide does not claim that visitors can see or interact with dogs. Confirm visitor access, permissions, and current institutional arrangements directly with the centre.',
      ],
    },
  },
  {
    slug: 'panchaganga-shiva-temple',
    name: 'Panchaganga / Shiva Temple',
    location: 'Bagalkot district · exact location requires verification',
    category: 'Unique Bagalkot experience',
    accent: 'Temple tradition',
    summary: 'A requested Shiva-temple entry retained until its exact official record can be matched.',
    about: 'The requested name was not matched to a sufficiently clear official destination record in the available Bagalkot source pages.',
    significance: 'No historical or cultural claims are added until the exact temple identity and location are verified.',
    attractions: ['Exact site identification pending'],
    thingsToSee: ['Confirm the official name, location, and temple context before travelling.'],
    visitorInfo: ['Requires verification: do not infer opening hours, access, ticketing, distances, or travel times.'],
    photos: [],
    sourceLabel: 'Verification required',
    sourceUrl: districtSource,
    verificationStatus: 'requires-verification',
    verificationNote: 'This requested entry is intentionally conservative until an official place record is confirmed.',
    nearbySlugs: ['kudalasangama', 'mahakuta'],
  },
];

export function getDestination(slug: string | undefined): BagalkotDestination | undefined {
  return bagalkotDestinations.find((destination) => destination.slug === slug);
}

export const destinationCategories: Array<'All' | DestinationCategory> = [
  'All',
  'Heritage',
  'Pilgrimage & culture',
  'Museums',
  'Nature / tourism',
  'Unique Bagalkot experience',
];