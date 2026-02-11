export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  fees: number;
  avatar: string;
  location: string;
  address: string;
  phone: string;
  bio: string;
  availability: string[];
  lat: number;
  lng: number;
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Zarir Udwadia',
    specialization: 'Pulmonary Medicine Specialist',
    experience: 30,
    rating: 4.9,
    fees: 2500,
    avatar: 'https://picsum.photos/seed/doc1/200/200',
    location: 'Mumbai, Maharashtra',
    address: 'P.D. Hinduja National Hospital, Veer Savarkar Marg, Mahim, Mumbai 400016',
    phone: '+91 22 2444 9191',
    bio: 'World-renowned chest physician specializing in drug-resistant tuberculosis and critical care at Hinduja Hospital.',
    availability: ['Mon-Fri 10am-4pm'],
    lat: 19.0330,
    lng: 72.8383
  },
  {
    id: 'doc2',
    name: 'Dr. Naresh Trehan',
    specialization: 'Cardiovascular & Cardiothoracic Surgeon',
    experience: 45,
    rating: 5.0,
    fees: 3000,
    avatar: 'https://picsum.photos/seed/doc2/200/200',
    location: 'Gurugram, Delhi NCR',
    address: 'Medanta - The Medicity, Sector 38, Gurugram, Haryana 122001',
    phone: '+91 124 414 1414',
    bio: 'Chairman and Managing Director of Medanta, one of India’s most distinguished cardiac surgeons.',
    availability: ['By Appointment Only'],
    lat: 28.4285,
    lng: 77.0390
  },
  {
    id: 'doc3',
    name: 'Dr. Devi Prasad Shetty',
    specialization: 'Cardiac Surgeon',
    experience: 38,
    rating: 4.9,
    fees: 1000,
    avatar: 'https://picsum.photos/seed/doc3/200/200',
    location: 'Bengaluru, Karnataka',
    address: 'Narayana Institute of Cardiac Sciences, Bommasandra Industrial Area, Bengaluru 560099',
    phone: '+91 80 7122 2222',
    bio: 'Founder of Narayana Health, dedicated to making high-quality cardiac care affordable for everyone.',
    availability: ['Mon-Sat 9am-6pm'],
    lat: 12.8085,
    lng: 77.6974
  },
  {
    id: 'doc4',
    name: 'Dr. Prathiba Lakshmi',
    specialization: 'Consultant Dermatologist',
    experience: 15,
    rating: 4.8,
    fees: 1200,
    avatar: 'https://picsum.photos/seed/doc4/200/200',
    location: 'Hyderabad, Telangana',
    address: 'Apollo Hospitals, Jubilee Hills, Hyderabad 500033',
    phone: '+91 40 2360 7777',
    bio: 'Expert in clinical dermatology and aesthetic procedures at Apollo Health City.',
    availability: ['Wed 2pm-6pm', 'Sat 10am-2pm'],
    lat: 17.4262,
    lng: 78.4116
  },
  {
    id: 'doc5',
    name: 'Dr. S. Booma',
    specialization: 'Senior Consultant Pediatrician',
    experience: 25,
    rating: 4.9,
    fees: 800,
    avatar: 'https://picsum.photos/seed/doc5/200/200',
    location: 'Chennai, Tamil Nadu',
    address: 'Apollo Children’s Hospital, 15, Shafee Mohammed Rd, Thousand Lights, Chennai 600006',
    phone: '+91 44 2829 6262',
    bio: 'Specializing in neonatal and pediatric critical care at one of Chennai’s leading children’s facilities.',
    availability: ['Mon-Sat 9am-1pm'],
    lat: 13.0617,
    lng: 80.2520
  },
  {
    id: 'doc6',
    name: 'Dr. Kunal Sarkar',
    specialization: 'Senior Cardiac Surgeon',
    experience: 32,
    rating: 4.8,
    fees: 1500,
    avatar: 'https://picsum.photos/seed/doc6/200/200',
    location: 'Kolkata, West Bengal',
    address: 'Medica Superspecialty Hospital, 127, Mukundapur, Kolkata 700099',
    phone: '+91 33 6652 0000',
    bio: 'Vice-Chairman of Medica Superspecialty Hospital, known for excellence in complex bypass surgeries.',
    availability: ['Tue 11am-5pm', 'Fri 11am-5pm'],
    lat: 22.4842,
    lng: 88.4011
  }
];

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Consultation {
  id: string;
  userId: string;
  doctorId: string;
  status: 'pending' | 'active' | 'completed';
  messages: Message[];
  prescription?: string;
  report?: string;
}

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'c1',
    userId: 'user123',
    doctorId: 'doc1',
    status: 'active',
    messages: [
      { id: 'm1', senderId: 'doc1', text: 'Hello! I have reviewed your questionnaire. How are you feeling today?', timestamp: '2023-10-25T10:00:00Z' },
      { id: 'm2', senderId: 'user123', text: 'I have been feeling a bit dizzy lately.', timestamp: '2023-10-25T10:05:00Z' }
    ]
  }
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  image: string;
  readTime: string;
  category: string;
}

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'The 30-Minute Walk: A Prescription for Heart Health',
    excerpt: 'Dr. Devi Shetty explains why consistency in movement is the ultimate shield against cardiovascular issues.',
    content: `In my decades of practice as a cardiac surgeon, I have seen the most complex heart conditions. However, the most powerful prevention isn't found in a bottle of pills—it's in your walking shoes. A regular 30-minute brisk walk daily can reduce the risk of heart failure by nearly 40%. Fitness isn't about running marathons; it's about staying 'regularly fit' through daily, moderate exertion that keeps the heart muscle strong and the arteries flexible.`,
    author: 'Dr. Devi Shetty',
    authorRole: 'Cardiac Surgeon & Philanthropist',
    date: 'Oct 15, 2023',
    image: 'https://picsum.photos/seed/blog1/800/400',
    readTime: '5 min read',
    category: 'Heart Health'
  },
  {
    id: '2',
    title: 'Functional Fitness for the Modern Indian Lifestyle',
    excerpt: 'Dr. Naresh Trehan discusses how to incorporate exercise into a busy professional life without needing a gym.',
    content: `We often hear people say they don't have time for the gym. But 'regular fit' doesn't mean you need a luxury membership. It means functional movement. Taking the stairs at your office, using a standing desk, or doing simple bodyweight squats between meetings. Our traditional lifestyles were naturally active; we must now consciously re-introduce that movement. Your body is designed to move, not to sit for 10 hours a day.`,
    author: 'Dr. Naresh Trehan',
    authorRole: 'Cardiovascular Surgeon',
    date: 'Nov 02, 2023',
    image: 'https://picsum.photos/seed/blog2/800/400',
    readTime: '6 min read',
    category: 'Lifestyle'
  },
  {
    id: '3',
    title: 'Nutrition: The Foundation of Regular Fitness',
    excerpt: 'Dr. Anjali Mukerjee breaks down the myths of dieting and shares a sustainable approach to eating.',
    content: `Fitness is 70% nutrition. You cannot out-train a poor diet. In India, we have a carbohydrate-heavy diet that often lacks sufficient protein. Achieving a fit body requires balancing our traditional meals with higher protein sources like sprouts, paneer, and dals, while reducing refined sugars. Sustainability is key—don't follow a diet you can't maintain for a lifetime. Choose a 'regular' healthy way of eating.`,
    author: 'Dr. Anjali Mukerjee',
    authorRole: 'Nutritionist & Wellness Expert',
    date: 'Dec 10, 2023',
    image: 'https://picsum.photos/seed/blog3/800/400',
    readTime: '4 min read',
    category: 'Nutrition'
  }
];
