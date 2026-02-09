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