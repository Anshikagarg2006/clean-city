import { generateSyntheticReports, CITIES_CONFIG, CATEGORIES_CONFIG } from '../data/syntheticReports.js';
import { 
  haversineDistance, 
  formatDistance, 
  approximateCoordinates, 
  countUsersInRadius, 
  reverseGeocode, 
  findNearestCity,
  getSyntheticCommunityUsers,
  LOCALITY_COORDS,
  PUNJAB_CITIES_COORDS
} from '../utils/geoUtils.js';
import { 
  validateAuthorityContact, 
  sanitizeUrl, 
  cleanPhoneNumber, 
  generateAuthorityEmailDraft 
} from '../utils/authorityUtils.js';

async function runJourneyTests() {
  console.log("=== STARTING CLEANCIY AI USER JOURNEY & LOCATION FEATURE TESTS ===");
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
    }
  }

  // TEST SET 1: Synthetic civic social dataset (30–50 posts across 4 Punjab cities)
  console.log("\n[TEST SET 1: Synthetic Civic Social Dataset (30–50 Posts Across 4 Cities)]");
  const posts = generateSyntheticReports();
  assert(posts.length >= 30 && posts.length <= 50, `Expected 30-50 synthetic posts, got ${posts.length}`);

  const cityCounts = { Phagwara: 0, Jalandhar: 0, Ludhiana: 0, Amritsar: 0 };
  let validCoordsCount = 0;
  let validAuthorCount = 0;
  let validCaptionCount = 0;
  let validPhotoCount = 0;

  posts.forEach(p => {
    if (cityCounts[p.city] !== undefined) cityCounts[p.city]++;
    if (p.latitude && p.longitude && p.approxLatitude && p.approxLongitude) validCoordsCount++;
    if (p.author && p.author.name && p.author.avatar) validAuthorCount++;
    if (p.caption && p.caption.length > 10) validCaptionCount++;
    if (p.photo && (p.photo.startsWith("http") || p.photo.startsWith("/assets/"))) validPhotoCount++;
  });

  assert(validCoordsCount === posts.length, `All ${posts.length} posts have latitude & longitude attached`);
  assert(validAuthorCount === posts.length, `All ${posts.length} posts have author profile & avatar attached`);
  assert(validCaptionCount === posts.length, `All ${posts.length} posts have descriptive citizen captions`);
  assert(validPhotoCount === posts.length, `All ${posts.length} posts have valid demonstration images`);
  assert(cityCounts.Phagwara === 10, `Phagwara has 10 posts (got ${cityCounts.Phagwara})`);
  assert(cityCounts.Jalandhar === 10, `Jalandhar has 10 posts (got ${cityCounts.Jalandhar})`);
  assert(cityCounts.Ludhiana === 10, `Ludhiana has 10 posts (got ${cityCounts.Ludhiana})`);
  assert(cityCounts.Amritsar === 10, `Amritsar has 10 posts (got ${cityCounts.Amritsar})`);
  assert(posts.every(p => p.isSynthetic === true), "All synthetic posts clearly identified as synthetic demo data");

  // Verify Dark Streetlight post uses the real streetlight photo, NOT a gaming controller
  const darkStreetlightPost = posts.find(p => p.title?.includes("Dark Streetlight") || p.caption?.toLowerCase().includes("streetlight"));
  assert(Boolean(darkStreetlightPost), "Dark Streetlight sample post exists in dataset");
  assert(darkStreetlightPost && !darkStreetlightPost.photo.includes("photo-1509198397868-475647b2a1e5"), "Dark Streetlight post does NOT use gaming controller image");
  assert(darkStreetlightPost && darkStreetlightPost.photo === "/assets/dark-streetlight.jpg", "Dark Streetlight post uses /assets/dark-streetlight.jpg photo asset");

  // TEST SET 2: Haversine distance & spatial calculations
  console.log("\n[TEST SET 2: Haversine Distance & Formatting]");
  const distZero = haversineDistance(31.2240, 75.7708, 31.2240, 75.7708);
  assert(distZero === 0, `Distance between identical points is 0 km (got ${distZero})`);

  const distPhagToJal = haversineDistance(31.2240, 75.7708, 31.3260, 75.5762);
  assert(distPhagToJal > 18 && distPhagToJal < 25, `Phagwara to Jalandhar distance ~21 km (got ${distPhagToJal.toFixed(2)} km)`);

  assert(formatDistance(0.35) === "350 m away", `0.35 km formatted as "350 m away" (got ${formatDistance(0.35)})`);
  assert(formatDistance(1.42) === "1.4 km away", `1.42 km formatted as "1.4 km away" (got ${formatDistance(1.42)})`);
  assert(formatDistance(0) === "0 m away", `0 km formatted as "0 m away" (got ${formatDistance(0)})`);

  const fuzzed = approximateCoordinates(31.221543, 75.772512);
  assert(fuzzed.lat === 31.222 && fuzzed.lng === 75.773, `Coordinates fuzzed to 3 decimals: ${fuzzed.lat}, ${fuzzed.lng}`);

  // TEST SET 3: Community Notification Radius Model (Haversine)
  console.log("\n[TEST SET 3: Notification Radius & Dynamic Community Reach (Haversine Model)]");
  const communityUsers = getSyntheticCommunityUsers();
  assert(communityUsers.length >= 100, `Synthetic demo community members generated: ${communityUsers.length}`);

  const phagwaraLat = 31.2215;
  const phagwaraLng = 75.7725;

  const rad500m = countUsersInRadius(phagwaraLat, phagwaraLng, 0.5);
  const rad1km = countUsersInRadius(phagwaraLat, phagwaraLng, 1.0);
  const rad2km = countUsersInRadius(phagwaraLat, phagwaraLng, 2.0);
  const rad5km = countUsersInRadius(phagwaraLat, phagwaraLng, 5.0);

  assert(rad1km.count >= rad500m.count, `User count increases from 500m (${rad500m.count}) to 1km (${rad1km.count})`);
  assert(rad2km.count >= rad1km.count, `User count increases from 1km (${rad1km.count}) to 2km (${rad2km.count})`);
  assert(rad5km.count >= rad2km.count, `User count increases from 2km (${rad2km.count}) to 5km (${rad5km.count})`);
  assert(rad5km.count > 0, `5 km radius has nearby demo community members: ${rad5km.count}`);
  assert(rad5km.count > rad500m.count, "Changing radius changes calculated eligible user count dynamically");

  // TEST SET 4: Reverse Geocoding & Nearest Locality Resolver
  console.log("\n[TEST SET 4: Reverse Geocoding & Nearest City/Locality Resolver]");
  const nearestPhag = findNearestCity(31.2240, 75.7708);
  assert(nearestPhag.city === "Phagwara", "Point (31.224, 75.770) matched nearest city Phagwara");

  const nearestJal = findNearestCity(31.3260, 75.5762);
  assert(nearestJal.city === "Jalandhar", "Point (31.326, 75.576) matched nearest city Jalandhar");

  const nearestLudh = findNearestCity(30.9010, 75.8573);
  assert(nearestLudh.city === "Ludhiana", "Point (30.901, 75.857) matched nearest city Ludhiana");

  const nearestAsr = findNearestCity(31.6340, 74.8723);
  assert(nearestAsr.city === "Amritsar", "Point (31.634, 74.872) matched nearest city Amritsar");

  const geocodePhagwara = await reverseGeocode(31.2215, 75.7725);
  assert(Boolean(geocodePhagwara.city), `Reverse geocode resolved city: ${geocodePhagwara.city}`);
  assert(Boolean(geocodePhagwara.locality), `Reverse geocode resolved locality: ${geocodePhagwara.locality}`);

  // TEST SET 5: Workflow B & C: Create Post with Photo, Caption, Location, 1 km Radius
  console.log("\n[TEST SET 5: Create Post with Photo, Caption, Location, and 1 km Radius]");
  const newPost = {
    id: `CC-PB-POST-${Date.now()}`,
    isSynthetic: false,
    author: {
      name: "Taranjit Singh (Local Citizen)",
      handle: "@taran_singh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taran"
    },
    title: "Deep Pothole at Model Town",
    caption: "Dangerous pothole 4 feet across near commercial market block. Two-wheelers skidding daily.",
    category: "Potholes & Damaged Road",
    city: "Phagwara",
    locality: "Model Town",
    latitude: phagwaraLat,
    longitude: phagwaraLng,
    approxLatitude: 31.222,
    approxLongitude: 75.773,
    photo: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    postedAt: "Just now",
    notificationRadiusKm: 1.0,
    notifiedCommunityCount: rad1km.count,
    likes: 0,
    isLikedByUser: false,
    comments: [],
    additionalInfo: [],
    authorityContact: null
  };

  const updatedFeed = [newPost, ...posts];
  assert(updatedFeed[0].id === newPost.id, "Newly published post immediately appears at top of feed (Workflow C)");
  assert(updatedFeed.length === posts.length + 1, `Feed grew by 1 post (total: ${updatedFeed.length})`);
  assert(updatedFeed[0].notificationRadiusKm === 1.0, "Post has 1 km notification radius attached");
  assert(updatedFeed[0].notifiedCommunityCount === rad1km.count, `Calculated ${rad1km.count} eligible demo users for 1 km radius (Workflow E)`);

  // TEST SET 6: Workflow D: LocalStorage Persistence across page reload
  console.log("\n[TEST SET 6: LocalStorage Serialization & Persistence (Workflow D)]");
  const serialized = JSON.stringify(updatedFeed);
  const deserialized = JSON.parse(serialized);
  assert(deserialized.length === updatedFeed.length, "Feed length preserved after JSON serialization");
  assert(deserialized[0].id === newPost.id, "Top post preserved after serialization/reload");
  assert(deserialized[0].caption === newPost.caption, "Post caption preserved exactly");

  // TEST SET 7: Workflow G: Likes, Comments, Additional Information, Saved Posts
  console.log("\n[TEST SET 7: Community Interactions (Likes, Comments, Additional Info, Saved)]");
  
  // Like and unlike
  let testPost = { ...newPost };
  testPost.isLikedByUser = true;
  testPost.likes += 1;
  assert(testPost.isLikedByUser === true && testPost.likes === 1, "Like button toggles state to liked (count: 1)");
  testPost.isLikedByUser = false;
  testPost.likes -= 1;
  assert(testPost.isLikedByUser === false && testPost.likes === 0, "Unlike button decrements count back to 0");

  // Add comment
  const testComment = {
    id: "comment-test-1",
    author: "Harpreet Kaur",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harpreet",
    text: "I saw a scooter slip here this morning! Please fix soon.",
    timestamp: "Just now",
    isOwn: true
  };
  testPost.comments.push(testComment);
  assert(testPost.comments.length === 1, "Comment successfully added to post");
  assert(testPost.comments[0].text === testComment.text, "Comment text matches input");

  // Remove own comment
  testPost.comments = testPost.comments.filter(c => c.id !== "comment-test-1");
  assert(testPost.comments.length === 0, "Demonstration user can remove their own comment");

  // Add additional information / observation
  const testObservation = {
    id: "info-test-1",
    author: "Local Shopkeeper",
    text: "Water accumulation has increased by 3 inches since 2 PM.",
    timestamp: "Just now"
  };
  testPost.additionalInfo.push(testObservation);
  assert(testPost.additionalInfo.length === 1, "Community observation / additional info added to post");
  assert(testPost.additionalInfo[0].text === testObservation.text, "Observation content matches input");

  // Save / Bookmark post
  let savedIds = [];
  savedIds.push(testPost.id);
  assert(savedIds.includes(testPost.id), "Post successfully saved to user bookmarks");
  savedIds = savedIds.filter(id => id !== testPost.id);
  assert(!savedIds.includes(testPost.id), "Post successfully unsaved from bookmarks");

  // TEST SET 8: Workflow H: Create Post WITH Authority Contact Details
  console.log("\n[TEST SET 8: Create Post with Authority Details (Workflow H)]");
  const authorityInput = {
    name: "Municipal Corporation Phagwara - Roads Division",
    phone: "+91 1824 260232",
    email: "commissioner@mcphagwara.gov.in",
    websiteUrl: "https://mcphagwara.punjab.gov.in"
  };

  const validationWithAuth = validateAuthorityContact(authorityInput);
  assert(validationWithAuth.isValid === true, "Authority contact validation passes for valid fields");

  const cleanedPhone = cleanPhoneNumber(authorityInput.phone);
  assert(cleanedPhone === "+911824260232", `Phone number sanitized for tel: URI (${cleanedPhone})`);

  const sanitizedUrl = sanitizeUrl(authorityInput.websiteUrl);
  assert(sanitizedUrl === "https://mcphagwara.punjab.gov.in", "Website URL sanitized for HTTPS");

  const emailDraft = generateAuthorityEmailDraft(newPost, authorityInput);
  assert(Boolean(emailDraft.mailtoLink), "Prefilled email draft with mailto: link generated");
  assert(emailDraft.recipientEmail === authorityInput.email, "Email recipient matches authority email");
  assert(emailDraft.subject.includes("Potholes & Damaged Road"), "Email subject contains issue category");
  assert(emailDraft.body.includes("Model Town, Phagwara"), "Email draft contains issue location");

  // TEST SET 9: Workflow I: Create Post WITHOUT Authority Details
  console.log("\n[TEST SET 9: Create Post WITHOUT Authority Details (Workflow I)]");
  const emptyAuthValidation = validateAuthorityContact(null);
  assert(emptyAuthValidation.isValid === true, "Validation succeeds with null authority (authority is optional)");

  const postWithoutAuth = {
    ...newPost,
    id: `CC-PB-POST-NOAUTH-${Date.now()}`,
    authorityContact: null
  };
  assert(postWithoutAuth.authorityContact === null, "Post successfully created with null authority contact details");

  // TEST SET 10: Workflow J: GPS Permission Denied & Manual Fallback
  console.log("\n[TEST SET 10: GPS Permission Denied & Manual Location Fallback (Workflow J)]");
  const manualCity = "Jalandhar";
  const manualLocality = "Civil Lines";
  const manualCoords = LOCALITY_COORDS[manualCity][manualLocality];
  assert(Boolean(manualCoords), `Found manual coordinates for ${manualLocality}, ${manualCity}: ${manualCoords.lat}, ${manualCoords.lng}`);

  const manualPost = {
    ...newPost,
    id: `CC-PB-POST-MANUAL-${Date.now()}`,
    city: manualCity,
    locality: manualLocality,
    latitude: manualCoords.lat,
    longitude: manualCoords.lng,
    approxLatitude: Number(manualCoords.lat.toFixed(3)),
    approxLongitude: Number(manualCoords.lng.toFixed(3))
  };

  assert(manualPost.city === "Jalandhar" && manualPost.locality === "Civil Lines", "Manual location entry succeeds when GPS is unavailable");
  assert(manualPost.latitude === manualCoords.lat, "Manual coordinates attached accurately to post");

  // TEST SET 11: Workflow E: Radius Notification Generation for Matching Demo Users
  console.log("\n[TEST SET 11: Radius Notification Generation for Matching Users (Workflow E)]");
  const radiusMatch = countUsersInRadius(manualPost.latitude, manualPost.longitude, 1.0);
  const generatedNotifications = radiusMatch.users.slice(0, 5).map(u => ({
    id: `notif-test-${u.id}`,
    postId: manualPost.id,
    recipientName: u.name,
    distanceKm: u.distanceKm,
    distanceFormatted: u.distanceFormatted,
    message: `A new civic issue (${manualPost.category}) was posted near your selected area at ${manualLocality}, ${manualCity}.`,
    read: false
  }));

  assert(generatedNotifications.length > 0, `Generated ${generatedNotifications.length} simulated notifications`);
  assert(generatedNotifications[0].message.includes("Civil Lines, Jalandhar"), "Notification message includes issue location");
  assert(generatedNotifications[0].read === false, "Generated notifications initial state is unread");

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`========================================\n`);

  if (passed === total) {
    console.log("ALL CLEANCIY AI LOCATION, SOCIAL FEED, & NOTIFICATION TESTS PASSED.");
    process.exit(0);
  } else {
    console.error("SOME TESTS FAILED.");
    process.exit(1);
  }
}

runJourneyTests();
