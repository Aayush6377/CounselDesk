import logo from "./images/Logo.png";
import ladyJustice from "./images/ladyJustice.png";
import howItWorks1 from "./images/howItWorks1.png";
import howItWorks2 from "./images/howItWorks2.png";
import howItWorks3 from "./images/howItWorks3.png";
import chatbot from "./images/chatbot.png";
import lawyerMeeting from "./images/lawyerMeeting.png";
import legalDocs from "./images/legalDocs.png";
import connection from "./images/connection.png";
import authBackground from "./images/authBackground.png";
import defaultProfile from "./images/defaultProfile.png"

export const images = {
    logo, ladyJustice, howItWorks1, howItWorks2, howItWorks3,
    chatbot, lawyerMeeting, legalDocs, connection, authBackground,
    defaultProfile
}

export const lawyers = [
  {
    "_id": "64f1a2c1e1a2b3c4d5e601",
    "name": "Adv. Rohan Mehta",
    "specialization": "Criminal Law",
    "rating": 3.5,
    "bio": "Experienced criminal lawyer with 12+ years of courtroom expertise.",
    "profileImage": "https://randomuser.me/api/portraits/men/32.jpg",
    "subscriptionPlan": "premium"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e602",
    "name": "Adv. Priya Sharma",
    "specialization": "Family Law",
    "rating": 1.6,
    "bio": "Specialist in divorce, custody, and family disputes with a compassionate approach.",
    "profileImage": "https://randomuser.me/api/portraits/women/44.jpg",
    "subscriptionPlan": "standard"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e603",
    "name": "Adv. Arjun Verma",
    "specialization": "Corporate Law",
    "rating": 4.9,
    "bio": "Corporate advisor for startups and MNCs, focusing on contracts and compliance.",
    "profileImage": "https://randomuser.me/api/portraits/men/28.jpg",
    "subscriptionPlan": "premium"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e604",
    "name": "Adv. Neha Kapoor",
    "specialization": "Intellectual Property",
    "rating": 4.7,
    "bio": "Helping innovators protect their patents, trademarks, and copyrights.",
    "profileImage": "https://randomuser.me/api/portraits/women/67.jpg",
    "subscriptionPlan": "free"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e605",
    "name": "Adv. Rajesh Gupta",
    "specialization": "Tax Law",
    "rating": 1.5,
    "bio": "Taxation expert with 15 years in handling IT returns, GST, and compliance cases.",
    "profileImage": "https://randomuser.me/api/portraits/men/50.jpg",
    "subscriptionPlan": "standard"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e606",
    "name": "Adv. Ananya Iyer",
    "specialization": "Cyber Law",
    "rating": 4.8,
    "bio": "Focused on cybercrime, data privacy, and IT compliance cases.",
    "profileImage": "https://randomuser.me/api/portraits/women/12.jpg",
    "subscriptionPlan": "premium"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e607",
    "name": "Adv. Karan Malhotra",
    "specialization": "Real Estate Law",
    "rating": 1.4,
    "bio": "Specialist in property disputes, agreements, and land registration cases.",
    "profileImage": "https://randomuser.me/api/portraits/men/70.jpg",
    "subscriptionPlan": "free"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e608",
    "name": "Adv. Sneha Patil",
    "specialization": "Environmental Law",
    "rating": 4.6,
    "bio": "Dedicated to cases related to pollution control, land use, and sustainability.",
    "profileImage": "https://randomuser.me/api/portraits/women/52.jpg",
    "subscriptionPlan": "standard"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e609",
    "name": "Adv. Mohit Bansal",
    "specialization": "Labour Law",
    "rating": 2.7,
    "bio": "Representing employees and employers in workplace disputes and contracts.",
    "profileImage": "https://randomuser.me/api/portraits/men/18.jpg",
    "subscriptionPlan": "premium"
  },
  {
    "_id": "64f1a2c1e1a2b3c4d5e610",
    "name": "Adv. Aditi Deshmukh",
    "specialization": "Civil Law",
    "rating": 4.5,
    "bio": "Experienced in civil disputes including contracts, torts, and property issues.",
    "profileImage": "https://randomuser.me/api/portraits/women/29.jpg",
    "subscriptionPlan": "free"
  }
]

export const lawyerProfile = {
  "lawyerId": "64f2a7b9c1a2e4f5d8a9b123",
  "name": "Adv. Rohan Sharma",
  "email": "rohan.sharma@lawhub.com",
  "phone": "+91-9876543210",
  "profileImage": "https://randomuser.me/api/portraits/men/32.jpg",
  "specialization": "Criminal Law",
  "bio": "Experienced criminal lawyer with 12+ years of practice in high court and supreme court. Specialized in bail matters and white-collar crime cases.",
  "qualification": "LLB, LLM – Delhi University",
  "rating": 4.8,
  "reviewsCount": 152,
  "fees": 2000,
  "subscriptionPlan": "Premium",
  "address": {
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "availability": [
    { "date": "2025-09-05", "time": "10:00 AM" },
    { "date": "2025-09-05", "time": "4:00 PM" },
    { "date": "2025-09-06", "time": "11:30 AM" }
  ],
  "reviews": [
    {
      "userName": "Priya Mehta",
      "rating": 5,
      "comment": "Very professional and explained everything clearly.",
      "date": "2025-08-20",
      "profileImage": "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      "userName": "Rahul Gupta",
      "rating": 4,
      "comment": "Good experience, but consultation started a bit late.",
      "date": "2025-08-18",
      "profileImage": "https://randomuser.me/api/portraits/men/57.jpg"
    }
  ]
}

export const dummyAppointments = [
  {
    "_id": "apt_001",
    "userId": "user_123",
    "lawyerId": {
      "_id": "lawyer_001",
      "name": "Adv. Rohan Sharma",
      "specialization": "Criminal Law",
      "rating": 4.8,
      "subscriptionPlan": "premium"
    },
    "slot": {
      "date": "2025-09-05",
      "time": "10:00 AM"
    },
    "fees": 1500,
    "status": "confirmed",
    "paymentId": "pay_001",
    "createdAt": "2025-08-30T12:00:00Z"
  },
  {
    "_id": "apt_002",
    "userId": "user_123",
    "lawyerId": {
      "_id": "lawyer_002",
      "name": "Adv. Priya Mehta",
      "specialization": "Corporate Law",
      "rating": 4.6,
      "subscriptionPlan": "standard"
    },
    "slot": {
      "date": "2025-09-07",
      "time": "4:00 PM"
    },
    "fees": 2000,
    "status": "cancelled",
    "paymentId": "pay_002",
    "createdAt": "2025-08-31T15:30:00Z"
  },
  {
    "_id": "apt_003",
    "userId": "user_123",
    "lawyerId": {
      "_id": "lawyer_003",
      "name": "Adv. Kunal Verma",
      "specialization": "Family Law",
      "rating": 4.3,
      "subscriptionPlan": "free"
    },
    "slot": {
      "date": "2025-09-10",
      "time": "11:30 AM"
    },
    "fees": 1200,
    "status": "completed",
    "paymentId": "pay_003",
    "createdAt": "2025-09-01T09:15:00Z"
  }
]

export const appointment = {
  "_id": "apt_001",
  "userId": "user_123",
  "lawyerId": {
    "_id": "lawyer_001",
    "name": "Adv. Rohan Sharma",
    "specialization": "Criminal Law",
    "rating": 4.8,
    "subscriptionPlan": "premium",
    "profileImage": "https://randomuser.me/api/portraits/men/32.jpg"
  },
  "slot": {
    "date": "2025-09-05",
    "time": "10:00 AM"
  },
  "fees": 1500,
  "status": "confirmed",
  "paymentId": "pay_001",
  "createdAt": "2025-08-30T12:00:00Z"
}

export const dummyPayment = [
  {
    "_id": "pay_001",
    "userId": "user_123",
    "lawyerId": {
      "_id": "lawyer_001",
      "name": "Adv. Rohan Sharma",
      "specialization": "Criminal Law",
      "profileImage": "https://randomuser.me/api/portraits/men/42.jpg"
    },
    "appointmentId": "apt_001",
    "amount": 1500,
    "currency": "INR",
    "type": "consultancy",
    "status": "success",
    "transactionId": "razorpay_txn_001",
    "createdAt": "2025-08-30T12:15:00Z"
  },
  {
    "_id": "pay_002",
    "userId": "user_123",
    "lawyerId": {
      "_id": "lawyer_002",
      "name": "Adv. Priya Mehta",
      "specialization": "Corporate Law",
      "profileImage": "https://randomuser.me/api/portraits/men/52.jpg"
    },
    "appointmentId": "apt_002",
    "amount": 2000,
    "currency": "INR",
    "type": "consultancy",
    "status": "pending",
    "transactionId": "razorpay_txn_002",
    "createdAt": "2025-08-31T16:00:00Z"
  },
  {
    "_id": "pay_003",
    "userId": "user_123",
    "lawyerId": {
      "_id": "lawyer_003",
      "name": "Adv. Kunal Verma",
      "specialization": "Family Law",
      "profileImage": "https://randomuser.me/api/portraits/men/72.jpg"
    },
    "appointmentId": "apt_003",
    "amount": 1200,
    "currency": "INR",
    "type": "consultancy",
    "status": "failed",
    "transactionId": "razorpay_txn_003",
    "createdAt": "2025-09-01T09:30:00Z"
  }
]

export const dummyReview = [
  {
    "_id": "rev001",
    "userId": {
      "_id": "usr001",
      "name": "Rohan Sharma",
      "profileImage": "https://randomuser.me/api/portraits/men/12.jpg"
    },
    "lawyerId": {
      "_id": "law001",
      "name": "Adv. Priya Mehta",
      "specialization": "Family Law",
      "rating": 4.8,
      "reviewsCount": 56
    },
    "appointmentId": "app001",
    "rating": 5,
    "comment": "Very helpful lawyer!",
    "createdAt": "2025-09-01T10:15:00Z"
  },
  {
    "_id": "rev002",
    "userId": {
      "_id": "usr002",
      "name": "Ankit Verma",
      "profileImage": "https://randomuser.me/api/portraits/men/15.jpg"
    },
    "lawyerId": {
      "_id": "law001",
      "name": "Adv. Priya Mehta",
      "specialization": "Family Law",
      "rating": 4.8,
      "reviewsCount": 56
    },
    "appointmentId": "app002",
    "rating": 4,
    "comment": "Good consultation, but waiting time was long.",
    "createdAt": "2025-09-02T08:30:00Z"
  },
  {
    "_id": "rev003",
    "userId": {
      "_id": "usr003",
      "name": "Sneha Kapoor",
      "profileImage": "https://randomuser.me/api/portraits/women/38.jpg"
    },
    "lawyerId": {
      "_id": "law001",
      "name": "Adv. Priya Mehta",
      "specialization": "Family Law",
      "rating": 4.8,
      "reviewsCount": 56
    },
    "appointmentId": "app003",
    "rating": 5,
    "comment": "Explained everything clearly. Highly recommended!",
    "createdAt": "2025-09-02T11:45:00Z"
  }
]

