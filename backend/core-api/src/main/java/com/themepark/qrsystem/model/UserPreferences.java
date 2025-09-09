package com.themepark.qrsystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "preferences_id")
    private Long preferencesId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "language", length = 10)
    private String language;

    @Column(name = "notification_preferences")
    private String notificationPreferences;

    // Constructors, Getters, and Setters
    public UserPreferences() {}

    public UserPreferences(User user, String language, String notificationPreferences) {
        this.user = user;
        this.language = language;
        this.notificationPreferences = notificationPreferences;
    }

    public Long getPreferencesId() {
        return preferencesId;
    }

    public void setPreferencesId(Long preferencesId) {
        this.preferencesId = preferencesId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getNotificationPreferences() {
        return notificationPreferences;
    }

    public void setNotificationPreferences(String notificationPreferences) {
        this.notificationPreferences = notificationPreferences;
    }
}