"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import styles from "@/styles/donation-form.module.css"
import LocationPicker from "./location-picker"
import DateTimePicker from "./date-time-picker"

type DonationItem = {
  category: string
  quantity: number
  description: string
  images: string[]
}

const categories = [
  { id: "food", name: "Food", icon: "🥗" },
  { id: "clothes", name: "Clothes", icon: "👕" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "medicines", name: "Medicines", icon: "💊" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "others", name: "Others", icon: "📦" },
]

export default function DonationForm() {
  const [step, setStep] = useState(1)
  const [items, setItems] = useState<DonationItem[]>([])
  const [currentItem, setCurrentItem] = useState<DonationItem>({
    category: "",
    quantity: 1,
    description: "",
    images: [],
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file))
      setCurrentItem({
        ...currentItem,
        images: [...currentItem.images, ...imageUrls],
      })
    }
  }

  const handleAddItem = () => {
    const newItems = selectedCategories.map((category) => {
      const categoryObj = categories.find((c) => c.id === category)
      return {
        category: categoryObj?.name || "",
        quantity: currentItem.quantity,
        description: currentItem.description,
        images: currentItem.images,
      }
    })

    setItems([...items, ...newItems])
    setCurrentItem({
      category: "",
      quantity: 1,
      description: "",
      images: [],
    })
    setSelectedCategories([])
    setStep(2)
  }

  const handleAddMore = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setStep(1)
        setItems([])
        setCurrentItem({
          category: "",
          quantity: 1,
          description: "",
          images: [],
        })
        setSelectedCategories([])
        setPickupDate(null)
        setLocation("")
        setIsSuccess(false)
      }, 3000)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✅</div>
        <h2>Donation Request Submitted!</h2>
        <p>You will receive a confirmation email and WhatsApp message shortly.</p>
      </div>
    )
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {step === 1 && "What would you like to donate?"}
        {step === 2 && "Add more items?"}
        {step === 3 && "Select pickup date & time"}
        {step === 4 && "Enter pickup location"}
        {step === 5 && "Review and submit"}
      </h2>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className={styles.step}>
            <div className={styles.categories}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`${styles.categoryButton} ${selectedCategories.includes(category.id) ? styles.selected : ""}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <div className={styles.itemDetails}>
                <div className={styles.formGroup}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number.parseInt(e.target.value) })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    className={styles.textarea}
                    placeholder="Provide details about your donation"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Upload Images (Optional)</label>
                  <div className={styles.imageUpload}>
                    <label htmlFor="images" className={styles.uploadButton}>
                      Choose Files
                    </label>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={styles.fileInput}
                    />
                  </div>

                  {currentItem.images.length > 0 && (
                    <div className={styles.imagePreview}>
                      {currentItem.images.map((image, index) => (
                        <div key={index} className={styles.previewItem}>
                          <Image src={image || "/placeholder.svg"} alt="Preview" width={80} height={80} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className={styles.primaryButton}
                  disabled={selectedCategories.length === 0}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <div className={styles.itemsList}>
              <h3>Items to donate ({items.length})</h3>
              <div className={styles.itemsGrid}>
                {items.map((item, index) => (
                  <div key={index} className={styles.itemCard}>
                    <h4>{item.category}</h4>
                    <p>Quantity: {item.quantity}</p>
                    {item.images.length > 0 && (
                      <div className={styles.itemImage}>
                        <Image src={item.images[0] || "/placeholder.svg"} alt={item.category} width={60} height={60} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={handleAddMore} className={styles.secondaryButton}>
                Yes, Add More Items
              </button>
              <button type="button" onClick={() => setStep(3)} className={styles.primaryButton}>
                No, Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step}>
            <DateTimePicker selectedDate={pickupDate} onDateChange={setPickupDate} />

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => setStep(2)} className={styles.secondaryButton}>
                Back
              </button>
              <button type="button" onClick={() => setStep(4)} className={styles.primaryButton} disabled={!pickupDate}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.step}>
            <LocationPicker location={location} onLocationChange={setLocation} />

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => setStep(3)} className={styles.secondaryButton}>
                Back
              </button>
              <button type="button" onClick={() => setStep(5)} className={styles.primaryButton} disabled={!location}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className={styles.step}>
            <div className={styles.reviewSection}>
              <h3>Review Your Donation</h3>

              <div className={styles.reviewBlock}>
                <h4>Items to Donate</h4>
                <div className={styles.itemsGrid}>
                  {items.map((item, index) => (
                    <div key={index} className={styles.itemCard}>
                      <h4>{item.category}</h4>
                      <p>Quantity: {item.quantity}</p>
                      {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.reviewBlock}>
                <h4>Pickup Details</h4>
                <p>
                  <strong>Date & Time:</strong> {pickupDate?.toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {location}
                </p>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => setStep(4)} className={styles.secondaryButton}>
                Back
              </button>
              <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Donation Request"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

