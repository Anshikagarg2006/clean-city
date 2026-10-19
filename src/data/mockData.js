export const AI_PRESETS = [
  {
    id: "preset-1",
    title: "Overflowing Commercial Bins",
    category: "Municipal Solid Waste & Recyclables",
    location: "Market Square & 7th Ave",
    coordinates: { lat: 40.7128, lng: -74.006 },
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80",
    confidence: 98.4,
    severity: "High",
    severityScore: 82,
    estimatedVolume: "2.4 m³ (~310 kg)",
    carbonImpact: "Est. -48 kg CO₂e if diverted to recycling",
    materialBreakdown: [
      { name: "Corrugated Cardboard", percentage: 55, recyclable: true },
      { name: "Rigid HDPE Plastics", percentage: 25, recyclable: true },
      { name: "Mixed Organic Residue", percentage: 15, recyclable: false },
      { name: "Non-recyclable Film", percentage: 5, recyclable: false }
    ],
    recommendedAction: "Dispatch Heavy Compactor Truck #12 + Dual Bin Mechanical Lifter",
    department: "Department of Sanitation & Resource Recovery",
    priorityLevel: "P2 - Urgent (SLA < 4 hrs)",
    boundingBoxes: [
      { label: "Overflowing Bin (Cardboard)", x: 18, y: 32, width: 34, height: 48, confidence: 99.1, color: "#10b981" },
      { label: "Ground Spillage (Plastics)", x: 54, y: 52, width: 32, height: 38, confidence: 97.2, color: "#f59e0b" },
      { label: "Pedestrian Walkway Obstruction", x: 45, y: 65, width: 45, height: 28, confidence: 94.6, color: "#ef4444" }
    ]
  },
  {
    id: "preset-2",
    title: "Illegal E-Waste Dumping",
    category: "Hazardous Electronic Waste",
    location: "Riverfront Greenway Trail, Km 4.2",
    coordinates: { lat: 40.7282, lng: -73.9942 },
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    confidence: 96.8,
    severity: "Critical",
    severityScore: 94,
    estimatedVolume: "1.1 m³ (~140 kg)",
    carbonImpact: "Toxic Heavy Metal Leaching Risk (Lead/Cadmium Alert)",
    materialBreakdown: [
      { name: "Cathode / CRT Monitors", percentage: 40, recyclable: true },
      { name: "Lithium-Ion Batteries", percentage: 25, recyclable: true },
      { name: "Circuit Boards & Copper", percentage: 20, recyclable: true },
      { name: "ABS Plastics Housing", percentage: 15, recyclable: true }
    ],
    recommendedAction: "Specialized HazMat Electronic Recovery Unit #04",
    department: "Environmental Protection & Hazardous Waste Division",
    priorityLevel: "P1 - Critical Hazard (SLA < 1.5 hrs)",
    boundingBoxes: [
      { label: "Toxic Battery Unit (Fire Hazard)", x: 25, y: 40, width: 28, height: 35, confidence: 98.7, color: "#ef4444" },
      { label: "Electronics Motherboard / Cable", x: 55, y: 35, width: 35, height: 45, confidence: 95.3, color: "#8b5cf6" }
    ]
  },
  {
    id: "preset-3",
    title: "Storm Drain Plastic Clogging",
    category: "Urban Drainage & Microplastic Risk",
    location: "Corner of Elm St & 12th Boulevard",
    coordinates: { lat: 40.7359, lng: -74.0048 },
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    confidence: 97.9,
    severity: "High",
    severityScore: 78,
    estimatedVolume: "0.8 m³ (~65 kg)",
    carbonImpact: "Prevents storm flood backup & aquatic microplastic run-off",
    materialBreakdown: [
      { name: "Single-Use Plastic Bottles", percentage: 60, recyclable: true },
      { name: "Polystyrene Packaging", percentage: 25, recyclable: false },
      { name: "Vegetative Silt Debris", percentage: 15, recyclable: false }
    ],
    recommendedAction: "Hydraulic Storm Drain Jet & Vacuum Truck #09",
    department: "Bureau of Water & Municipal Drainage",
    priorityLevel: "P2 - Flood Mitigation (SLA < 3 hrs)",
    boundingBoxes: [
      { label: "Grate Choke Point (Plastic Bottles)", x: 20, y: 28, width: 58, height: 52, confidence: 98.4, color: "#06b6d4" },
      { label: "Blocked Catch Basin Inflow", x: 30, y: 60, width: 42, height: 30, confidence: 96.1, color: "#f59e0b" }
    ]
  },
  {
    id: "preset-4",
    title: "Public Park Litter & Organics",
    category: "Public Realm Litter & Green Waste",
    location: "Meadowland Community Gardens, East Gate",
    coordinates: { lat: 40.7484, lng: -73.9857 },
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
    confidence: 94.2,
    severity: "Moderate",
    severityScore: 52,
    estimatedVolume: "0.5 m³ (~35 kg)",
    carbonImpact: "Compostable organic fraction can create ~12 kg nutrient soil",
    materialBreakdown: [
      { name: "Food Containers & Paper", percentage: 45, recyclable: true },
      { name: "Biodegradable Food Scraps", percentage: 35, recyclable: true },
      { name: "Aluminum Beverage Cans", percentage: 20, recyclable: true }
    ],
    recommendedAction: "Neighborhood Eco-Crew Electric Cart #02 + Mobile Sorting Bin",
    department: "Parks & Civic Beautification",
    priorityLevel: "P3 - Standard Clean (SLA < 8 hrs)",
    boundingBoxes: [
      { label: "Recyclable Aluminum & Cans", x: 22, y: 38, width: 32, height: 30, confidence: 95.8, color: "#10b981" },
      { label: "Compostable Food Waste", x: 52, y: 48, width: 35, height: 32, confidence: 93.1, color: "#34d399" }
    ]
  }
];

export const MUNICIPAL_TICKETS = [
  {
    id: "CC-9042",
    title: "Commercial Alley Cardboard Spill",
    category: "Recyclables Overflow",
    address: "412 Broadway Ave, Downtown Core",
    reportedAt: "12 mins ago",
    status: "Dispatched",
    severity: "High",
    assignedCrew: "Sanitation Squad #08 (Lead: Officer M. Taylor)",
    assignedVehicle: "CleanTruck EV-14",
    eta: "14 mins",
    reportedBy: "Citizen Sarah K. (Level 4 Eco-Guardian)",
    aiScore: 98.2,
    beforeImage: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    logs: [
      { time: "00:02", text: "AI Computer Vision classified ticket as High Severity Recyclables" },
      { time: "00:05", text: "Auto-routed to Central District Municipal Depot" },
      { time: "00:09", text: "CleanTruck EV-14 dispatched from Station 3" }
    ]
  },
  {
    id: "CC-9038",
    title: "Mercury Lamp & Battery Disposal Hazard",
    category: "Hazardous Chemical",
    address: "88 Industrial Way, Sector 9",
    reportedAt: "45 mins ago",
    status: "In Progress",
    severity: "Critical",
    assignedCrew: "HazMat Quick Response Unit #02",
    assignedVehicle: "BioHazard Unit #02",
    eta: "On-Site (Active Cleanup)",
    reportedBy: "Anonymous Civic Ping",
    aiScore: 99.4,
    beforeImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
    logs: [
      { time: "00:45", text: "Report received via CleanCity Mobile App with geo-tag" },
      { time: "00:43", text: "HazMat alert triggered; automated safety cordon zone created" },
      { time: "00:20", text: "Specialist crew arrived on scene; chemical isolation underway" }
    ]
  },
  {
    id: "CC-9029",
    title: "Post-Concert Plaza Plastic Bottles",
    category: "Public Space Litter",
    address: "Civic Amphitheater, North Lawn",
    reportedAt: "2.5 hours ago",
    status: "Verified Cleaned",
    severity: "Moderate",
    assignedCrew: "Youth Green Corps Team Bravo",
    assignedVehicle: "Eco-Street Sweeper S-01",
    eta: "Completed",
    reportedBy: "Ranger Dave L.",
    aiScore: 95.1,
    beforeImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    resolvedAt: "45 mins ago",
    cleanlinessRating: "99.8% (AI Vision Confirmed Clean)",
    ecoKarmaAwarded: "+120 Pts to 6 Contributors",
    logs: [
      { time: "02:30", text: "Detected 4,200 sq ft litter field post-event" },
      { time: "01:45", text: "Team Bravo sweep initiated with 8 smart sorters" },
      { time: "00:45", text: "AI before/after differential analysis scored 99.8% clean; ticket auto-closed" }
    ]
  },
  {
    id: "CC-9014",
    title: "Storm Drain Debris & Stagnant Silt",
    category: "Drainage Hazard",
    address: "Corner of Elm St & 12th Blvd",
    reportedAt: "4 hours ago",
    status: "Verified Cleaned",
    severity: "High",
    assignedCrew: "Bureau of Water Drainage Crew #4",
    assignedVehicle: "HydroVac #09",
    eta: "Completed",
    reportedBy: "Citizen Elena R.",
    aiScore: 97.7,
    beforeImage: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    resolvedAt: "1.2 hours ago",
    cleanlinessRating: "100% (Flow restored to 280 L/s)",
    ecoKarmaAwarded: "+85 Pts",
    logs: [
      { time: "04:00", text: "Flood sensor & citizen report cross-referenced" },
      { time: "02:15", text: "HydroVac cleared 82 kg of synthetic waste and silt" },
      { time: "01:12", text: "Water level sensor confirmed normal drainage" }
    ]
  }
];

export const SMART_BINS = [
  { id: "BIN-101", location: "Grand Central Esplanade", fillLevel: 92, battery: 94, category: "Mixed Recycling", status: "Overflow Alert", coords: { x: 38, y: 42 } },
  { id: "BIN-102", location: "Harbor Promenade South", fillLevel: 44, battery: 88, category: "General Waste", status: "Normal", coords: { x: 62, y: 70 } },
  { id: "BIN-103", location: "Tech District Plaza", fillLevel: 86, battery: 98, category: "E-Waste Drop", status: "Near Capacity", coords: { x: 74, y: 32 } },
  { id: "BIN-104", location: "Central Metro Station", fillLevel: 28, battery: 76, category: "Compost & Organics", status: "Normal", coords: { x: 48, y: 55 } },
  { id: "BIN-105", location: "University Green Quarter", fillLevel: 75, battery: 91, category: "Glass & Aluminum", status: "Optimal", coords: { x: 22, y: 64 } },
  { id: "BIN-106", location: "Civic Library Courtyard", fillLevel: 15, battery: 99, category: "General Waste", status: "Normal", coords: { x: 80, y: 52 } }
];

export const LEADERBOARD = [
  { rank: 1, name: "Marcus Chen", handle: "@marcus_green", points: 14850, verifiedReports: 142, streakDays: 38, badge: "Master Civic Guardian", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", district: "District 4 (Downtown)" },
  { rank: 2, name: "Elena Rostova", handle: "@elena_clean", points: 12920, verifiedReports: 118, streakDays: 24, badge: "Zero Waste Hero", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", district: "District 2 (Riverfront)" },
  { rank: 3, name: "Aiden Montgomery", handle: "@aiden_eco", points: 11400, verifiedReports: 95, streakDays: 19, badge: "Litter Slayer", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80", district: "District 7 (Highland)" },
  { rank: 4, name: "Priya Patel", handle: "@priya_greencity", points: 9870, verifiedReports: 84, streakDays: 14, badge: "Drainage Protector", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80", district: "District 1 (Old Town)" },
  { rank: 5, name: "Lucas Vance", handle: "@lucas_v", points: 8640, verifiedReports: 73, streakDays: 11, badge: "Community Catalyst", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", district: "District 5 (Westside)" }
];

export const REDEEMABLE_REWARDS = [
  { id: "rew-1", title: "1-Month Unlimited City Metro Pass", cost: 1200, icon: "Train", sponsor: "Metropolitan Transit Authority", claimed: 342 },
  { id: "rew-2", title: "15% Off Municipal Clean Energy Utility Bill", cost: 2500, icon: "Zap", sponsor: "City Power & Light", claimed: 189 },
  { id: "rew-3", title: "Dedicate a Native Shade Tree in City Park", cost: 3000, icon: "Trees", sponsor: "Department of Urban Forestry", claimed: 620 },
  { id: "rew-4", title: "$25 Voucher at Local Farmers' Market Co-op", cost: 800, icon: "ShoppingBag", sponsor: "Green Markets Union", claimed: 1450 }
];

export const CITY_SECTORS = [
  { id: "SEC-1", name: "Downtown Core", cleanIndex: 94, openIssues: 3, resolvedThisWeek: 48, trend: "+4%" },
  { id: "SEC-2", name: "Riverfront Promenade", cleanIndex: 88, openIssues: 5, resolvedThisWeek: 34, trend: "+7%" },
  { id: "SEC-3", name: "Industrial Tech Corridor", cleanIndex: 79, openIssues: 8, resolvedThisWeek: 29, trend: "-2%" },
  { id: "SEC-4", name: "University Campus Quarter", cleanIndex: 96, openIssues: 2, resolvedThisWeek: 61, trend: "+11%" },
  { id: "SEC-5", name: "Suburban Greenbelt", cleanIndex: 92, openIssues: 4, resolvedThisWeek: 22, trend: "+1%" }
];
