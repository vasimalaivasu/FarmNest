/**
 * Verdant Haven - Homestay & Farmstay Booking Template
 * Centralized LocalStorage Data Manager & Mock Database
 */

const VERDANT_STORAGE_KEY = 'verdant_haven_data_v1';
const VERDANT_SESSION_KEY = 'verdant_haven_session_v1';
const VERDANT_THEME_KEY = 'verdant_haven_theme_v1';
const VERDANT_RTL_KEY = 'verdant_haven_rtl_v1';

// Initial Mock Database
const INITIAL_DATABASE = {
  properties: [
    {
      id: "prop-1",
      name: "Whispering Pines Farmhouse",
      tagline: "Rustic stone farmhouse surrounded by pine woods and organic cider orchards",
      category: "Farmhouses",
      propertyType: "Entire Farmhouse",
      location: "Cotswolds, United Kingdom",
      address: "Old Mill Lane, Bourton-on-the-Water, GL54 2BY",
      price: 185,
      rating: 4.96,
      reviewCount: 48,
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-1",
        name: "Arthur & Martha Pendelton",
        role: "Organic Farmers & Hosts",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.98,
        reviews: 142,
        responseTime: "Within an hour",
        joined: "March 2021",
        bio: "We have farmed these rolling hills for three generations. We love sharing fresh sourdough, free-range eggs, and quiet countryside evenings with guests from around the globe."
      },
      description: "Nestled within 45 acres of private organic apple orchards and wildflower meadows, Whispering Pines Farmhouse combines 18th-century Cotswold stone charm with handcrafted modern comforts. Wake up to pasture views, collect morning eggs from the coop, wander through ancient woodland trails, and spend evenings by the wood-burning stone hearth.",
      amenities: [
        "Free Wi-Fi", "Swimming Pool", "Parking", "Garden", "Outdoor Dining",
        "Campfire", "Mountain View", "Breakfast", "Pet Friendly", "Kitchen",
        "Private Balcony", "BBQ Area", "Farm Animals", "Fireplace", "Washer"
      ],
      images: [
        "assets/images/whispering-pines.jpg",
        "https://images.unsplash.com/photo-1567002260834-61d030a974d9?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-101",
          name: "Orchard View Master Suite",
          price: 210,
          capacity: 2,
          bedType: "King Bed",
          bathType: "Ensuite clawfoot tub",
          image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80",
          features: ["Panoramic Orchard View", "Fireplace", "Espresso Bar", "Egyptian Cotton Linens"]
        },
        {
          id: "room-102",
          name: "Meadow Barn Loft",
          price: 175,
          capacity: 4,
          bedType: "1 Queen + 2 Single Loft Beds",
          bathType: "Shared Walk-in Stone Shower",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
          features: ["Cathedral Timber Beams", "Garden Patio", "Bookshelf Library", "Tea Station"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 8:00 PM",
        checkOut: "11:00 AM",
        smoking: "No smoking indoors",
        parties: "Quiet gatherings only, no loud outdoor music after 10 PM",
        pets: "Well-behaved dogs welcome on leash around pasture animals"
      },
      cancellationPolicy: "Full refund up to 7 days before check-in. 50% refund thereafter up to 48 hours before arrival."
    },
    {
      id: "prop-2",
      name: "Willow Creek Eco Lodge",
      tagline: "Off-grid solar powered sanctuary on the banks of a sparkling trout stream",
      category: "Eco Lodges",
      propertyType: "Eco Lodge",
      location: "Black Forest, Germany",
      address: "Talstrasse 42, 79254 Oberried, Germany",
      price: 160,
      rating: 4.92,
      reviewCount: 37,
      guests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      petFriendly: true,
      featured: true,
      popular: false,
      status: "Active",
      host: {
        id: "host-2",
        name: "Lukas & Greta Weber",
        role: "Permaculture Designers",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        badge: "Eco Leader",
        rating: 4.95,
        reviews: 89,
        responseTime: "Within 2 hours",
        joined: "June 2022",
        bio: "We designed Willow Creek to leave zero carbon footprint. We grow heirlooms, harvest mountain spring water, and love introducing guests to mindful forest living."
      },
      description: "Tucked inside an ancient Black Forest valley, Willow Creek is constructed from reclaimed local cedar and river rock. Relax in the wood-fired cedar hot tub listening to the stream, forage for wild herbs with Greta, and enjoy natural insulation that keeps you warm in winter and crisp in summer.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Outdoor Dining", "Campfire",
        "Mountain View", "Breakfast", "Pet Friendly", "Kitchen", "Hot Tub",
        "Wood Stove", "Solar Energy", "Hiking Trails"
      ],
      images: [
        "assets/images/willow-creek.jpg",
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-201",
          name: "Cedar Streamside Cabin",
          price: 160,
          capacity: 4,
          bedType: "1 Queen + 2 Bunk Beds",
          bathType: "Rainforest shower",
          image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=80",
          features: ["Stream Balcony", "Wood Stove", "Eco Toiletries", "Organic Herbal Tea Bar"]
        }
      ],
      rules: {
        checkIn: "2:00 PM - 7:00 PM",
        checkOut: "10:30 AM",
        smoking: "Strictly non-smoking",
        parties: "No events allowed",
        pets: "Dogs allowed with prior notice"
      },
      cancellationPolicy: "Full refund up to 14 days before arrival. Free rescheduling anytime with 48 hours notice."
    },
    {
      id: "prop-3",
      name: "Golden Valley Vineyard Estate",
      tagline: "Historic Tuscan farmhouse overlooking terraced vineyards and century-old olive groves",
      category: "Luxury Farmstays",
      propertyType: "Country Estate",
      location: "Tuscany, Italy",
      address: "Via di Montalcino 18, 53024 Montalcino SI, Italy",
      price: 295,
      rating: 4.98,
      reviewCount: 74,
      guests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 4,
      petFriendly: false,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-3",
        name: "Matteo & Sofia Rossi",
        role: "Fourth Generation Winemakers",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.99,
        reviews: 210,
        responseTime: "Within an hour",
        joined: "January 2020",
        bio: "Our family has cultivated Sangiovese and cold-pressed extra virgin olive oil since 1928. Sofia conducts rustic cooking workshops in our summer kitchen."
      },
      description: "Perched above the Val d'Orcia hills, Golden Valley is a restored Renaissance farmhouse featuring hand-hewn terracotta tiles, exposed oak beams, and an infinity pool reflecting Tuscan sunsets. Daily complimentary cellar wine tastings, homemade focaccia breakfasts, and private chef dinners available upon request.",
      amenities: [
        "Free Wi-Fi", "Swimming Pool", "Parking", "Garden", "Outdoor Dining",
        "Breakfast", "Restaurant", "Air Conditioning", "Kitchen", "Private Balcony",
        "BBQ Area", "Wine Cellar", "Infinity Pool", "Bicycle Rental"
      ],
      images: [
        "assets/images/golden-valley.jpg",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-301",
          name: "Vigna Nobile Grand Suite",
          price: 330,
          capacity: 2,
          bedType: "Canopy King Bed",
          bathType: "Travertine Marble Bathroom",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
          features: ["Vineyard Panorama Terrace", "Private Jacuzzi", "Complimentary Chianti Riserva"]
        },
        {
          id: "room-302",
          name: "Ulivo Garden Suite",
          price: 260,
          capacity: 2,
          bedType: "Queen Bed",
          bathType: "Ensuite rain shower",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
          features: ["Direct Olive Grove Patio", "Arched Windows", "Nespresso Bar"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 9:00 PM",
        checkOut: "11:00 AM",
        smoking: "Smoking permitted in designated outdoor garden areas only",
        parties: "Private celebrations allowed upon consultation",
        pets: "Pets not permitted due to farm dogs and estate wildlife"
      },
      cancellationPolicy: "Moderate: 100% refund up to 10 days before check-in, 50% refund thereafter."
    },
    {
      id: "prop-4",
      name: "Cedar Ridge Mountain Cottage",
      tagline: "Panoramic alpine cabin with hot tub overlooking pine ridges and misty peaks",
      category: "Mountain Cottages",
      propertyType: "Mountain Chalet",
      location: "Vermont, USA",
      address: "148 Ridge Pass, Stowe, VT 05672, United States",
      price: 215,
      rating: 4.95,
      reviewCount: 52,
      guests: 5,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-4",
        name: "David & Claire Miller",
        role: "Mountain Trail Guides",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.96,
        reviews: 95,
        responseTime: "Within 30 mins",
        joined: "September 2021",
        bio: "Passionate hikers, backcountry skiers, and maple syrup producers. We provide complimentary snowshoes and trail maps for all our cabin guests."
      },
      description: "Elevated high above the valley, Cedar Ridge boasts wrap-around redwood decks, a private outdoor cedar hot tub, cast-iron woodstove, and wall-to-wall glass revealing morning mist over the Green Mountains. Pure Vermont maple syrup and farm fresh milk provided at check-in.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Campfire", "Mountain View",
        "Breakfast", "Air Conditioning", "Pet Friendly", "Kitchen", "Private Balcony",
        "BBQ Area", "Hot Tub", "Fireplace", "Board Games"
      ],
      images: [
        "assets/images/cedar-ridge.jpg",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-401",
          name: "Peak View Master Chalet",
          price: 215,
          capacity: 5,
          bedType: "1 King + 1 Queen Loft + 1 Daybed",
          bathType: "2 Full Bathrooms with soaking tub",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80",
          features: ["Panoramic Mountain Glass", "Cedar Hot Tub", "Woodstove", "Maple Pantry"]
        }
      ],
      rules: {
        checkIn: "4:00 PM - 10:00 PM",
        checkOut: "11:00 AM",
        smoking: "Non-smoking property",
        parties: "No wild parties",
        pets: "Dogs welcome ($25 pet fee per stay)"
      },
      cancellationPolicy: "Flexible: Full refund up to 5 days prior to arrival."
    },
    {
      id: "prop-5",
      name: "Sunny Meadow Organic Farmstay",
      tagline: "Authentic dairy and vegetable farm with animal petting, sourdough baking, and hay rides",
      category: "Family Farmstays",
      propertyType: "Working Farmstay",
      location: "Dordogne, France",
      address: "Route du Moulin, 24200 Sarlat-la-Canéda, France",
      price: 140,
      rating: 4.89,
      reviewCount: 61,
      guests: 6,
      bedrooms: 3,
      beds: 5,
      bathrooms: 2,
      petFriendly: true,
      featured: false,
      popular: true,
      status: "Active",
      host: {
        id: "host-5",
        name: "Jean-Pierre & Anne Dubois",
        role: "Artisan Cheesemakers",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        badge: "Farm Host",
        rating: 4.91,
        reviews: 130,
        responseTime: "Within an hour",
        joined: "April 2019",
        bio: "We produce goat cheese and heirloom honey. Children are invited every morning to milk goats and collect fresh duck eggs."
      },
      description: "An authentic working French family farm where children and couples can connect with rural tranquility. Enjoy farm-fresh breakfasts of fresh butter, crusty sourdough, fig jam, and warm milk. Relax beneath shaded chestnut trees or swim in the nearby Dordogne river.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Outdoor Dining", "Campfire",
        "Breakfast", "Pet Friendly", "Children's Play Area", "Kitchen", "BBQ Area",
        "Farm Animals", "Bicycle Rental", "Cheese Workshop"
      ],
      images: [
        "assets/images/sunny-meadow.jpg",
        "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-501",
          name: "Farmhouse Family Suite",
          price: 140,
          capacity: 6,
          bedType: "1 Queen + 4 Twin Bunks",
          bathType: "Double Vanity Bath",
          image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&auto=format&fit=crop&q=80",
          features: ["Garden Access", "Toy Chest", "Farm Animal View", "Baby Cot Available"]
        }
      ],
      rules: {
        checkIn: "2:00 PM - 7:00 PM",
        checkOut: "10:00 AM",
        smoking: "No smoking inside",
        parties: "Family friendly only",
        pets: "Pets permitted"
      },
      cancellationPolicy: "Full refund up to 7 days before check-in."
    },
    {
      id: "prop-6",
      name: "Blue River Riverside Cabin",
      tagline: "Secluded cedar cabin perched right over a crystal trout river with private fishing dock",
      category: "Riverside Stays",
      propertyType: "Waterfront Cabin",
      location: "Lake District, UK",
      address: "Riverbank Path, Keswick, CA12 5DP, United Kingdom",
      price: 175,
      rating: 4.94,
      reviewCount: 43,
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      petFriendly: true,
      featured: true,
      popular: false,
      status: "Active",
      host: {
        id: "host-6",
        name: "Colin MacLeod",
        role: "Angler & Naturalist",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.97,
        reviews: 77,
        responseTime: "Within an hour",
        joined: "May 2021",
        bio: "Fly fishing instructor and nature photographer. The cabin has two private rods and a complimentary canoe for guests."
      },
      description: "Step straight off your private wooden deck into crystal waters. Blue River Cabin features floor-to-ceiling glass, a cast iron woodstove, complimentary kayaks, and outdoor fire pit. An angler's paradise and couples' romantic hideaway.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Outdoor Dining", "Campfire",
        "Mountain View", "Pet Friendly", "Kitchen", "Private Balcony", "BBQ Area",
        "Kayaks", "Fishing Dock", "Fireplace"
      ],
      images: [
        "assets/images/blue-river.jpg",
        "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-601",
          name: "Riverbank Timber Suite",
          price: 175,
          capacity: 4,
          bedType: "2 Queen Beds",
          bathType: "Glass riverview shower",
          image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=600&auto=format&fit=crop&q=80",
          features: ["Private Fishing Dock", "Canoe Included", "Stargazing Deck"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 8:00 PM",
        checkOut: "11:00 AM",
        smoking: "Non smoking",
        parties: "No events",
        pets: "Dogs allowed"
      },
      cancellationPolicy: "Strict: 50% refund up to 7 days before arrival."
    },
    {
      id: "prop-7",
      name: "Lavender Hill Heritage Villa",
      tagline: "Restored 17th-century stone bastide surrounded by aromatic purple lavender fields",
      category: "Heritage Homestays",
      propertyType: "Historic Bastide",
      location: "Provence, France",
      address: "Chemin des Lavandes, 84220 Gordes, France",
      price: 270,
      rating: 4.97,
      reviewCount: 88,
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 3,
      petFriendly: false,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-7",
        name: "Camille & Henri Bernard",
        role: "Essential Oil Distillers",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.99,
        reviews: 240,
        responseTime: "Within 15 mins",
        joined: "August 2018",
        bio: "We harvest organic lavender and distilled essences. Our home has stood on this sunny slope since 1685."
      },
      description: "Lavender Hill commands sweeping views across the Luberon valley. Featuring ancient lime-washed stone, heated saltwater pool, private olive press, and shaded wisteria courtyards. Every stay includes a personalized tour of our copper alembic distillery.",
      amenities: [
        "Free Wi-Fi", "Swimming Pool", "Parking", "Garden", "Outdoor Dining",
        "Campfire", "Breakfast", "Air Conditioning", "Kitchen", "Private Balcony",
        "BBQ Area", "Lavender Fields", "Saltwater Pool"
      ],
      images: [
        "assets/images/lavender-hill.jpg",
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-701",
          name: "Chambre Bastide Royale",
          price: 270,
          capacity: 6,
          bedType: "1 King + 2 Queens",
          bathType: "3 Ensuite Stone Bathrooms",
          image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&auto=format&fit=crop&q=80",
          features: ["Pool Terrace Access", "Antique Furniture", "Lavender Scented Linens"]
        }
      ],
      rules: {
        checkIn: "4:00 PM - 8:00 PM",
        checkOut: "10:30 AM",
        smoking: "No smoking",
        parties: "No commercial parties",
        pets: "Not suitable for pets"
      },
      cancellationPolicy: "100% refund up to 14 days before arrival."
    },
    {
      id: "prop-8",
      name: "Foxglove Woodland Retreat",
      tagline: "Eco-architectural treehouse and Scandinavian glass cabin in deep mossy woods",
      category: "Forest Retreats",
      propertyType: "Architectural Cabin",
      location: "Scottish Highlands, UK",
      address: "Glen Shiel Forest, IV40 8HW, Scotland",
      price: 190,
      rating: 4.93,
      reviewCount: 31,
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      petFriendly: true,
      featured: false,
      popular: true,
      status: "Active",
      host: {
        id: "host-8",
        name: "Ewan Fraser",
        role: "Forester & Timber Architect",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.94,
        reviews: 64,
        responseTime: "Within an hour",
        joined: "October 2021",
        bio: "I built Foxglove using fallen Scots pine and larch. Complete silence, ancient trees, and red deer sightings right outside the window."
      },
      description: "Designed for deep rest and creative flow, Foxglove is hidden away amidst ferns and ancient Scots pine. Featuring a glass stargazing ceiling above the master bed, Nordic sauna, outdoor cold plunge barrel, and wood-fired oven.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Outdoor Dining", "Campfire",
        "Mountain View", "Breakfast", "Pet Friendly", "Kitchen", "Hot Tub",
        "Sauna", "Fireplace", "Stargazing Roof"
      ],
      images: [
        "assets/images/foxglove-retreat.jpg",
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-801",
          name: "Highland Larch Treehouse",
          price: 190,
          capacity: 3,
          bedType: "1 King + 1 Loft Nook",
          bathType: "Forest View Cedar Soaking Tub",
          image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80",
          features: ["Glass Ceiling", "Outdoor Sauna", "Birdwatching Deck"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 7:00 PM",
        checkOut: "11:00 AM",
        smoking: "Non-smoking",
        parties: "No events",
        pets: "Dogs welcome"
      },
      cancellationPolicy: "Full refund 7 days prior to check-in."
    },
    {
      id: "prop-9",
      name: "Emerald Valley Tea Plantation Homestay",
      tagline: "Colonial-style hillside estate surrounded by mist-laden organic tea gardens",
      category: "Countryside Homestays",
      propertyType: "Plantation Bungalow",
      location: "Wayanad, India",
      address: "Meppadi Hill Road, Wayanad, Kerala 673577, India",
      price: 125,
      rating: 4.96,
      reviewCount: 92,
      guests: 8,
      bedrooms: 4,
      beds: 6,
      bathrooms: 4,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-9",
        name: "Devan & Lakshmi Nair",
        role: "Estate Planters & Cooks",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.98,
        reviews: 215,
        responseTime: "Within 30 mins",
        joined: "November 2019",
        bio: "We serve authentic Kerala banana-leaf feasts made with organic garden spices, cardamom, and fresh coconuts."
      },
      description: "Wake to the call of Malabar whistling thrushes and rolling emerald fog. The 1930s estate bungalow features expansive teak verandas, private spice plantation walks, traditional Ayurvedic herbal tea tasting, and authentic wood-stove cooking sessions.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Outdoor Dining", "Campfire",
        "Mountain View", "Breakfast", "Restaurant", "Pet Friendly", "Children's Play Area",
        "Kitchen", "Private Balcony", "Tea Plantation Walk", "Ayurvedic Meals"
      ],
      images: [
        "assets/images/emerald-valley.jpg",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-901",
          name: "Heritage Planter's Veranda Suite",
          price: 125,
          capacity: 4,
          bedType: "2 Four-Poster Queen Beds",
          bathType: "Open-sky stone garden bathroom",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80",
          features: ["Panoramic Tea Valley View", "Private Teak Veranda", "Fresh Spices Gift Basket"]
        }
      ],
      rules: {
        checkIn: "1:00 PM - 9:00 PM",
        checkOut: "11:00 AM",
        smoking: "Smoking permitted on outer garden trails",
        parties: "Family celebrations welcome",
        pets: "Pets warmly welcomed"
      },
      cancellationPolicy: "Full refund up to 3 days before check-in."
    },
    {
      id: "prop-10",
      name: "The Rustic Barn & Stables",
      tagline: "Equestrian countryside ranch with riding lessons, hayloft suites, and cider barn",
      category: "Farmhouses",
      propertyType: "Equestrian Ranch",
      location: "Sonoma Valley, USA",
      address: "2200 Valley Oak Way, Santa Rosa, CA 95404, United States",
      price: 245,
      rating: 4.91,
      reviewCount: 40,
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      petFriendly: true,
      featured: false,
      popular: true,
      status: "Active",
      host: {
        id: "host-10",
        name: "Wyatt & Jessica Vance",
        role: "Ranchers & Equestrians",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        badge: "Ranch Host",
        rating: 4.92,
        reviews: 78,
        responseTime: "Within an hour",
        joined: "May 2020",
        bio: "Home to 12 rescue horses, heritage goats, and an artisan hard cider press. We love giving sunset riding lessons."
      },
      description: "Experience genuine ranch life with modern elegance. Enjoy private paddocks, guided horse trail rides through oak-studded hills, cider tastings in the old stone cellar, and evenings around the oversized iron fire pit under starry California skies.",
      amenities: [
        "Free Wi-Fi", "Swimming Pool", "Parking", "Garden", "Outdoor Dining",
        "Campfire", "Mountain View", "Breakfast", "Pet Friendly", "Kitchen",
        "BBQ Area", "Farm Animals", "Horseback Riding", "Fireplace"
      ],
      images: [
        "assets/images/rustic-barn.jpg",
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1001",
          name: "The Lofted Saddle Suite",
          price: 245,
          capacity: 6,
          bedType: "1 King + 2 Queen Lofts",
          bathType: "Double Copper Basin Bath",
          image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop&q=80",
          features: ["Paddock Overlook", "Complimentary Riding Lesson Voucher", "Wood Stove"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 8:00 PM",
        checkOut: "11:00 AM",
        smoking: "Non-smoking inside and near stables",
        parties: "No unauthorized events",
        pets: "Dogs welcome with prior ranch agreement"
      },
      cancellationPolicy: "Full refund 7 days before check-in."
    },
    {
      id: "prop-11",
      name: "Stonehaven Country Manor",
      tagline: "Regal 19th-century limestone manor set across private woodland gardens and trout ponds",
      category: "Private Villas",
      propertyType: "Country Manor",
      location: "Adelaide Hills, Australia",
      address: "Ridgeview Road, Stirling, SA 5152, Australia",
      price: 360,
      rating: 4.99,
      reviewCount: 66,
      guests: 10,
      bedrooms: 5,
      beds: 7,
      bathrooms: 4,
      petFriendly: false,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-11",
        name: "Alistair Sterling",
        role: "Estate Sommelier",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.99,
        reviews: 140,
        responseTime: "Within 30 mins",
        joined: "February 2019",
        bio: "Passionate about cool-climate wines, heritage conservation, and botanical gardening."
      },
      description: "Magnificent sandstone estate featuring vaulted ceilings, grand open hearths, championship tennis court, English country gardens, and private cellar stocked with Adelaide Hills vintages. Perfect for multi-generational countryside reunions and executive retreats.",
      amenities: [
        "Free Wi-Fi", "Swimming Pool", "Parking", "Garden", "Outdoor Dining",
        "Campfire", "Breakfast", "Air Conditioning", "Kitchen", "Private Balcony",
        "BBQ Area", "Tennis Court", "Wine Cellar", "Fireplace"
      ],
      images: [
        "assets/images/stonehaven-manor.jpg",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1101",
          name: "Grand Chancellor Manor Suite",
          price: 360,
          capacity: 10,
          bedType: "3 Kings + 4 Singles",
          bathType: "4 Marble Ensuite Bathrooms",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
          features: ["Full Estate Access", "Private Tennis Court", "Butler Kitchen", "Fireplace in 3 Rooms"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 9:00 PM",
        checkOut: "11:30 AM",
        smoking: "Non smoking indoors",
        parties: "Events subject to prior event agreement",
        pets: "No pets allowed"
      },
      cancellationPolicy: "Strict: 50% refund up to 14 days before check-in."
    },
    {
      id: "prop-12",
      name: "Highland Orchard Haven",
      tagline: "Charming timber farmhouse nestled in cherry and pear orchards with mountain backdrop",
      category: "Weekend Retreats",
      propertyType: "Orchard Cottage",
      location: "Bavaria, Germany",
      address: "Obstgartenweg 7, 83684 Tegernsee, Germany",
      price: 155,
      rating: 4.88,
      reviewCount: 39,
      guests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      petFriendly: true,
      featured: false,
      popular: true,
      status: "Active",
      host: {
        id: "host-12",
        name: "Maximilian & Heidi Bauer",
        role: "Orchardists & Bakers",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.90,
        reviews: 82,
        responseTime: "Within an hour",
        joined: "May 2021",
        bio: "We bake fresh apple strudel every Saturday afternoon for our cottage guests."
      },
      description: "Surrounded by 300 heritage apple and cherry trees, this alpine cottage is perfect for quiet romantic escapes and rejuvenating weekend walks. Enjoy panoramic views of the Bavarian Alps from your cedar sun deck.",
      amenities: [
        "Free Wi-Fi", "Parking", "Garden", "Outdoor Dining", "Campfire",
        "Mountain View", "Breakfast", "Pet Friendly", "Kitchen", "BBQ Area",
        "Orchard Picking", "Bicycle Rental"
      ],
      images: [
        "assets/images/highland-orchard.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1201",
          name: "Blossom Alpine Chamber",
          price: 155,
          capacity: 4,
          bedType: "1 Queen + 2 Single Daybeds",
          bathType: "Wood-paneled Shower Room",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
          features: ["Direct Orchard Gate", "Fresh Fruit Basket", "Mountain Sun Deck"]
        }
      ],
      rules: {
        checkIn: "2:00 PM - 7:00 PM",
        checkOut: "10:30 AM",
        smoking: "Non-smoking inside",
        parties: "Quiet stays only",
        pets: "Dogs welcome"
      },
      cancellationPolicy: "Flexible: Full refund 5 days before arrival."
    },
    {
      id: "prop-13",
      name: "Suncrest Olive Grove Villa",
      tagline: "Sun-drenched Mediterranean olive ranch with stone courtyards and private cypress garden",
      category: "Luxury Farmhouses",
      propertyType: "Olive Estate",
      location: "Peloponnese, Greece",
      address: "Kalamata Olive Trail 14, Messinia, Greece",
      price: 195,
      rating: 4.93,
      reviewCount: 47,
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-13",
        name: "Nikolaos & Eleni Vassiliou",
        role: "Third-Generation Olive Millers",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.95,
        reviews: 114,
        responseTime: "Within an hour",
        joined: "March 2020",
        bio: "We welcome guests with warm freshly pressed extra virgin olive oil and homemade oregano flatbread."
      },
      description: "Set among centuries-old silver olive groves overlooking the sapphire Ionian Sea, Suncrest Olive Grove Villa blends whitewashed rustic masonry with artisan terracotta tiles. Stroll through fragrant herbal gardens, join our evening olive oil tastings, or relax under the shaded pergola.",
      amenities: [
        "Free Wi-Fi", "Swimming Pool", "Private Parking", "Olive Grove Garden", "Outdoor Dining",
        "BBQ Area", "Kitchen", "Breakfast Included", "Air Conditioning", "Sea View", "Pet Friendly"
      ],
      images: [
        "assets/images/suncrest-olive-grove.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1301",
          name: "Ionian Horizon Master Suite",
          price: 195,
          capacity: 4,
          bedType: "1 King + 1 Queen Daybed",
          bathType: "Marble En-suite with Soaking Tub",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
          features: ["Private Balcony", "Sea & Olive View", "Espresso Bar"]
        },
        {
          id: "room-1302",
          name: "Silver Leaf Twin Chamber",
          price: 140,
          capacity: 2,
          bedType: "2 Single Beds",
          bathType: "Private Stone Shower",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80",
          features: ["Courtyard Access", "Cypress Shade"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 8:00 PM",
        checkOut: "11:00 AM",
        smoking: "Outside courtyards only",
        parties: "Events with host permission",
        pets: "Friendly dogs welcome"
      },
      cancellationPolicy: "Flexible: Full refund up to 7 days before check-in."
    },
    {
      id: "prop-14",
      name: "Nordic Birch Lakeside Cabin",
      tagline: "Minimalist Scandinavian cedar cabin with private timber sauna and glass-front fjord panorama",
      category: "Eco-Lodge",
      propertyType: "Nordic Cabin",
      location: "Voss, Norway",
      address: "Fjordvegen 88, 5700 Voss, Norway",
      price: 175,
      rating: 4.96,
      reviewCount: 52,
      guests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-14",
        name: "Astrid Lindholm",
        role: "Fjord Guide & Woodworker",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.98,
        reviews: 142,
        responseTime: "Within 30 mins",
        joined: "June 2019",
        bio: "Passionate about authentic Nordic living, wild berry picking, and rejuvenating wood-fired lakeside saunas."
      },
      description: "Perched gracefully beside mirror-calm fjord waters surrounded by white birch woods, this architect-designed timber cabin offers total tranquility. Unwind in your private cedar sauna, plunge into the crystal lake, and warm up beside the sleek Nordic cast-iron stove.",
      amenities: [
        "Private Wood Sauna", "Lakeside Jetty", "Free Wi-Fi", "Fireplace", "Kitchen",
        "Rowboat & Kayaks", "Heated Floors", "Mountain View", "Pet Friendly", "Solar Powered"
      ],
      images: [
        "assets/images/nordic-birch-cabin.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1401",
          name: "Fjordview Cedar Loft",
          price: 175,
          capacity: 4,
          bedType: "1 Queen + 2 Nordic Bunk Berths",
          bathType: "Rainforest Shower & Sauna Entry",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
          features: ["Glass Panorama Wall", "Direct Jetty Access", "Wood Stove"]
        }
      ],
      rules: {
        checkIn: "2:00 PM - 7:00 PM",
        checkOut: "11:00 AM",
        smoking: "No smoking",
        parties: "No parties",
        pets: "Well-behaved dogs welcome"
      },
      cancellationPolicy: "Moderate: Full refund 5 days prior to arrival."
    },
    {
      id: "prop-15",
      name: "Alpine Meadow Mountain Chalet",
      tagline: "Traditional Swiss-timber chalet surrounded by wildflower pastures and snow-capped peaks",
      category: "Mountain Cabins",
      propertyType: "Alpine Chalet",
      location: "Grindelwald, Switzerland",
      address: "Alpenblumenweg 22, 3818 Grindelwald, Switzerland",
      price: 240,
      rating: 4.97,
      reviewCount: 64,
      guests: 6,
      bedrooms: 3,
      beds: 5,
      bathrooms: 2,
      petFriendly: false,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-15",
        name: "Beat & Ursula Keller",
        role: "Alpine Dairy Farmers",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.96,
        reviews: 178,
        responseTime: "Within an hour",
        joined: "January 2018",
        bio: "We craft traditional Gruyère and Alpine butter right up here in our valley dairy."
      },
      description: "Wake up to gentle cowbell echoes and breath-taking vistas of the Eiger north face. Handcrafted from local larch and pine, the chalet features hand-carved balconies, a crackling stone hearth, and panoramic breakfast balconies.",
      amenities: [
        "Mountain Views", "Fireplace", "Free Wi-Fi", "Alpine Breakfast", "Ski Storage",
        "Kitchen", "Balcony", "Hiking Trails", "Outdoor Hot Tub"
      ],
      images: [
        "assets/images/alpine-meadow-chalet.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1501",
          name: "Matterhorn Peak Grand Suite",
          price: 240,
          capacity: 4,
          bedType: "1 King + 2 Twin Beds",
          bathType: "En-suite Jacuzzi Tub",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
          features: ["Wrap-around Balcony", "Telescope", "Stone Fireplace"]
        },
        {
          id: "room-1502",
          name: "Edelweiss Pine Room",
          price: 160,
          capacity: 2,
          bedType: "1 Queen Bed",
          bathType: "Private Shower",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80",
          features: ["Valley Meadow View", "Down Feather Comforters"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 9:00 PM",
        checkOut: "10:00 AM",
        smoking: "No smoking",
        parties: "No parties",
        pets: "No pets allowed"
      },
      cancellationPolicy: "Strict: 50% refund up to 14 days before check-in."
    },
    {
      id: "prop-16",
      name: "Maple Creek Heritage Homestead",
      tagline: "Picturesque Vermont sugar-maple farm with horse paddocks, stream crossings, and cider barn",
      category: "Weekend Retreats",
      propertyType: "Historic Farmstead",
      location: "Woodstock, Vermont, USA",
      address: "Maple Hollow Lane 45, Woodstock, VT 05091, USA",
      price: 160,
      rating: 4.89,
      reviewCount: 38,
      guests: 5,
      bedrooms: 2,
      beds: 4,
      bathrooms: 1.5,
      petFriendly: true,
      featured: false,
      popular: true,
      status: "Active",
      host: {
        id: "host-16",
        name: "Caleb & Hannah Foster",
        role: "Maple Syrup Producers",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.92,
        reviews: 95,
        responseTime: "Within an hour",
        joined: "September 2021",
        bio: "Join us in the sugarhouse every March or enjoy our homemade maple waffles year-round."
      },
      description: "Resting beside bubbling Maple Creek, this 1890s farmhouse combines antique colonial charm with plush down bedding and modern conveniences. Explore over 50 acres of walking trails, meet our friendly farm horses, and enjoy campfire s'mores under starry New England skies.",
      amenities: [
        "Free Wi-Fi", "Maple Breakfast", "Pet Friendly", "Kitchen", "Creek Access",
        "Campfire Pit", "Horse Paddocks", "Free Parking", "Indoor Fireplace"
      ],
      images: [
        "assets/images/maple-creek-homestead.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1601",
          name: "Sugar Maple King Suite",
          price: 160,
          capacity: 3,
          bedType: "1 King + 1 Daybed",
          bathType: "Clawfoot Soaking Tub",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
          features: ["Creek View", "Antique Oak Writing Desk", "Fireplace"]
        },
        {
          id: "room-1602",
          name: "Cider Press Twin Chamber",
          price: 120,
          capacity: 2,
          bedType: "2 Twin Beds",
          bathType: "Shared Half Bath",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80",
          features: ["Garden Window", "Quilted Comforters"]
        }
      ],
      rules: {
        checkIn: "2:00 PM - 7:00 PM",
        checkOut: "11:00 AM",
        smoking: "No smoking inside",
        parties: "No parties",
        pets: "Dogs welcome"
      },
      cancellationPolicy: "Flexible: Full refund 5 days prior to arrival."
    },
    {
      id: "prop-17",
      name: "Citrus Blossom Andalusian Hacienda",
      tagline: "Secluded Spanish courtyard estate with lemon groves, tiled fountains, and mountain sunsets",
      category: "Luxury Farmhouses",
      propertyType: "Spanish Hacienda",
      location: "Ronda, Andalusia, Spain",
      address: "Camino de los Naranjos 9, 29400 Ronda, Spain",
      price: 185,
      rating: 4.94,
      reviewCount: 43,
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-17",
        name: "Carmen & Mateo Morales",
        role: "Citrus Growers & Sommelier",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.97,
        reviews: 108,
        responseTime: "Within 2 hours",
        joined: "April 2020",
        bio: "We welcome guests with fresh Valencia orange juice squeezed straight from our courtyard trees."
      },
      description: "Surrounded by sweet-smelling orange and lemon groves overlooking the Ronda valley, this restored 18th-century hacienda features Moorish tile arches, sunlit stone patios, and an azure dipping pool. Dine on Andalusian tapas while the sun sets over the Serranía de Ronda mountains.",
      amenities: [
        "Courtyard Swimming Pool", "Free Wi-Fi", "Citrus Grove", "Breakfast Included", "Tapas Terrace",
        "Air Conditioning", "Free Parking", "Kitchen", "Pet Friendly"
      ],
      images: [
        "assets/images/citrus-hacienda.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1701",
          name: "Alhambra Courtyard Suite",
          price: 185,
          capacity: 4,
          bedType: "1 Queen + 2 Single Beds",
          bathType: "Hand-painted Talavera Bath",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
          features: ["Fountain Terrace", "Orchestrated Sunshades", "Citrus View"]
        }
      ],
      rules: {
        checkIn: "3:00 PM - 8:30 PM",
        checkOut: "11:30 AM",
        smoking: "Terrace smoking permitted",
        parties: "No loud parties",
        pets: "Pets welcome"
      },
      cancellationPolicy: "Moderate: Full refund 7 days before check-in."
    },
    {
      id: "prop-18",
      name: "Thatched Cotswold Rose Cottage",
      tagline: "Fairytale honey-stone cottage with traditional thatched roof and English cottage flower garden",
      category: "Romantic Getaways",
      propertyType: "Historic Thatched Cottage",
      location: "Bibury, Cotswolds, United Kingdom",
      address: "Rose Arbor Lane 3, Bibury, GL7 5NX, UK",
      price: 170,
      rating: 4.95,
      reviewCount: 61,
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      petFriendly: true,
      featured: true,
      popular: true,
      status: "Active",
      host: {
        id: "host-18",
        name: "Eleanor & Arthur Higgins",
        role: "Florists & Garden Historians",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        badge: "Superhost",
        rating: 4.96,
        reviews: 135,
        responseTime: "Within an hour",
        joined: "February 2019",
        bio: "We tend to 60 varieties of heritage climbing roses and serve afternoon tea on the garden lawn."
      },
      description: "Straight from a classic English picture book, this 300-year-old thatched cottage features low timber beams, stone mullioned windows, and a roaring inglenook fireplace. Wander through lush rose arbors to the village brook or enjoy home-baked scones and clotted cream by the hearth.",
      amenities: [
        "Inglenook Fireplace", "English Flower Garden", "Free Wi-Fi", "Afternoon Tea Included", "Bathtub",
        "Kitchenette", "Free Parking", "Pet Friendly", "Walking Paths"
      ],
      images: [
        "assets/images/thatched-cotswold-cottage.jpg",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80"
      ],
      rooms: [
        {
          id: "room-1801",
          name: "Rose Garden Romantic Loft",
          price: 170,
          capacity: 3,
          bedType: "1 Four-Poster King + 1 Daybed",
          bathType: "Roll-top Cast Iron Bathtub",
          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
          features: ["Garden Panorama", "Linen Bedding", "Inglenook Hearth"]
        }
      ],
      rules: {
        checkIn: "2:00 PM - 7:00 PM",
        checkOut: "11:00 AM",
        smoking: "Strictly non-smoking",
        parties: "No parties",
        pets: "Well-behaved dogs welcome"
      },
      cancellationPolicy: "Flexible: Full refund 5 days prior to arrival."
    }
  ],

  activities: [
    {
      id: "act-1",
      title: "Artisan Goat Cheese & Sourdough Workshop",
      category: "Traditional Cooking",
      description: "Spend a hands-on morning learning ancient French cheese curding, whey separation, and wild-yeast sourdough shaping from master cheesemaker Jean-Pierre.",
      duration: "3.5 Hours",
      price: 65,
      location: "Dordogne, France",
      ageGroup: "All Ages (8+)",
      availability: "Wednesdays & Saturdays",
      image: "https://images.unsplash.com/photo-1653294018211-6361012852d8?w=800&auto=format&fit=crop&q=80",
      includes: ["Fresh Cheese Samples", "Loaf of Fresh Sourdough to keep", "Farm Wine Pairing", "Recipe Booklet"],
      thingsToBring: ["Comfortable flat shoes", "Apron (or provided)", "Appetite for rustic delicacies"]
    },
    {
      id: "act-2",
      title: "Morning Orchard Harvest & Cider Pressing",
      category: "Organic Farming",
      description: "Pick heirloom heritage apples and press fresh cloudy cider using an antique hand-cranked wooden oak press. Taste warm spiced cider around the barrel.",
      duration: "2.5 Hours",
      price: 45,
      location: "Cotswolds, United Kingdom",
      ageGroup: "Family Friendly",
      availability: "Daily (Morning)",
      image: "https://images.unsplash.com/photo-1520325873795-c1d9bd401cb0?w=800&auto=format&fit=crop&q=80",
      includes: ["Wicker Picking Basket", "2 Bottles of Fresh Pressed Cider", "Apple Tasting Flight"],
      thingsToBring: ["Sun hat", "Garden gloves", "Walking boots"]
    },
    {
      id: "act-3",
      title: "Sunset Trail Horseback Riding & Wine Tasting",
      category: "Horse Riding",
      description: "Mount gentle ranch horses for a scenic golden-hour ride through rolling vineyard ridges, concluding with an open-air fire pit wine tasting.",
      duration: "3 Hours",
      price: 110,
      location: "Sonoma Valley, USA",
      ageGroup: "Teens & Adults (14+)",
      availability: "Tuesday, Thursday & Sunday",
      image: "assets/images/horseback-riding.jpg",
      includes: ["Horse & Riding Helmet", "Professional Trail Guide", "3 Sonoma Wine Tastings", "Charcuterie Board"],
      thingsToBring: ["Long trousers", "Closed-toe riding boots", "Camera / phone strap"]
    },
    {
      id: "act-4",
      title: "Campfire Stargazing with Astronomer & Marshmallows",
      category: "Campfire Nights",
      description: "Gather under zero-light-pollution dark skies beside a crackling oak fire. Explore rings of Saturn through a 12-inch Dobsonian telescope.",
      duration: "2 Hours",
      price: 35,
      location: "Black Forest, Germany",
      ageGroup: "All Ages",
      availability: "Friday & Saturday Nights",
      image: "assets/images/campfire-stargazing.jpg",
      includes: ["Astronomer Guidance", "High-power Telescope Session", "Artisan Marshmallow Toasting Kit", "Spiced Hot Chocolate"],
      thingsToBring: ["Warm fleece jacket", "Camp chair or blanket", "Curiosity about constellations"]
    },
    {
      id: "act-5",
      title: "Wild Mushroom & Truffle Foraging Walk",
      category: "Nature Walks",
      description: "Follow certified mycologists and trained truffle dogs through damp mossy oak groves. Learn safe identification of chanterelles and porcini.",
      duration: "3 Hours",
      price: 75,
      location: "Tuscany, Italy",
      ageGroup: "Adults (12+)",
      availability: "Tuesday & Saturday",
      image: "https://images.unsplash.com/photo-1691478104764-1fb05018514b?w=800&auto=format&fit=crop&q=80",
      includes: ["Truffle Hound Demonstration", "Foraging Bag", "Tasting of Pan-fried Porcini on Bruschetta", "Botanical Guidebook"],
      thingsToBring: ["Waterproof trail boots", "Small pocket knife", "Rain jacket"]
    },
    {
      id: "act-6",
      title: "Gentle Morning Yoga by the Lavender Fields",
      category: "Yoga and Meditation",
      description: "Breathe in sweet natural lavender breezes during an invigorating sunrise Vinyasa yoga session, followed by an aromatic herbal tea infusion.",
      duration: "1.5 Hours",
      price: 30,
      location: "Provence, France",
      ageGroup: "All Levels",
      availability: "Daily (Sunrise 7:00 AM)",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
      includes: ["Organic Cork Yoga Mat", "Guided Breathwork & Meditation", "Fresh Lavender Tea Infusion", "Cold Mint Towel"],
      thingsToBring: ["Comfortable activewear", "Water bottle"]
    },
    {
      id: "act-7",
      title: "Beekeeping & Wild Honey Extraction",
      category: "Organic Farming",
      description: "Suit up in professional ventilated beekeeper suits. Open cedar hives, observe the queen bee, and spin frames to jar your own raw honey.",
      duration: "2 Hours",
      price: 55,
      location: "Wayanad, India",
      ageGroup: "Ages 10+",
      availability: "Monday, Thursday & Saturday",
      image: "assets/images/beekeeping-honey.jpg",
      includes: ["Protective Suit & Gloves", "Jar of Raw Wildflower Honey", "Honeycomb Tasting"],
      thingsToBring: ["Socks and sturdy shoes", "Hair tied back"]
    },
    {
      id: "act-8",
      title: "Farm Animal Feeding & Duck Pond Care",
      category: "Farm Animal Feeding",
      description: "Ideal for toddlers, kids, and animal lovers. Bottle-feed orphan lambs, hand-feed miniature Pygmy goats, and release ducks onto the lily pond.",
      duration: "1.5 Hours",
      price: 25,
      location: "Cotswolds, United Kingdom",
      ageGroup: "Toddlers & Families",
      availability: "Twice Daily (9:30 AM & 4:30 PM)",
      image: "assets/images/animal-feeding-lamb.jpg",
      includes: ["Feed Buckets & Baby Milk Bottles", "Farmer Guided Tour", "Animal Polaroid Photo Keepsake"],
      thingsToBring: ["Clothes that can get a little muddy", "Rubber boots / Wellies"]
    },
    {
      id: "act-9",
      title: "Artisan Ceramic Pottery & Clay Workshop",
      category: "Traditional Cooking",
      description: "Hand-throw rustic clay mugs, bowls, and herbal planters using local Cotswold terracotta clay on antique pedal wheels in Claire's sunlit orchard studio.",
      duration: "2.5 Hours",
      price: 50,
      location: "Cotswolds, United Kingdom",
      ageGroup: "Ages 10+",
      availability: "Monday, Wednesday & Saturday",
      image: "assets/images/ceramic-pottery.jpg",
      includes: ["Terracotta Clay & Glazes", "Potter's Wheel Session", "Fired & Glazed Mug Shipped to Your Home", "Herbal Tea & Biscuits"],
      thingsToBring: ["Apron or clothes that can get dusty", "Trimmed fingernails"]
    },
    {
      id: "act-10",
      title: "Heirloom Grape Stomping & Vineyard Harvest",
      category: "Traditional Cooking",
      description: "Roll up your trousers and experience ancient European wine-making by stomping ripe harvest grapes in wooden barrels, followed by a sommelier cellar tasting.",
      duration: "3 Hours",
      price: 60,
      location: "Peloponnese, Greece",
      ageGroup: "All Ages (6+)",
      availability: "Tuesday, Thursday & Saturday",
      image: "assets/images/grape-stomping.jpg",
      includes: ["Oak Stomping Barrel Session", "Commemorative Grape T-shirt", "3 Wine / Grape Juice Tastings", "Cheese & Olive Platter"],
      thingsToBring: ["Comfortable clothes you don't mind staining", "Towel", "Sun hat"]
    },
    {
      id: "act-11",
      title: "Wildflower Foraging & Meadow Floral Workshop",
      category: "Nature Walks",
      description: "Meander across rolling sunlit meadows to forage indigenous wild flora, clover, and lavender. Hand-tie a magnificent rustic bouquet to keep.",
      duration: "2 Hours",
      price: 40,
      location: "Cotswolds, United Kingdom",
      ageGroup: "All Ages",
      availability: "Daily (Morning 10:00 AM)",
      image: "assets/images/wildflower-bouquet.jpg",
      includes: ["Floral Scissors & Twine", "Handcrafted Woven Basket", "Bouquet to Take Home", "Herbal Iced Tea"],
      thingsToBring: ["Sun hat", "Flat walking shoes", "Camera"]
    },
    {
      id: "act-12",
      title: "Wood-Fired Farmhouse Sourdough Pizza Workshop",
      category: "Traditional Cooking",
      description: "Harvest fresh basil and heirloom tomatoes from the kitchen garden, knead wild sourdough, and bake crispy rustic pizzas in an authentic outdoor stone oven.",
      duration: "2.5 Hours",
      price: 55,
      location: "Tuscany, Italy",
      ageGroup: "Family Friendly",
      availability: "Wednesday, Friday & Sunday",
      image: "assets/images/woodfired-pizza.jpg",
      includes: ["Garden Veggie Harvest Tour", "Personal Pizza Creation", "Farm Gelato Dessert", "House Wine / Italian Soda"],
      thingsToBring: ["Good appetite", "Comfortable casual clothes"]
    },
    {
      id: "act-13",
      title: "Alpaca Pasture Walk & Fleece Spinning",
      category: "Farm Animal Feeding",
      description: "Take gentle halter-trained alpacas on a scenic meadow walk. Feed them crisp carrots and learn traditional spindle yarn-spinning from artisan weavers.",
      duration: "2 Hours",
      price: 45,
      location: "Woodstock, Vermont, USA",
      ageGroup: "All Ages",
      availability: "Tuesday, Friday & Saturday",
      image: "assets/images/alpaca-pasture.jpg",
      includes: ["Alpaca Halter Lead", "Bag of Alpaca Treats & Carrots", "Spindle Spinning Demonstration", "Mini Alpaca Wool Keepsake"],
      thingsToBring: ["Sturdy walking shoes", "Clothes suitable for grassy pastures"]
    },
    {
      id: "act-14",
      title: "Morning River Kayaking & Forest Birdwatching",
      category: "Nature Walks",
      description: "Paddle smooth crystal-clear river currents under willow canopies. Spot kingfishers, river otters, and deer with binoculars guided by our naturalist.",
      duration: "2.5 Hours",
      price: 50,
      location: "Voss, Norway",
      ageGroup: "Teens & Adults (10+)",
      availability: "Daily (Early Morning 8:30 AM)",
      image: "assets/images/river-kayaking.jpg",
      includes: ["Single / Tandem Kayak & Paddles", "Safety Lifevest", "High-clarity Binoculars", "Dry Bag for Electronics"],
      thingsToBring: ["Water shoes / sandals", "Quick-dry clothing", "Sunscreen"]
    },
    {
      id: "act-15",
      title: "Rustic Barn Folk Music & Mulled Cider Evening",
      category: "Campfire Nights",
      description: "Sip spiced hot mulled cider beside oak barrels while local acoustic fiddlers and guitarists play lively folk songs under glowing string-lit rafters.",
      duration: "2.5 Hours",
      price: 30,
      location: "Bavaria, Germany",
      ageGroup: "All Ages",
      availability: "Friday & Saturday Evenings",
      image: "assets/images/barn-folk-evening.jpg",
      includes: ["Steaming Mulled Apple Cider (or spiced punch)", "Pretzel & Cheese Snack Board", "Live Acoustic Folk Performance"],
      thingsToBring: ["Cozy sweater or scarf", "Lively spirit"]
    }
  ],

  packages: [
    {
      id: "pkg-1",
      name: "Weekend Escape",
      tagline: "The perfect quick countryside break to refresh your spirit",
      duration: "1 Night Stay",
      nights: 1,
      price: 165,
      popular: false,
      features: [
        "1 Night Cozy Cottage or Farmhouse Stay",
        "Farm-to-Table Artisan Breakfast for 2",
        "Complimentary Welcome Mulled Cider or Wine",
        "Unlimited Garden & Orchard Access",
        "Evening Campfire & S'mores Kit"
      ]
    },
    {
      id: "pkg-2",
      name: "Countryside Retreat",
      tagline: "Unplug for two serene nights amidst forests and rolling meadows",
      duration: "2 Nights Stay",
      nights: 2,
      price: 295,
      popular: true,
      features: [
        "2 Nights Premium Countryside Accommodation",
        "Daily Fresh Farm Breakfast for 2",
        "Choice of 1 Farmstay Experience or Activity",
        "Nightly Wood-burning Hearth Firewood Bundle",
        "Bicycle Rentals for scenic country trails",
        "Late 2:00 PM Check-out"
      ]
    },
    {
      id: "pkg-3",
      name: "Farm & Harvest Experience",
      tagline: "Immerse in authentic rural living, milking, cooking and picking",
      duration: "2 Nights Stay",
      nights: 2,
      price: 350,
      popular: false,
      features: [
        "2 Nights Farmhouse Suite Accommodation",
        "All Daily Organic Farm-fresh Meals Included",
        "Guided Organic Farm Tour & Honey Extraction",
        "Hands-on Traditional Cooking or Cheese Workshop",
        "Complimentary Basket of Farm Produce to Take Home"
      ]
    },
    {
      id: "pkg-4",
      name: "Premium Nature & Wellness Escape",
      tagline: "Luxury hospitality, private hot tubs, spa massages and private chef",
      duration: "3 Nights Stay",
      nights: 3,
      price: 620,
      popular: false,
      features: [
        "3 Nights in Luxury Estate or Glass Treehouse",
        "Private Cedar Hot Tub & Finnish Sauna Access",
        "Complimentary 4-Course Private Host Wine Dinner",
        "Daily Sunrise Yoga & Forest Bathing Guided Walk",
        "All Activities and Equipment Pass Included",
        "VIP Welcome Gift: Artisanal Honey, Wine & Wool Throw"
      ]
    }
  ],

  coupons: [
    { code: "VERDANT20", discount: 20, type: "percent", description: "20% Off Your Autumn Countryside Stay" },
    { code: "HARVEST15", discount: 15, type: "percent", description: "15% Off Any Farmstay Package" },
    { code: "NATURE10", discount: 10, type: "percent", description: "10% Welcome Discount for New Guests" },
    { code: "RUSTIC50", discount: 50, type: "flat", description: "$50 Flat Discount on Bookings over $300" }
  ],

  users: [
    {
      id: "user-admin",
      name: "Eleanor Vance",
      email: "admin@homestay.com",
      password: "Admin@123",
      role: "admin",
      phone: "+44 20 7946 0912",
      address: "12 Meadow Lane, Oxford, UK",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      joined: "2020-01-15"
    },
    {
      id: "user-guest",
      name: "Sarah Jenkins",
      email: "guest@homestay.com",
      password: "Guest@123",
      role: "guest",
      phone: "+1 (555) 392-8190",
      address: "742 Evergreen Terr, Springfield, USA",
      country: "United States",
      dob: "1992-06-14",
      language: "English",
      avatar: null,
      joined: "2022-04-10"
    },
    {
      id: "user-host",
      name: "Arthur Pendelton",
      email: "host@homestay.com",
      password: "Host@123",
      role: "host",
      phone: "+44 1451 820 441",
      address: "Old Mill Lane, Bourton-on-the-Water, UK",
      country: "United Kingdom",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      joined: "2021-03-01",
      managedPropertyId: "prop-1"
    }
  ],

  bookings: [
    {
      id: "VH-80291",
      propertyId: "prop-1",
      propertyName: "Whispering Pines Farmhouse",
      propertyImage: "assets/images/whispering-pines.jpg",
      location: "Cotswolds, United Kingdom",
      roomType: "Orchard View Master Suite",
      guestName: "Sarah Jenkins",
      guestEmail: "guest@homestay.com",
      guestPhone: "+1 (555) 392-8190",
      checkIn: "2026-11-20",
      checkOut: "2026-11-24",
      nights: 4,
      adults: 2,
      children: 1,
      roomsCount: 1,
      pricePerNight: 210,
      subtotal: 840,
      cleaningFee: 45,
      serviceFee: 65,
      tax: 47,
      discount: 84, // coupon applied
      couponApplied: "NATURE10",
      totalAmount: 913,
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
      bookingStatus: "Upcoming",
      specialRequests: "Arriving around 4:30 PM. We would love the extra baby cot in the master suite.",
      createdAt: "2026-11-01T14:32:00Z"
    },
    {
      id: "VH-79820",
      propertyId: "prop-3",
      propertyName: "Golden Valley Vineyard Estate",
      propertyImage: "assets/images/golden-valley.jpg",
      location: "Tuscany, Italy",
      roomType: "Vigna Nobile Grand Suite",
      guestName: "Sarah Jenkins",
      guestEmail: "guest@homestay.com",
      guestPhone: "+1 (555) 392-8190",
      checkIn: "2026-09-12",
      checkOut: "2026-09-15",
      nights: 3,
      adults: 2,
      children: 0,
      roomsCount: 1,
      pricePerNight: 330,
      subtotal: 990,
      cleaningFee: 60,
      serviceFee: 85,
      tax: 56,
      discount: 0,
      couponApplied: "",
      totalAmount: 1191,
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
      bookingStatus: "Completed",
      specialRequests: "Wine cellar tour on the second evening please.",
      createdAt: "2026-08-20T09:15:00Z"
    },
    {
      id: "VH-80415",
      propertyId: "prop-4",
      propertyName: "Cedar Ridge Mountain Cottage",
      propertyImage: "assets/images/cedar-ridge.jpg",
      location: "Vermont, USA",
      roomType: "Peak View Master Chalet",
      guestName: "Michael Thorne",
      guestEmail: "mthorne@example.com",
      guestPhone: "+1 (802) 555-0199",
      checkIn: "2026-11-04",
      checkOut: "2026-11-08",
      nights: 4,
      adults: 2,
      children: 2,
      roomsCount: 1,
      pricePerNight: 215,
      subtotal: 860,
      cleaningFee: 50,
      serviceFee: 70,
      tax: 49,
      discount: 0,
      totalAmount: 1029,
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
      bookingStatus: "Checked In",
      specialRequests: "Bringing one golden retriever dog.",
      createdAt: "2026-10-14T11:20:00Z"
    },
    {
      id: "VH-81004",
      propertyId: "prop-6",
      propertyName: "Blue River Riverside Cabin",
      propertyImage: "assets/images/blue-river.jpg",
      location: "Lake District, UK",
      roomType: "Riverbank Timber Suite",
      guestName: "Emma Watson",
      guestEmail: "emma.w@example.com",
      guestPhone: "+44 7700 900321",
      checkIn: "2026-12-01",
      checkOut: "2026-12-05",
      nights: 4,
      adults: 2,
      children: 0,
      roomsCount: 1,
      pricePerNight: 175,
      subtotal: 700,
      cleaningFee: 40,
      serviceFee: 55,
      tax: 39,
      discount: 140, // VERDANT20
      couponApplied: "VERDANT20",
      totalAmount: 694,
      paymentMethod: "Cash on Arrival",
      paymentStatus: "Pending",
      bookingStatus: "Pending",
      specialRequests: "Requesting fishing equipment rental.",
      createdAt: "2026-11-02T16:45:00Z"
    },
    {
      id: "VH-78933",
      propertyId: "prop-2",
      propertyName: "Willow Creek Eco Lodge",
      propertyImage: "assets/images/willow-creek.jpg",
      location: "Black Forest, Germany",
      roomType: "Cedar Streamside Cabin",
      guestName: "Sarah Jenkins",
      guestEmail: "guest@homestay.com",
      guestPhone: "+1 (555) 392-8190",
      checkIn: "2026-07-10",
      checkOut: "2026-07-13",
      nights: 3,
      adults: 2,
      children: 0,
      roomsCount: 1,
      pricePerNight: 160,
      subtotal: 480,
      cleaningFee: 35,
      serviceFee: 40,
      tax: 28,
      discount: 0,
      totalAmount: 583,
      paymentMethod: "PayPal",
      paymentStatus: "Refunded",
      bookingStatus: "Cancelled",
      specialRequests: "Cancelled due to personal flight reschedule.",
      createdAt: "2026-06-18T10:00:00Z"
    }
  ],

  reviews: [
    {
      id: "rev-1",
      propertyId: "prop-1",
      propertyName: "Whispering Pines Farmhouse",
      author: "Eleanor Wright",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      date: "October 14, 2026",
      rating: 5,
      subRatings: { cleanliness: 5, comfort: 5, hospitality: 5, location: 5, value: 5 },
      text: "An unforgettable stay in the Cotswolds! Arthur and Martha welcomed us with warm sourdough straight from their hearth and honey from their own bees. The kids adored collecting eggs every morning, and watching dusk settle over the apple orchard with a glass of local cider was pure peace.",
      status: "Approved"
    },
    {
      id: "rev-2",
      propertyId: "prop-3",
      propertyName: "Golden Valley Vineyard Estate",
      author: "Sarah Jenkins",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      date: "September 18, 2026",
      rating: 5,
      subRatings: { cleanliness: 5, comfort: 5, hospitality: 5, location: 5, value: 4.8 },
      text: "Even more breathtaking than the photographs. Sitting by the infinity pool overlooking the Val d'Orcia hills while sipping Matteo's reserve Sangiovese is one of the greatest travel memories of my life. Sofia's homemade pasta class was worth every penny.",
      status: "Approved"
    },
    {
      id: "rev-3",
      propertyId: "prop-4",
      propertyName: "Cedar Ridge Mountain Cottage",
      author: "Julian Davies",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      date: "October 28, 2026",
      rating: 5,
      subRatings: { cleanliness: 5, comfort: 5, hospitality: 4.9, location: 5, value: 4.8 },
      text: "The mountain view through the cathedral glass is world-class. We woke up to morning fog clearing over the pine ridges, enjoyed the cedar hot tub every evening, and the woodstove made the chalet delightfully cozy.",
      status: "Approved"
    },
    {
      id: "rev-4",
      propertyId: "prop-2",
      propertyName: "Willow Creek Eco Lodge",
      author: "Annette Braun",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      date: "September 02, 2026",
      rating: 4.8,
      subRatings: { cleanliness: 5, comfort: 4.8, hospitality: 5, location: 5, value: 4.7 },
      text: "True off-grid luxury. Listening to the trout stream right from the bed was so therapeutic. The wood-fired hot tub among the towering pine trees is pure magic. We will return next summer!",
      status: "Approved"
    }
  ],

  wishlist: [],

  notifications: [
    {
      id: "notif-1",
      userId: "user-guest",
      title: "Reservation Confirmed: Whispering Pines",
      message: "Your upcoming stay at Whispering Pines Farmhouse (Nov 20 - Nov 24) is confirmed. Hosts Arthur & Martha are excited to welcome you!",
      type: "booking",
      date: "2026-11-01T14:35:00Z",
      read: false
    },
    {
      id: "notif-2",
      userId: "user-guest",
      title: "Autumn Flash Sale: 20% Off",
      message: "Use code VERDANT20 to save 20% on any countryside farmstay booked before November 30.",
      type: "offer",
      date: "2026-10-28T09:00:00Z",
      read: true
    },
    {
      id: "notif-3",
      userId: "user-guest",
      title: "Payment Receipt Available",
      message: "Your receipt for booking #VH-80291 ($913.00) is ready to download.",
      type: "payment",
      date: "2026-11-01T14:33:00Z",
      read: false
    },
    {
      id: "notif-4",
      userId: "user-admin",
      title: "New Booking Created: #VH-81004",
      message: "Emma Watson made a new reservation for Blue River Riverside Cabin ($694.00).",
      type: "system",
      date: "2026-11-02T16:45:00Z",
      read: false
    }
  ]
};

// Global DB Wrapper API
const VerdantDB = {
  // Helper to resolve image paths across root and subfolders (e.g. /guest/, /booking/)
  resolveImagePath(url) {
    if (!url) return 'assets/images/whispering-pines.jpg';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/')) {
      return url;
    }
    const path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
    const isSubdir = path.includes('/guest/') || path.includes('/booking/') || path.includes('/blog/') || path.includes('/auth/') || path.includes('/errors/');
    if (isSubdir && url.startsWith('assets/')) {
      return '../' + url;
    }
    return url;
  },

  // Initialize Database in LocalStorage
  init() {
    try {
      const existing = localStorage.getItem(VERDANT_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(VERDANT_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
      } else {
        const db = JSON.parse(existing);
        let updated = false;

        // Reset old hardcoded 3-item wishlist if user hasn't customized it
        if (Array.isArray(db.wishlist) && db.wishlist.length === 3 && db.wishlist[0] === 'prop-1' && db.wishlist[1] === 'prop-3' && db.wishlist[2] === 'prop-4') {
          db.wishlist = [];
          updated = true;
        }

        // Synchronize updated authentic topic-matched property images and newly added stays
        if (Array.isArray(db.properties)) {
          INITIAL_DATABASE.properties.forEach(initP => {
            const p = db.properties.find(item => item.id === initP.id);
            if (p) {
              p.images = initP.images;
              updated = true;
            } else {
              db.properties.push(initP);
              updated = true;
            }
          });
        }

        // Synchronize updated authentic topic-matched activity images and newly added activities
        if (Array.isArray(db.activities)) {
          INITIAL_DATABASE.activities.forEach(initA => {
            const a = db.activities.find(item => item.id === initA.id);
            if (a) {
              a.image = initA.image;
              updated = true;
            } else {
              db.activities.push(initA);
              updated = true;
            }
          });
        }

        // Synchronize booking images
        if (Array.isArray(db.bookings)) {
          db.bookings.forEach(b => {
            const initP = INITIAL_DATABASE.properties.find(p => p.id === b.propertyId);
            if (initP && initP.images && initP.images[0]) {
              b.propertyImage = initP.images[0];
              updated = true;
            }
          });
        }

        // Clean up any legacy stranger avatars from database
        if (Array.isArray(db.users)) {
          db.users.forEach(u => {
            if (u.avatar && (u.avatar.includes('photo-1534528741775-53994a69daeb') || u.avatar.includes('photo-1544005313-94ddf0286df2'))) {
              u.avatar = null;
              updated = true;
            }
          });
        }

        if (updated) {
          localStorage.setItem(VERDANT_STORAGE_KEY, JSON.stringify(db));
        }
      }

      // Clean up any legacy stranger avatar from current session user
      const cur = this.getCurrentUser();
      if (cur && cur.avatar && (cur.avatar.includes('photo-1534528741775-53994a69daeb') || cur.avatar.includes('photo-1544005313-94ddf0286df2'))) {
        cur.avatar = null;
        this.setCurrentUser(cur);
      }
      // Initially, visitors are guests until they log in (no auto-session)
    } catch (e) {
      console.warn("LocalStorage access error:", e);
    }
  },

  getDB() {
    try {
      const data = localStorage.getItem(VERDANT_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  },

  saveDB(db) {
    try {
      localStorage.setItem(VERDANT_STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error("Failed to save DB:", e);
      return false;
    }
  },

  resetData() {
    localStorage.setItem(VERDANT_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
    return INITIAL_DATABASE;
  },

  // PROPERTIES
  getProperties() {
    return this.getDB().properties || [];
  },

  getProperty(id) {
    return this.getProperties().find(p => p.id === id);
  },

  saveProperty(propData) {
    const db = this.getDB();
    if (!propData.id) {
      propData.id = "prop-" + Date.now();
      db.properties.unshift(propData);
    } else {
      const index = db.properties.findIndex(p => p.id === propData.id);
      if (index >= 0) {
        db.properties[index] = { ...db.properties[index], ...propData };
      } else {
        db.properties.unshift(propData);
      }
    }
    this.saveDB(db);
    return propData;
  },

  deleteProperty(id) {
    const db = this.getDB();
    db.properties = db.properties.filter(p => p.id !== id);
    this.saveDB(db);
    return true;
  },

  // ACTIVITIES
  getActivities() {
    return this.getDB().activities || [];
  },

  getActivity(id) {
    return this.getActivities().find(a => a.id === id);
  },

  saveActivity(actData) {
    const db = this.getDB();
    if (!actData.id) {
      actData.id = "act-" + Date.now();
      db.activities.unshift(actData);
    } else {
      const index = db.activities.findIndex(a => a.id === actData.id);
      if (index >= 0) {
        db.activities[index] = { ...db.activities[index], ...actData };
      } else {
        db.activities.unshift(actData);
      }
    }
    this.saveDB(db);
    return actData;
  },

  deleteActivity(id) {
    const db = this.getDB();
    db.activities = db.activities.filter(a => a.id !== id);
    this.saveDB(db);
    return true;
  },

  // BOOKINGS
  getBookings() {
    return this.getDB().bookings || [];
  },

  getBooking(id) {
    return this.getBookings().find(b => b.id === id);
  },

  getUserBookings(email) {
    return this.getBookings().filter(b => b.guestEmail.toLowerCase() === (email || '').toLowerCase());
  },

  createBooking(bookingData) {
    const db = this.getDB();
    const newId = "VH-" + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: newId,
      createdAt: new Date().toISOString(),
      bookingStatus: "Upcoming",
      paymentStatus: "Paid",
      ...bookingData
    };
    db.bookings.unshift(newBooking);

    // Add a notification for user
    const newNotif = {
      id: "notif-" + Date.now(),
      userId: newBooking.guestEmail,
      title: "Booking Confirmed: #" + newId,
      message: `Your reservation at ${newBooking.propertyName} is confirmed. Total: $${newBooking.totalAmount}.`,
      type: "booking",
      date: new Date().toISOString(),
      read: false
    };
    db.notifications.unshift(newNotif);

    this.saveDB(db);
    return newBooking;
  },

  updateBookingStatus(id, newStatus) {
    const db = this.getDB();
    const b = db.bookings.find(item => item.id === id);
    if (b) {
      b.bookingStatus = newStatus;
      if (newStatus === "Cancelled") {
        b.paymentStatus = "Refunded";
      }
      this.saveDB(db);
      return b;
    }
    return null;
  },

  // WISHLIST
  getWishlist() {
    return this.getDB().wishlist || [];
  },

  isInWishlist(propId) {
    const list = this.getWishlist();
    return list.includes(propId);
  },

  toggleWishlist(propId) {
    const db = this.getDB();
    db.wishlist = db.wishlist || [];
    const index = db.wishlist.indexOf(propId);
    let added = false;
    if (index >= 0) {
      db.wishlist.splice(index, 1);
      added = false;
    } else {
      db.wishlist.push(propId);
      added = true;
    }
    this.saveDB(db);
    return added;
  },

  // REVIEWS
  getReviews(propId) {
    const all = this.getDB().reviews || [];
    if (propId) {
      return all.filter(r => r.propertyId === propId && r.status === 'Approved');
    }
    return all;
  },

  addReview(reviewData) {
    const db = this.getDB();
    const newRev = {
      id: "rev-" + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: "Approved",
      ...reviewData
    };
    db.reviews.unshift(newRev);
    this.saveDB(db);
    return newRev;
  },

  updateReviewStatus(id, status) {
    const db = this.getDB();
    const r = db.reviews.find(item => item.id === id);
    if (r) {
      r.status = status;
      this.saveDB(db);
      return r;
    }
    return null;
  },

  deleteReview(id) {
    const db = this.getDB();
    db.reviews = db.reviews.filter(r => r.id !== id);
    this.saveDB(db);
    return true;
  },

  // COUPONS
  getCoupons() {
    return this.getDB().coupons || [];
  },

  validateCoupon(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return this.getCoupons().find(c => c.code.toUpperCase() === cleanCode) || null;
  },

  saveCoupon(coupon) {
    const db = this.getDB();
    db.coupons = db.coupons || [];
    const idx = db.coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx >= 0) {
      db.coupons[idx] = coupon;
    } else {
      db.coupons.push(coupon);
    }
    this.saveDB(db);
    return coupon;
  },

  deleteCoupon(code) {
    const db = this.getDB();
    db.coupons = db.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    this.saveDB(db);
    return true;
  },

  // NOTIFICATIONS
  getNotifications() {
    return this.getDB().notifications || [];
  },

  markNotificationRead(id) {
    const db = this.getDB();
    const notif = db.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveDB(db);
    }
    return true;
  },

  markAllNotificationsRead() {
    const db = this.getDB();
    (db.notifications || []).forEach(n => n.read = true);
    this.saveDB(db);
    return true;
  },

  // USERS & AUTH
  getUsers() {
    return this.getDB().users || [];
  },

  getCurrentUser() {
    try {
      const session = localStorage.getItem(VERDANT_SESSION_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) { }
    return null;
  },

  setCurrentUser(user) {
    localStorage.setItem(VERDANT_SESSION_KEY, JSON.stringify(user));
  },

  logout() {
    try {
      localStorage.removeItem(VERDANT_SESSION_KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  login(email, password) {
    const users = this.getUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: "Invalid email or password." };
  },

  register(userData) {
    const db = this.getDB();
    const cleanEmail = userData.email.trim().toLowerCase();
    if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: "Email is already registered." };
    }

    const newUser = {
      id: "user-" + Date.now(),
      role: userData.role || "guest",
      avatar: userData.avatar || null,
      joined: new Date().toISOString().split('T')[0],
      ...userData
    };
    db.users.push(newUser);
    this.saveDB(db);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  getUserAvatar(user, size = 80) {
    if (!user) {
      const guestSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}"><rect width="100" height="100" rx="50" fill="#2d6a4f"/><circle cx="50" cy="38" r="18" fill="#ffffff"/><path d="M22 84c0-15.5 12.5-28 28-28s28 12.5 28 28" fill="#ffffff"/></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(guestSvg)}`;
    }

    if (user.avatar &&
      typeof user.avatar === 'string' &&
      !user.avatar.includes('photo-1534528741775-53994a69daeb') &&
      !user.avatar.includes('photo-1544005313-94ddf0286df2') &&
      (user.avatar.startsWith('data:image') || user.avatar.startsWith('http') || user.avatar.startsWith('/'))) {
      return user.avatar;
    }

    const name = String(user.name || 'Guest User').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    let initials = 'U';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].slice(0, Math.min(2, parts[0].length)).toUpperCase();
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}"><defs><linearGradient id="vAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1b4332"/><stop offset="100%" stop-color="#2d6a4f"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#vAvatarGrad)"/><circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="${initials.length > 1 ? '38' : '44'}" font-weight="700" letter-spacing="1">${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  },

  updateProfile(profileData) {
    const db = this.getDB();
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const idx = db.users.findIndex(u => u.id === currentUser.id);
    if (idx >= 0) {
      db.users[idx] = { ...db.users[idx], ...profileData };
      this.saveDB(db);
      this.setCurrentUser(db.users[idx]);
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(VERDANT_SESSION_KEY);
  }
};

// Expose to window
if (typeof window !== 'undefined') {
  window.VerdantDB = VerdantDB;
}

// Auto-run initialization
VerdantDB.init();
