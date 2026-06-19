// Auth
export interface RegisterRequest { name: string; email: string; password: string }
export interface LoginRequest { email: string; password: string }
export interface UserInfo { id: number; name: string; email: string; avatarUrl: string; problemsSolved: number; currentStreak: number; contestRating: number }
export interface AuthResponse { token: string; user: UserInfo }

// Dashboard
export interface StatsResponse { problemsSolved: number; contestRating: number; currentStreak: number; companiesCovered: number; studyHours: number; bookmarks: number }
export interface HeatmapEntry { date: string; count: number }
export interface ChartPoint { label: string; value: number }
export interface TopicProgress { topic: string; solved: number; total: number; percentage: number }
export interface ProgressResponse { contestTrend: ChartPoint[]; questionsTrend: ChartPoint[]; topicMastery: TopicProgress[] }
export interface ActivityItem { id: number; type: string; description: string; detail: string; difficulty: string; createdAt: string }

// Problems
export interface CompanyInfo { name: string; logoUrl: string }
export interface ProblemResponse { id: number; title: string; slug: string; difficulty: string; acceptanceRate: number; topics: string[]; companies: string[]; companyInfo: CompanyInfo[]; solved: boolean; bookmarked: boolean; leetcodeUrl: string; gfgUrl: string; youtubeUrl: string; articleUrl: string; subtopicId: number; subtopicName: string }
export interface ProblemListResponse { problems: ProblemResponse[]; totalPages: number; totalElements: number; currentPage: number }
export interface TopicResponse { id: number; name: string; icon: string; problemCount: number }

// Companies
export interface CompanyListItem { id: number; name: string; logoUrl: string; totalQuestions: number; hiringTrend: string }
export interface TopicCount { topic: string; count: number }
export interface CompanyDetailResponse { id: number; name: string; logoUrl: string; totalQuestions: number; hiringTrend: string; interviewFrequency: number; difficultyDistribution: Record<string, number>; topTopics: TopicCount[] }
export interface CompanyQuestionResponse { id: number; title: string; difficulty: string; timesAsked: number; frequency: string; acceptanceRate: number; solved: boolean }

// Profile
export interface PlatformListItem { platform: string; username: string; problemsSolved: number; contestRating: number; connected: boolean }
export interface PlatformDashboardResponse { platform: string; username: string; globalRank: number; countryRank: number; contestRating: number; problemsSolved: number; easySolved: number; mediumSolved: number; hardSolved: number; badgesCount: number; contestHistory: string; heatmapData: string; badges: string; recentActivity: string }
export interface LinkPlatformRequest { platform: string; username: string }

// Filters
export interface ProblemsFilter { topicId?: number; difficulty?: string; search?: string; bookmarked?: boolean; page: number; size: number }
