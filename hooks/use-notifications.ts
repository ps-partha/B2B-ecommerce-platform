"use client"

import { useState, useEffect, useCallback } from "react"
import type { Notification } from "@/lib/types"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/notifications")

      if (!response.ok) {
        // throw new Error("Failed to fetch notifications")
        console.log("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read")
      }

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }, [])

  // Add a new notification (for testing purposes)
  const addNotification = useCallback((notification: Omit<Notification, "id" | "date">) => {
    // In a real app, this would be handled by the server
    // This is just for demo purposes
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }

    setNotifications((prev) => [newNotification, ...prev])
    return newNotification.id
  }, [])

  // Remove a notification
  const removeNotification = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete notification")
      }

      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    } catch (error) {
      console.error("Error removing notification:", error)
    }
  }, [])

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications()

    // Optional: Set up polling for new notifications
    const intervalId = setInterval(() => {
      fetchNotifications()
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(intervalId)
  }, [fetchNotifications])

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    refresh: fetchNotifications,
  }
}
