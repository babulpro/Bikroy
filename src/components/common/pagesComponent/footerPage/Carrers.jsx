// src/app/pages/careers/page.jsx
'use client';

import { useState } from 'react';

const jobOpenings = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Dhaka",
    type: "Full-time",
    experience: "3-5 years",
    description: "We're looking for an experienced full-stack developer to join our engineering team."
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Dhaka",
    type: "Full-time",
    experience: "2-4 years",
    description: "Lead product strategy and execution for our marketplace platform."
  },
  {
    id: 3,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Dhaka",
    type: "Full-time",
    experience: "1-3 years",
    description: "Drive user acquisition and brand awareness through digital marketing campaigns."
  },
  {
    id: 4,
    title: "Customer Support Executive",
    department: "Support",
    location: "Dhaka",
    type: "Full-time",
    experience: "0-2 years",
    description: "Help our users with their questions and ensure a great experience."
  },
  {
    id: 5,
    title: "UI/UX Designer",
    department: "Design",
    location: "Dhaka",
    type: "Full-time",
    experience: "2-4 years",
    description: "Create beautiful and intuitive user interfaces for our platform."
  },
  {
    id: 6,
    title: "Data Analyst",
    department: "Analytics",
    location: "Dhaka",
    type: "Full-time",
    experience: "1-3 years",
    description: "Analyze data to drive business decisions and improve user experience."
  }
];

export default function Career() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Join Our Team</h1>
          <div className="w-24 h-1 mx-auto mt-4 bg-blue-600 rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600">
            Help us build the future of online commerce in Bangladesh. We're looking for passionate 
            individuals to join our growing team.
          </p>
        </div>

        {/* Why Join Us */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Why Join SellKoro?</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">Growth Opportunities</h3>
              <p className="text-sm text-gray-600">Learn and grow with a fast-paced startup</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">Great Culture</h3>
              <p className="text-sm text-gray-600">Collaborative, innovative, and inclusive environment</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">Impact</h3>
              <p className="text-sm text-gray-600">Make a real difference in people's lives</p>
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-bold text-white">Current Openings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {jobOpenings.map((job) => (
              <div key={job.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded-lg md:mt-0 md:ml-4 hover:bg-blue-700"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}