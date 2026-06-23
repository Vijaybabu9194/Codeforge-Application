package com.codeforge;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class InspectDB {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-bitter-bonus-aqt125cn.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String password = "npg_nav3E9wLyMUH";

        try {
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to Neon DB!");

            String sql = "SELECT id, email, name FROM users WHERE email = 'vijaybabuarumilli@gmail.com'";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                long userId = rs.getLong("id");
                System.out.println("User ID: " + userId + ", Email: " + rs.getString("email"));

                String profileSql = "SELECT id, platform, username, problems_solved, contest_rating, global_rank, country_rank, easy_solved, medium_solved, hard_solved FROM platform_profiles WHERE user_id = ?";
                PreparedStatement profileStmt = conn.prepareStatement(profileSql);
                profileStmt.setLong(1, userId);
                ResultSet profileRs = profileStmt.executeQuery();
                
                System.out.println("\nPlatform Profiles:");
                while (profileRs.next()) {
                    System.out.println("Platform: " + profileRs.getString("platform") + 
                                       ", Username: " + profileRs.getString("username") + 
                                       ", Solved: " + profileRs.getInt("problems_solved") + 
                                       ", Rating: " + profileRs.getInt("contest_rating") + 
                                       ", Global Rank: " + profileRs.getInt("global_rank") + 
                                       ", Country Rank: " + profileRs.getInt("country_rank") + 
                                       ", Easy: " + profileRs.getInt("easy_solved") + 
                                       ", Medium: " + profileRs.getInt("medium_solved") + 
                                       ", Hard: " + profileRs.getInt("hard_solved"));
                }
            } else {
                System.out.println("User not found!");
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
