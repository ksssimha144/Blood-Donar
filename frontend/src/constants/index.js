export const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AREAS = [
  'Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
];

export const SUB_AREAS = {
  'Hyderabad': ['All', 'Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Madhapur', 'Manikonda', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Ameerpet', 'Himayatnagar', 'Begumpet', 'Uppal', 'L.B. Nagar', 'Hafeezpet', 'Miyapur'],
  'Bangalore': ['All', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'Rajajinagar', 'Banashankari', 'Electronic City', 'Marathahalli', 'Hebbal', 'Yelahanka', 'Bellandur', 'BTM Layout', 'Basavanagudi'],
  'Mumbai': ['All', 'Bandra', 'Juhu', 'Andheri', 'Colaba', 'Worli', 'Malad', 'Borivali', 'Ghatkopar', 'Powai', 'Versova', 'Chembur', 'Vile Parle', 'Dadar', 'Parel', 'Lower Parel'],
  'Delhi': ['All', 'Connaught Place', 'South Extension', 'Hauz Khas', 'Dwarka', 'Rohini', 'Janakpuri', 'Lajpat Nagar', 'Karol Bagh', 'Pitampura', 'Vasant Kunj', 'Greater Kailash', 'Saket', 'Rajouri Garden', 'Mayur Vihar', 'Chandni Chowk'],
  'Chennai': ['All', 'Adyar', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Mylapore', 'Nungambakkam', 'Besant Nagar', 'Guindy', 'Kodambakkam', 'Royapettah', 'Chromepet', 'Tambaram', 'Perambur', 'Alwarpet', 'Sholinganallur'],
  'Kolkata': ['All', 'Salt Lake', 'Park Street', 'Ballygunge', 'Behala', 'New Town', 'Garia', 'Tollygunge', 'Dum Dum', 'Alipore', 'Shyambazar', 'Lake Town', 'Jadavpur', 'Kasba', 'Bowbazar', 'Howrah'],
  'Pune': ['All', 'Kothrud', 'Viman Nagar', 'Hinjewadi', 'Baner', 'Wakad', 'Koregaon Park', 'Kalyani Nagar', 'Hadapsar', 'Magarpatta', 'Kondhwa', 'Pimpri', 'Chinchwad', 'Camp', 'Swargate', 'Bibwewadi'],
  'Ahmedabad': ['All', 'Satellite', 'Prahlad Nagar', 'Vastrapur', 'Bodakdev', 'C.G. Road', 'Ashram Road', 'Maninagar', 'Naroda', 'Gota', 'Bopal', 'Thaltej', 'Navrangpura', 'Usmanpura', 'Paldi', 'Ellis Bridge'],
  'Jaipur': ['All', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park', 'C-Scheme', 'Vidhyadhar Nagar', 'Bani Park', 'Gopalpura', 'Pratap Nagar', 'Jhotwara', 'Jagatpura', 'Sanganer', 'Tonk Road', 'Amer Road', 'Civil Lines'],
  'Surat': ['All', 'Adajan', 'Veshu', 'Varachha', 'Katargam', 'Piplod', 'Althan', 'Pal', 'Nanpura', 'Athwa Lines', 'Udhna', 'Rander', 'Majura Gate', 'Parle Point', 'Bhatar', 'Dumas']
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
