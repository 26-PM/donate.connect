"use client"

import { useState } from "react"
import styles from "@/styles/donor-dashboard.module.css"

type DonationStatus = "awaiting" | "accepted" | "rejected" | "completed"

interface Donation {
  id: string
  date: string
  items: {
    category: string
    quantity: number
  }[]
  status: DonationStatus
  ngo?: string
  pickupDate?: string
  rejectionReason?: string
  impact?: string
  rating?: number
}

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending")
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)

  // Mock data for demonstration
  const pendingDonations: Donation[] = [
    {
      id: "don-001",
      date: "2023-03-01",
      items: [
        { category: "Food", quantity: 5 },
        { category: "Clothes", quantity: 3 },
      ],
      status: "awaiting",
    },
    {
      id: "don-002",
      date: "2023-03-05",
      items: [{ category: "Books", quantity: 10 }],
      status: "accepted",
      ngo: "Education First",
      pickupDate: "2023-03-10 14:00",
    },
    {
      id: "don-003",
      date: "2023-03-07",
      items: [{ category: "Electronics", quantity: 2 }],
      status: "rejected",
      ngo: "Tech For All",
      rejectionReason: "Items not in working condition",
    },
  ]

  const completedDonations: Donation[] = [
    {
      id: "don-004",
      date: "2023-02-15",
      items: [
        { category: "Food", quantity: 20 },
        { category: "Medicines", quantity: 5 },
      ],
      status: "completed",
      ngo: "Health & Wellness Foundation",
      pickupDate: "2023-02-20 10:00",
      impact: "Your food donation helped feed 15 families in need.",
      rating: 5,
    },
    {
      id: "don-005",
      date: "2023-02-01",
      items: [{ category: "Clothes", quantity: 15 }],
      status: "completed",
      ngo: "Clothing For All",
      pickupDate: "2023-02-05 13:30",
      impact: "Your clothing donation was distributed to homeless shelter residents.",
      rating: 4,
    },
  ]

  const getStatusLabel = (status: DonationStatus) => {
    switch (status) {
      case "awaiting":
        return "Awaiting Response"
      case "accepted":
        return "Accepted & Scheduled"
      case "rejected":
        return "Rejected"
      case "completed":
        return "Completed"
    }
  }

  const getStatusClass = (status: DonationStatus) => {
    switch (status) {
      case "awaiting":
        return styles.statusAwaiting
      case "accepted":
        return styles.statusAccepted
      case "rejected":
        return styles.statusRejected
      case "completed":
        return styles.statusCompleted
    }
  }

  const handleOpenFeedback = (donation: Donation) => {
    setSelectedDonation(donation)
    setRating(donation.rating || 0)
    setShowFeedbackModal(true)
  }

  const handleSubmitFeedback = () => {
    // In a real app, you would submit this to your backend
    console.log("Feedback submitted:", { donationId: selectedDonation?.id, rating, feedback })
    setShowFeedbackModal(false)
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "pending" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Donations
        </button>
        <button
          className={`${styles.tab} ${activeTab === "completed" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Donations
        </button>
      </div>

      <div className={styles.donationsList}>
        {activeTab === "pending" && (
          <>
            <h2>Pending Donations</h2>
            {pendingDonations.length === 0 ? (
              <p className={styles.emptyState}>No pending donations</p>
            ) : (
              pendingDonations.map((donation) => (
                <div key={donation.id} className={styles.donationCard}>
                  <div className={styles.donationHeader}>
                    <div>
                      <h3>Donation #{donation.id}</h3>
                      <p className={styles.date}>Requested on {new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`${styles.status} ${getStatusClass(donation.status)}`}>
                      {getStatusLabel(donation.status)}
                    </span>
                  </div>

                  <div className={styles.donationItems}>
                    <h4>Items:</h4>
                    <div className={styles.itemsList}>
                      {donation.items.map((item, index) => (
                        <span key={index} className={styles.item}>
                          {item.quantity} x {item.category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {donation.status === "accepted" && (
                    <div className={styles.pickupDetails}>
                      <h4>Pickup Details:</h4>
                      <p>
                        <strong>NGO:</strong> {donation.ngo}
                      </p>
                      <p>
                        <strong>Scheduled for:</strong> {new Date(donation.pickupDate || "").toLocaleString()}
                      </p>
                    </div>
                  )}

                  {donation.status === "rejected" && (
                    <div className={styles.rejectionDetails}>
                      <h4>Rejection Details:</h4>
                      <p>
                        <strong>NGO:</strong> {donation.ngo}
                      </p>
                      <p>
                        <strong>Reason:</strong> {donation.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "completed" && (
          <>
            <h2>Completed Donations</h2>
            {completedDonations.length === 0 ? (
              <p className={styles.emptyState}>No completed donations</p>
            ) : (
              completedDonations.map((donation) => (
                <div key={donation.id} className={styles.donationCard}>
                  <div className={styles.donationHeader}>
                    <div>
                      <h3>Donation #{donation.id}</h3>
                      <p className={styles.date}>Donated on {new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`${styles.status} ${getStatusClass(donation.status)}`}>
                      {getStatusLabel(donation.status)}
                    </span>
                  </div>

                  <div className={styles.donationItems}>
                    <h4>Items:</h4>
                    <div className={styles.itemsList}>
                      {donation.items.map((item, index) => (
                        <span key={index} className={styles.item}>
                          {item.quantity} x {item.category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.ngoDetails}>
                    <h4>Received by:</h4>
                    <p>{donation.ngo}</p>
                    <p>Picked up on {new Date(donation.pickupDate || "").toLocaleString()}</p>
                  </div>

                  {donation.impact && (
                    <div className={styles.impactReport}>
                      <h4>Impact Report:</h4>
                      <p>{donation.impact}</p>
                    </div>
                  )}

                  <div className={styles.ratingSection}>
                    {donation.rating ? (
                      <div className={styles.existingRating}>
                        <h4>Your Rating:</h4>
                        <div className={styles.stars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= (donation.rating || 0) ? styles.starFilled : styles.star}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <button className={styles.updateButton} onClick={() => handleOpenFeedback(donation)}>
                          Update Feedback
                        </button>
                      </div>
                    ) : (
                      <button className={styles.feedbackButton} onClick={() => handleOpenFeedback(donation)}>
                        Rate & Leave Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {showFeedbackModal && selectedDonation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Rate Your Experience</h3>
            <p>Donation to {selectedDonation.ngo}</p>

            <div className={styles.ratingInput}>
              <h4>Rating:</h4>
              <div className={styles.starsInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= rating ? styles.starFilled : styles.star}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.feedbackInput}>
              <h4>Feedback:</h4>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with this donation..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.cancelButton} onClick={() => setShowFeedbackModal(false)}>
                Cancel
              </button>
              <button className={styles.submitButton} onClick={handleSubmitFeedback}>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

