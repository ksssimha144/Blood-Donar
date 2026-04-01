const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Donor = require('./models/Donor');

dotenv.config();

const citySubAreas = {
  'Hyderabad': ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Madhapur', 'Manikonda', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Ameerpet', 'Himayatnagar', 'Begumpet', 'Uppal', 'L.B. Nagar', 'Hafeezpet', 'Miyapur'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'Rajajinagar', 'Banashankari', 'Electronic City', 'Marathahalli', 'Hebbal', 'Yelahanka', 'Bellandur', 'BTM Layout', 'Basavanagudi'],
  'Mumbai': ['Bandra', 'Juhu', 'Andheri', 'Colaba', 'Worli', 'Malad', 'Borivali', 'Ghatkopar', 'Powai', 'Versova', 'Chembur', 'Vile Parle', 'Dadar', 'Parel', 'Lower Parel'],
  'Delhi': ['Connaught Place', 'South Extension', 'Hauz Khas', 'Dwarka', 'Rohini', 'Janakpuri', 'Lajpat Nagar', 'Karol Bagh', 'Pitampura', 'Vasant Kunj', 'Greater Kailash', 'Saket', 'Rajouri Garden', 'Mayur Vihar', 'Chandni Chowk'],
  'Chennai': ['Adyar', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Mylapore', 'Nungambakkam', 'Besant Nagar', 'Guindy', 'Kodambakkam', 'Royapettah', 'Chromepet', 'Tambaram', 'Perambur', 'Alwarpet', 'Sholinganallur'],
  'Kolkata': ['Salt Lake', 'Park Street', 'Ballygunge', 'Behala', 'New Town', 'Garia', 'Tollygunge', 'Dum Dum', 'Alipore', 'Shyambazar', 'Lake Town', 'Jadavpur', 'Kasba', 'Bowbazar', 'Howrah'],
  'Pune': ['Kothrud', 'Viman Nagar', 'Hinjewadi', 'Baner', 'Wakad', 'Koregaon Park', 'Kalyani Nagar', 'Hadapsar', 'Magarpatta', 'Kondhwa', 'Pimpri', 'Chinchwad', 'Camp', 'Swargate', 'Bibwewadi'],
  'Ahmedabad': ['Satellite', 'Prahlad Nagar', 'Vastrapur', 'Bodakdev', 'C.G. Road', 'Ashram Road', 'Maninagar', 'Naroda', 'Gota', 'Bopal', 'Thaltej', 'Navrangpura', 'Usmanpura', 'Paldi', 'Ellis Bridge'],
  'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park', 'C-Scheme', 'Vidhyadhar Nagar', 'Bani Park', 'Gopalpura', 'Pratap Nagar', 'Jhotwara', 'Jagatpura', 'Sanganer', 'Tonk Road', 'Amer Road', 'Civil Lines'],
  'Surat': ['Adajan', 'Veshu', 'Varachha', 'Katargam', 'Piplod', 'Althan', 'Pal', 'Nanpura', 'Athwa Lines', 'Udhna', 'Rander', 'Majura Gate', 'Parle Point', 'Bhatar', 'Dumas']
};

const cities = [
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const names = [
  'Aravind', 'Bhavya', 'Chaitanya', 'Divya', 'Eshwar', 'Farhan', 'Goutham', 'Harika', 
  'Ishaan', 'Jahnavi', 'Karthik', 'Likhitha', 'Manish', 'Neha', 'Omkar', 'Priya', 
  'Rahul', 'Saanvi', 'Tarun', 'Usha', 'Vikram', 'Yamini', 'Zayan', 'Ananya', 
  'Deepak', 'Gayatri', 'Hemant', 'Indira', 'Jagdish', 'Kavya', 'Lokesh', 'Meera', 
  'Nitin', 'Pallavi', 'Ramesh', 'Sita', 'Tanmay', 'Uma', 'Vineet', 'Waseem', 
  'Xavier', 'Yash', 'Zoya', 'Aditi', 'Bharat', 'Charvi', 'Daksh', 'Ekta', 
  'Fathima', 'Ganesh'
];

const generatePhone = () => {
  const prefix = ['7', '8', '9'][Math.floor(Math.random() * 3)];
  let num = prefix;
  for (let i = 0; i < 9; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing Auth Users and Donors
    await User.deleteMany({});
    await Donor.deleteMany({});
    console.log('Old users and donors cleared.');

    // 2. Create a Master Seed User for Auth
    // Password will be hashed by pre-save hook in User model
    const masterUser = await User.create({
      name: 'System Admin',
      email: 'admin@vitalblood.com',
      password: 'password123'
    });
    console.log('Master Seed User created: admin@vitalblood.com / password123');

    const mockDonors = [];

    // 3. Generate 5 donors per city (Total 50)
    cities.forEach((city) => {
      const subAreas = citySubAreas[city.name];
      for (let i = 0; i < 5; i++) {
        const jitterLat = (Math.random() - 0.5) * 0.1;
        const jitterLng = (Math.random() - 0.5) * 0.1;
        
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomBloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
        const randomSubArea = subAreas[Math.floor(Math.random() * subAreas.length)];

        mockDonors.push({
          userId: masterUser._id, // LINK ALL TO MASTER USER
          name: `${randomName} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
          bloodGroup: randomBloodGroup,
          area: city.name,
          subArea: randomSubArea,
          phone: generatePhone(),
          location: {
            lat: city.lat + jitterLat,
            lng: city.lng + jitterLng,
          },
          isAvailable: true,
        });
      }
    });

    await Donor.insertMany(mockDonors);
    console.log(`Successfully seeded ${mockDonors.length} mock donors across India!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
