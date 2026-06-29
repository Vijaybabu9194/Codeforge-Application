package com.codeforge;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class FixConstraint {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-bitter-bonus-aqt125cn.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String password = "npg_nav3E9wLyMUH";

        try {
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement stmt = conn.createStatement();
            
            System.out.println("Dropping outdated check constraint on platform_profiles...");
            stmt.executeUpdate("ALTER TABLE platform_profiles DROP CONSTRAINT IF EXISTS platform_profiles_platform_check;");
            
            System.out.println("Adding updated check constraint with all 6 platforms...");
            stmt.executeUpdate("ALTER TABLE platform_profiles ADD CONSTRAINT platform_profiles_platform_check CHECK (platform IN ('LEETCODE', 'CODEFORCES', 'GEEKSFORGEEKS', 'CODECHEF', 'HACKERRANK', 'GITHUB'));");
            
            System.out.println("Successfully updated PostgreSQL constraint for platform_profiles!");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
