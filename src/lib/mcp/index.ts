import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listConversationsTool from "./tools/list-conversations";
import getConversationMessagesTool from "./tools/get-conversation-messages";
import getMbtiResultTool from "./tools/get-mbti-result";
import recentMoodTool from "./tools/recent-mood";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "mindful-me-mcp",
  title: "MindfulMe",
  version: "0.1.0",
  instructions:
    "Tools for MindfulMe, a mental wellness companion for youth. Read the signed-in user's chat conversations with Sir Hootington, mood entries, and MBTI personality result to offer supportive, personalized guidance.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listConversationsTool, getConversationMessagesTool, getMbtiResultTool, recentMoodTool],
});