// src/components/common/pagesComponent/product/hooks/UseLocation.js
'use client';

import { useCallback, useMemo } from 'react';

// Move static data outside the hook
const BANGLADESH_DIVISIONS = [
  { id: "dhaka", name: "Dhaka" },
  { id: "chittagong", name: "Chittagong" },
  { id: "rajshahi", name: "Rajshahi" },
  { id: "khulna", name: "Khulna" },
  { id: "barisal", name: "Barisal" },
  { id: "sylhet", name: "Sylhet" },
  { id: "rangpur", name: "Rangpur" },
  { id: "mymensingh", name: "Mymensingh" }
];

const BANGLADESH_DISTRICTS = {
  dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Rajbari", "Shariatpur", "Madaripur", "Gopalganj"],
  chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Brahmanbaria", "Rangamati", "Khagrachari", "Bandarban", "Feni", "Lakshmipur", "Noakhali", "Chandpur"],
  rajshahi: ["Rajshahi", "Bogra", "Chapainawabganj", "Naogaon", "Natore", "Pabna", "Sirajganj", "Joypurhat"],
  khulna: ["Khulna", "Jessore", "Kushtia", "Chuadanga", "Jhenaidah", "Magura", "Narail", "Bagerhat", "Satkhira"],
  barisal: ["Barisal", "Barguna", "Patuakhali", "Bhola", "Jhalokati", "Pirojpur"],
  sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
  mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
};

const BANGLADESH_THANAS = {
  "Dhaka": ["Gulshan", "Banani", "Uttara", "Dhanmondi", "Mohammadpur", "Mirpur", "Motijheel", "Paltan", "Ramna", "Shahbag", "Tejgaon", "Khilgaon", "Sabujbagh", "Kafrul", "Cantonment", "Badda", "Rampura"],
  "Gazipur": ["Gazipur Sadar", "Tongi", "Kaliakoir", "Kaliganj", "Kapasia", "Sreepur"],
  "Narayanganj": ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"],
  "Chittagong": ["Chittagong Sadar", "Panchlaish", "Double Mooring", "Kotwali", "Pahartali", "Halishahar", "Baizid Bostami", "Khulshi"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Ramu", "Ukhia", "Teknaf", "Chakaria", "Pekua"],
  "Rajshahi": ["Rajshahi Sadar", "Boalia", "Motihar", "Shah Makhdum", "Paba", "Godagari"],
  "Khulna": ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Harintana"],
  "Barisal": ["Barisal Sadar", "Kawnia", "Bandar", "Gournadi", "Agailjhara"],
  "Sylhet": ["Sylhet Sadar", "Mogla Bazar", "Shah Poran", "Jalalabad", "South Surma"],
  "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur"],
  "Mymensingh": ["Mymensingh Sadar", "Kotwali", "Ganginarpar", "Trishal", "Muktagacha"]
};

export function useLocationData() {
  // Memoize functions to prevent recreation on every render
  const getDistricts = useCallback((division) => {
    if (!division) return [];
    return BANGLADESH_DISTRICTS[division] || [];
  }, []);

  const getThanas = useCallback((district) => {
    if (!district) return [];
    return BANGLADESH_THANAS[district] || [];
  }, []);

  const getAllDivisions = useCallback(() => {
    return BANGLADESH_DIVISIONS;
  }, []);

  return { 
    getDistricts, 
    getThanas, 
    getAllDivisions 
  };
}