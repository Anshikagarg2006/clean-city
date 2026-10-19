// Synthetic Civic Social Posts Generator for Punjab Cities:
// Phagwara, Jalandhar, Ludhiana, Amritsar
// Total: ~40 realistic synthetic social media posts (~10 per city).
// Clearly flagged with isSynthetic: true.

import { LOCALITY_COORDS, PUNJAB_CITIES_COORDS, countUsersInRadius } from '../utils/geoUtils.js';
import { MUNICIPAL_AUTHORITIES_PUNJAB } from '../utils/authorityUtils.js';

const CITIES = {
  Phagwara: [
    "Model Town",
    "Law Gate (Maheru)",
    "Hadiabad",
    "Satnampura",
    "Palahi Road",
    "Guru Hargobind Nagar",
    "Subhash Nagar",
    "Urban Estate",
    "GT Road Bypass",
    "Banga Road"
  ],
  Jalandhar: [
    "Model Town",
    "Civil Lines",
    "Rama Mandi",
    "Basti Nau",
    "Jalandhar Cantt",
    "Urban Estate Phase II",
    "Jyoti Chowk",
    "Nakodar Road",
    "Ladowali Road",
    "Suranussi"
  ],
  Ludhiana: [
    "Sarabha Nagar",
    "Civil Lines",
    "Ghumar Mandi",
    "Model Town",
    "Dugri Phase 1",
    "Focal Point Industrial Area",
    "Haibowal Kalan",
    "Clock Tower Market",
    "BRS Nagar",
    "Gill Road"
  ],
  Amritsar: [
    "Ranjit Avenue",
    "Lawrence Road",
    "Heritage Street (Golden Temple)",
    "Majitha Road",
    "Chheharta",
    "Batala Road",
    "Mall Road",
    "Putligarh",
    "Circular Road",
    "Guru Nanak Dev University Area"
  ]
};

const CATEGORIES = [
  {
    name: "Potholes & Damaged Road",
    captions: [
      "Deep crater-like pothole right in the middle of the street! Two-wheelers are skidding daily, especially after dark. Please take care around this turn.",
      "Asphalt has completely worn away along this busy market stretch. Exposed sharp gravel caused multiple punctures this morning.",
      "Major trench dug last week for pipeline work was left unpaved. Axle-breaking hazard during peak school rush hours.",
      "Dangerous series of potholes stretching over 40 meters. Rainwater fills them up making them invisible to passing cars."
    ],
    photos: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584463699039-4467d3b5b5df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Garbage Dump & Waste Accumulation",
    captions: [
      "Huge pile of uncollected municipal waste spilling onto the main walkway. Foul smell is making it unbearable for nearby vendors and residents.",
      "Overflowing community garbage container attracting stray animals. Trash has scattered into the residential park entrance.",
      "Illegal dumping of commercial packaging and plastic cartons behind the shopping complex. Needs immediate community attention.",
      "Market vegetable residue left unattended for over 48 hours. Urgent sanitation clearing required before it becomes a major health risk."
    ],
    photos: [
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Broken Streetlighting",
    captions: [
      "Four consecutive streetlights have been completely dark for three days. The entire intersection is pitch black after 7 PM.",
      "Streetlight pole with exposed low-hanging wires at pedestrian level near the tuition center. Serious shock risk for kids.",
      "Flickering high-mast lamp pole that shuts off randomly. Pedestrians feel unsafe walking back from the bus stop.",
      "Streetlight fixture broken and hanging precariously by a single cable after yesterday's high winds."
    ],
    photos: [
      "/assets/dark-streetlight.jpg",
      "/assets/dark-streetlight.jpg"
    ]
  },
  {
    name: "Water Leakage & Burst Pipe",
    captions: [
      "Municipal water supply line fractured! Clean drinking water is gushing across the road and flooding the corner sidewalk.",
      "Underground pipe joint leaking continuous stream for over 36 hours. Water pressure in surrounding homes has dropped to zero.",
      "High pressure water valve leak creating an artificial pond on the bicycle track. Hundreds of gallons wasted every hour.",
      "Burst main line causing road soil to erode from underneath. Urgent repair needed before the road caves in."
    ],
    photos: [
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Open Drain & Waterlogging",
    captions: [
      "Open storm drain choked with single-use plastics and silt. Contaminated blackwater is backing up onto shop entrances.",
      "Stagnant dirty water pooling across the intersection for 4 days. Mosquito breeding hotspot right next to residential apartments.",
      "Broken concrete slab fell into the stormwater culvert, completely blocking flow. Rainwater has no way out.",
      "Open manhole left completely uncovered on the pedestrian footpath. Someone placed a tree branch as a warning sign!"
    ],
    photos: [
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Damaged Public Infrastructure",
    captions: [
      "Bus waiting shelter roof collapsed partially after rain. Daily commuters have no protection from sun or rain.",
      "Vandalized benches and broken swings in the neighborhood children's playground. Dangerous sharp metal exposed.",
      "Rusted steel guardrail on the canal bridge broke away. High risk for night-time two-wheeler traffic.",
      "Public water dispenser tap broken off and vandalized. Surrounding area turned into muddy marshland."
    ],
    photos: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const CITIZEN_NAMES = [
  { name: "Amanpreet Singh", handle: "@aman_singh_pb", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman" },
  { name: "Gurinder Kaur", handle: "@gurinder_k", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gurinder" },
  { name: "Simranjit Singh", handle: "@simran_punjab", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simran" },
  { name: "Harmanpreet Virdi", handle: "@harman_virdi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harman" },
  { name: "Manpreet Johal", handle: "@manpreet_j", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manpreet" },
  { name: "Navneet Sandhu", handle: "@navneet_sandhu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Navneet" },
  { name: "Rajinder Kumar", handle: "@rajinder_k", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajinder" },
  { name: "Balwinder Sharma", handle: "@balwinder_s", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Balwinder" },
  { name: "Jaspreet Bhasin", handle: "@jaspreet_b", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jaspreet" },
  { name: "Taranjit Deol", handle: "@taranjit_d", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taranjit" },
  { name: "Kirandeep Gill", handle: "@kiran_gill", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran" },
  { name: "Amandeep Grewal", handle: "@aman_grewal", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amandeep" }
];

const STATUSES = ["Community Alerted", "Under Community Review", "Authority Contacted", "Resolved"];
const URGENCIES = ["Low", "Medium", "High", "Critical"];

export function generateSyntheticReports() {
  const posts = [];
  const cityNames = Object.keys(CITIES);
  let idCounter = 101;

  // Generate 10 posts for each of the 4 cities = 40 total synthetic posts
  cityNames.forEach((city, cityIdx) => {
    const localities = CITIES[city];

    for (let i = 0; i < 10; i++) {
      const categoryObj = CATEGORIES[(i + cityIdx) % CATEGORIES.length];
      const locality = localities[i % localities.length];
      const caption = categoryObj.captions[i % categoryObj.captions.length];
      const photo = categoryObj.photos[i % categoryObj.photos.length];
      const citizen = CITIZEN_NAMES[(i + cityIdx * 3) % CITIZEN_NAMES.length];

      // Realistic hours ago (from 1 hour to 4 days)
      const hoursAgo = (i * 7 + cityIdx * 3 + 2) % 72 + 1;
      let timeLabel = `${hoursAgo}h ago`;
      if (hoursAgo > 24) {
        const days = Math.floor(hoursAgo / 24);
        timeLabel = days === 1 ? 'Yesterday' : `${days}d ago`;
      }

      // Generate realistic coordinates around locality center
      const localityCenter = (LOCALITY_COORDS[city] && LOCALITY_COORDS[city][locality]) || PUNJAB_CITIES_COORDS[city] || { lat: 31.224, lng: 75.770 };
      const jitterLat = Math.sin(idCounter * 13) * 0.005;
      const jitterLng = Math.cos(idCounter * 17) * 0.005;
      const latitude = Number((localityCenter.lat + jitterLat).toFixed(6));
      const longitude = Number((localityCenter.lng + jitterLng).toFixed(6));

      // Notification radius: 1.0 km standard default, some with 0.5km or 2km
      const radiusKm = i % 3 === 0 ? 0.5 : i % 3 === 1 ? 1.0 : 2.0;
      const reachCalculation = countUsersInRadius(latitude, longitude, radiusKm);

      // Authority Contact: Realistic demo contact for ~60% of posts, clearly marked unverified
      let authorityContact = null;
      if (i % 3 !== 0) {
        const cityAuth = MUNICIPAL_AUTHORITIES_PUNJAB[city] || MUNICIPAL_AUTHORITIES_PUNJAB["Phagwara"];
        const authData = (categoryObj.name.includes("Streetlight") || categoryObj.name.includes("Electricity"))
          ? cityAuth.power
          : (categoryObj.name.includes("Pothole") || categoryObj.name.includes("Road"))
            ? cityAuth.roads
            : cityAuth.general;
        
        authorityContact = {
          name: authData.name,
          phone: authData.phone,
          email: authData.email,
          websiteUrl: authData.websiteUrl,
          isVerified: false
        };
      }

      // Likes and engagement
      const likesCount = ((i * 9 + cityIdx * 5 + 7) % 38) + 4;

      // Realistic initial comments
      const comments = [];
      if (i % 2 === 0) {
        comments.push({
          id: `comment-syn-${idCounter}-1`,
          author: `Resident (${locality})`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Res${idCounter}`,
          text: `I pass this spot every morning on my way to work. It has gotten significantly worse this week.`,
          timestamp: `2h ago`,
          isOwn: false
        });
      }
      if (i % 3 === 0) {
        comments.push({
          id: `comment-syn-${idCounter}-2`,
          author: `Ward Volunteer`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Vol${idCounter}`,
          text: `Thanks for posting! We have shared this link in our neighborhood WhatsApp group to mobilize more attention.`,
          timestamp: `4h ago`,
          isOwn: false
        });
      }

      // Additional community observations
      const additionalInfo = [];
      if (i % 2 === 1) {
        additionalInfo.push({
          id: `info-syn-${idCounter}-1`,
          author: `Neighbor near ${locality}`,
          text: `Local shopkeepers placed fluorescent tape around the perimeter as a temporary warning for night traffic.`,
          timestamp: `Yesterday`
        });
      }

      posts.push({
        id: `CC-PB-POST-${idCounter++}`,
        isSynthetic: true,
        author: citizen,
        title: `${categoryObj.name} at ${locality}`,
        caption: caption,
        category: categoryObj.name,
        city: city,
        locality: locality,
        latitude: latitude,
        longitude: longitude,
        approxLatitude: Number(latitude.toFixed(3)),
        approxLongitude: Number(longitude.toFixed(3)),
        photo: photo,
        postedAt: timeLabel,
        notificationRadiusKm: radiusKm,
        notifiedCommunityCount: reachCalculation.count,
        likes: likesCount,
        isLikedByUser: false,
        isSavedByUser: false,
        comments: comments,
        additionalInfo: additionalInfo,
        authorityContact: authorityContact,
        // Backward-compatibility fields
        description: caption,
        urgency: i % 4 === 0 ? "Critical" : i % 2 === 0 ? "High" : "Medium",
        status: i % 4 === 3 ? "Resolved" : "Community Alerted",
        reportedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString().split('T')[0]
      });
    }
  });

  return posts;
}

export const CITIES_CONFIG = CITIES;
export const CATEGORIES_CONFIG = CATEGORIES.map(c => c.name);
export const STATUSES_CONFIG = STATUSES;
export const URGENCIES_CONFIG = URGENCIES;
export const SAMPLE_CITIZENS = CITIZEN_NAMES;
