import { getAllChallenges } from "@/API/challenges";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface ChallengeData {
    _id: string;
    title: string;
    difficulty: string;
    topic: string[];
    keywords: string[];
    problemStatement: string;
    constraints: string[];
    files: string[];
    status: string;
    acceptanceRate: number;
    submissions: number;
    isFeatured: boolean;
    companies: string[];
    createdAt: string;
    __v?: number;
}

type Status = "idle" | "loading" | "succeeded" | "failed";

interface Stats {
    [key: string]: number;
}

interface ChallengeState {
    challenges: ChallengeData[];
    loading: boolean;
    error: string | null;
    status: Status;
    companyStats: Stats;
    topicStats: Stats;
}

const initialState: ChallengeState = {
    challenges: [],
    loading: false,
    error: null,
    status: "idle",
    companyStats: {},
    topicStats: {},
};

export const fetchChallenges = createAsyncThunk("challenge/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await getAllChallenges();
        return response;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

export const getCompanyStats = createAsyncThunk("challenge/companyStats", async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { challenge: ChallengeState };
        const challenges = state.challenge.challenges;

        // Use a Map to track both count and the first display name we see for each company
        const companyMap = new Map<string, { count: number; displayName: string }>();
        challenges.forEach((challenge) => {
            challenge.companies.forEach((company) => {
                const key = company.toLowerCase();
                const existing = companyMap.get(key);
                if (existing) {
                    companyMap.set(key, { count: existing.count + 1, displayName: existing.displayName });
                } else {
                    companyMap.set(key, { count: 1, displayName: company });
                }
            });
        });

        // Convert Map back to the expected Stats format
        const companyStats: Stats = {};
        for (const [, { count, displayName }] of companyMap.entries()) {
            companyStats[displayName] = count;
        }

        return companyStats;
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to calculate company stats");
    }
});

export const getTopicStats = createAsyncThunk("challenge/topicStats", async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { challenge: ChallengeState };
        const challenges = state.challenge.challenges;

        // Create a map for case-insensitive topic tracking
        const topicMap = new Map<string, { count: number; displayName: string }>();
        challenges.forEach((challenge) => {
            challenge.topic.forEach((topic) => {
                const topicKey = topic.trim().toLowerCase(); // Normalize the topic
                const existing = topicMap.get(topicKey);
                if (existing) {
                    topicMap.set(topicKey, { count: existing.count + 1, displayName: existing.displayName });
                } else {
                    topicMap.set(topicKey, { count: 1, displayName: topic.trim() });
                }
            });
        });

        // Convert to the expected Stats format
        const topicStats: Stats = {};
        for (const [, { count, displayName }] of topicMap.entries()) {
            topicStats[displayName] = count;
        }

        return topicStats;
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to calculate topic stats");
    }
});

const challengeSlice = createSlice({
    name: "challenge",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChallenges.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchChallenges.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.challenges = action.payload.data;

                const companyMap = new Map<string, { count: number; displayName: string }>();
                const topicMap = new Map<string, { count: number; displayName: string }>();

                action.payload.data.forEach((challenge: ChallengeData) => {
                    challenge.companies.forEach((company: string) => {
                        const companyLower = company.toLowerCase();
                        const existing = companyMap.get(companyLower);
                        if (existing) {
                            existing.count += 1;
                        } else {
                            // Use the first occurrence's casing as the display name
                            companyMap.set(companyLower, { count: 1, displayName: company });
                        }
                    });
                    challenge.topic.forEach((topic: string) => {
                        const topicKey = topic.trim().toLowerCase(); // Normalize the topic
                        const existing = topicMap.get(topicKey);
                        if (existing) {
                            existing.count += 1;
                        } else {
                            // Use the first occurrence's casing as the display name
                            topicMap.set(topicKey, { count: 1, displayName: topic.trim() });
                        }
                    });
                });

                // Convert the maps to the expected Stats format
                state.companyStats = Object.fromEntries(
                    Array.from(companyMap.entries()).map(([, { count, displayName }]) => [displayName, count])
                );

                state.topicStats = Object.fromEntries(
                    Array.from(topicMap.entries()).map(([, { count, displayName }]) => [displayName, count])
                );
            })
            .addCase(fetchChallenges.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(getCompanyStats.fulfilled, (state, action) => {
                state.companyStats = action.payload;
            })
            .addCase(getTopicStats.fulfilled, (state, action) => {
                state.topicStats = action.payload;
            });
    },
});

// Selector to get challenge by ID
export const selectChallengeById = (state: { challenge: ChallengeState }, id: string) => {
    return state.challenge.challenges.find(challenge => challenge._id === id);
};

export default challengeSlice.reducer;
