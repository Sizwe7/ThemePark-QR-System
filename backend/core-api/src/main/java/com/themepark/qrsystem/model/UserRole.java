package com.themepark.qrsystem.model;

/**
 * User Role Enumeration
 * Defines the different types of users in the theme park system
 * 
 * @author SC MASEKO 402110470
 */
public enum UserRole {
    /**
     * Regular park visitor with basic access
     */
    VISITOR("Visitor"),
    
    /**
     * Park staff member with operational access
     */
    STAFF("Staff"),
    
    /**
     * Park manager with administrative access
     */
    MANAGER("Manager"),
    
    /**
     * System administrator with full access
     */
    ADMIN("Administrator");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Check if this role has administrative privileges
     */
    public boolean isAdministrative() {
        return this == MANAGER || this == ADMIN;
    }

    /**
     * Check if this role has staff privileges
     */
    public boolean isStaff() {
        return this == STAFF || this == MANAGER || this == ADMIN;
    }

    /**
     * Get the authority string for Spring Security
     */
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}

