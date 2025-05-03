import { BriefcaseBusinessIcon, Calendar, Code2Icon, CrownIcon, LayoutDashboard, List, Puzzle, Settings, User2Icon, WalletCards } from "lucide-react";

export const SidebarOptions=[
    {
        name:'Dashboard',
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon:Calendar,
        path:'/scheduled-interview'
    },
    {
        name:'All Interviews',
        icon: List,
        path:'/all-interview'
    },
    {
        name:'Billing',
        icon:WalletCards,
        path:'/billing'
    },
    {
        name:'Settings',
        icon:Settings,
        path:'/settings'
    },
    
]

export const InterviewType=[
    {
        title:'Technical',
        icon: Code2Icon
    },
    {
        title:'Behavioral',
        icon: User2Icon
    },
    {
        title:'Experience',
        icon:BriefcaseBusinessIcon
    },
    {
        title:'Problem Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: CrownIcon
    }

]
export const QUESTIONS_PROMPT=`You are an expert technical interviewer. Based on the following inputs, generate a well-structured list of only high-quality interview questions (no skills, responsibilities requiered - just a list of questions): Job Title: {{jobTitle}}, Job Description: {{jobDescription}}, Interview Duration: {{duration}}, Interview Type: {{type}}. Your task: Analyze the job description to identify key responsibilities, required skills, and expected experience. Generate a list of interview questions depending on interview duration. Adjust the number and depth of questions to match the interview duration. Ensure the questions match the tone and structure of a real-life {{type}} interview. Format your response in JSON format with array list of questions like interviewQuestions=[{question:"", type:'any one as specified in Technical/Behavioral/Experience/Problem Solving/Leadership by user as {{type}}'}, {...}]. The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`
