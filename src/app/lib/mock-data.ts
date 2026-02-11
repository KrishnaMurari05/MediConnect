export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  fees: number;
  avatar: string;
  location: string;
  bio: string;
  availability: string[];
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Mitchell',
    specialization: 'General Practitioner',
    experience: 12,
    rating: 4.9,
    fees: 75,
    avatar: 'https://picsum.photos/seed/doc1/200/200',
    location: 'New York, NY',
    bio: 'Experienced GP focused on holistic family health and preventive care.',
    availability: ['Mon 9am-5pm', 'Wed 10am-6pm']
  },
  {
    id: 'doc2',
    name: 'Dr. James Wilson',
    specialization: 'Cardiologist',
    experience: 15,
    rating: 4.8,
    fees: 150,
    avatar: 'https://picsum.photos/seed/doc2/200/200',
    location: 'San Francisco, CA',
    bio: 'Specialist in cardiovascular diseases and heart health management.',
    availability: ['Tue 8am-4pm', 'Thu 9am-5pm']
  },
  {
    id: 'doc3',
    name: 'Dr. Elena Rodriguez',
    specialization: 'Nutritionist',
    experience: 8,
    rating: 5.0,
    fees: 60,
    avatar: 'https://picsum.photos/seed/doc3/200/200',
    location: 'Miami, FL',
    bio: 'Helping patients achieve wellness through balanced nutrition and lifestyle changes.',
    availability: ['Mon-Fri 10am-2pm']
  },
  {
    id: 'doc4',
    name: 'Dr. David Chen',
    specialization: 'Dermatologist',
    experience: 10,
    rating: 4.7,
    fees: 120,
    avatar: 'https://picsum.photos/seed/doc4/200/200',
    location: 'Chicago, IL',
    bio: 'Expert in skin health, specializing in acne treatment and skin rejuvenation.',
    availability: ['Wed 2pm-8pm', 'Sat 9am-1pm']
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
      { id: 'm1', senderId: 'doc1', text: 'Hello! How can I help you today?', timestamp: '2023-10-25T10:00:00Z' },
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