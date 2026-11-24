import type { CaseInfo, MedicalEvent } from "../types";

// The data is 100% fictional. I dont know a Jordan Reyes :)
export const claimant: CaseInfo = {
  name: "Jordan Reyes",
  claimNumber: "WC-2024-01873",
  injuryDate: "2024-02-12",
  claimType: "Workers' compensation",
  pagesReviewed: 412,
};

export const events: Omit<MedicalEvent, "status">[] = [
  {
    id: 1,
    date: "2024-02-12",
    type: "Visit",
    title: "Emergency department visit",
    provider: "Lakeshore General Hospital",
    summary:
      "Claimant reports lower back pain after lifting a pallet at work. Pain rated 8/10. Prescribed rest and anti-inflammatories.",
    sourcePage: 3,
  },
  {
    id: 2,
    date: "2024-02-12",
    type: "Medication",
    title: "Naproxen 500 mg prescribed",
    provider: "Lakeshore General Hospital",
    summary: "Twice daily for 14 days. No known drug allergies recorded.",
    sourcePage: 5,
  },
  {
    id: 3,
    date: "2024-02-20",
    type: "Imaging",
    title: "Lumbar spine X-ray",
    provider: "Westview Imaging Centre",
    summary:
      "No fracture seen. Mild narrowing at L4–L5. Radiologist recommends MRI if symptoms persist.",
    sourcePage: 18,
  },
  {
    id: 4,
    date: "2024-03-04",
    type: "Visit",
    title: "Family physician follow-up",
    provider: "Dr. A. Mensah, MD",
    summary:
      "Pain reduced to 6/10. Numbness reported in left leg. Referred for MRI and physiotherapy.",
    sourcePage: 27,
  },
  {
    id: 5,
    date: "2024-03-18",
    type: "Imaging",
    title: "Lumbar spine MRI",
    provider: "Westview Imaging Centre",
    summary:
      "Small disc herniation at L4–L5 with mild contact on the left L5 nerve root.",
    sourcePage: 41,
  },
  {
    id: 6,
    date: "2024-03-25",
    type: "Procedure",
    title: "Physiotherapy started (12 sessions)",
    provider: "Harbourfront Physio",
    summary:
      "Core strengthening and mobility program. Attendance: 11 of 12 sessions completed.",
    sourcePage: 56,
  },
  {
    id: 7,
    date: "2024-05-02",
    type: "Lab",
    title: "Blood work panel",
    provider: "Dynacare Lab",
    summary:
      "All values within normal range. Ordered to rule out inflammatory causes.",
    sourcePage: 88,
  },
  {
    id: 8,
    date: "2024-06-14",
    type: "Procedure",
    title: "Epidural steroid injection",
    provider: "Dr. L. Chen, Pain Clinic",
    summary:
      "Left L4–L5 injection. Claimant reports 50% pain relief at 2-week check.",
    sourcePage: 132,
  },
  {
    id: 9,
    date: "2024-09-10",
    type: "Visit",
    title: "Independent medical exam",
    provider: "Dr. R. Patel, Orthopaedics",
    summary:
      "Range of motion improved. Recommends graduated return to modified duties.",
    sourcePage: 210,
  },
  {
    id: 10,
    date: "2025-01-22",
    type: "Visit",
    title: "Return-to-work assessment",
    provider: "Dr. A. Mensah, MD",
    summary: "Cleared for full duties with a 20 kg lifting limit for 3 months.",
    sourcePage: 305,
  },
];
