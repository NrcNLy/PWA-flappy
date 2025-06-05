// --- CONFIGURATION & DATA ---
const FACTORS = {
    Openness: { name: "Openness", color: "var(--category-1-color)", lightBgDark: "bg-category-1-light-dark", textClass: "text-category-1", facets: ["Fantasy", "Aesthetics", "Feelings", "Actions", "Ideas", "Values"] },
    Conscientiousness: { name: "Conscientiousness", color: "var(--category-2-color)", lightBgDark: "bg-category-2-light-dark", textClass: "text-category-2", facets: ["Competence", "Order", "Dutifulness", "AchievementStriving", "Self-Discipline", "Deliberation"] },
    Extraversion: { name: "Extraversion", color: "var(--category-3-color)", lightBgDark: "bg-category-3-light-dark", textClass: "text-category-3", facets: ["Warmth", "Gregariousness", "Assertiveness", "Activity", "ExcitementSeeking", "PositiveEmotions"] },
    Agreeableness: { name: "Agreeableness", color: "var(--category-4-color)", lightBgDark: "bg-category-4-light-dark", textClass: "text-category-4", facets: ["Trust", "Straightforwardness", "Altruism", "Compliance", "Modesty", "TenderMindedness"] },
    Neuroticism: { name: "Neuroticism", color: "var(--category-5-color)", lightBgDark: "bg-category-5-light-dark", textClass: "text-category-5", facets: ["Anxiety", "AngryHostility", "Depression", "SelfConsciousness", "Impulsiveness", "Vulnerability"] }
};

// Mapping current facets to DeYoung's 10 Aspects (example, adjust as needed)
const FACET_TO_ASPECT_MAP = {
    Openness: { 
        Intellect: ["Ideas", "Values"], 
        Openness: ["Fantasy", "Aesthetics", "Feelings", "Actions"] 
    },
    Conscientiousness: { 
        Industriousness: ["Competence", "AchievementStriving", "Self-Discipline"], 
        Orderliness: ["Order", "Dutifulness", "Deliberation"] 
    },
    Extraversion: { 
        Enthusiasm: ["Warmth", "Gregariousness", "PositiveEmotions", "ExcitementSeeking"], 
        Assertiveness: ["Assertiveness", "Activity"] 
    },
    Agreeableness: { 
        Compassion: ["Altruism", "TenderMindedness", "Feelings"], // Assuming 'Feelings' from Openness might be re-evaluated or a similar Agreeableness facet exists
        Politeness: ["Trust", "Straightforwardness", "Compliance", "Modesty"] 
    },
    Neuroticism: { 
        Volatility: ["AngryHostility", "Impulsiveness"], 
        Withdrawal: ["Anxiety", "Depression", "SelfConsciousness", "Vulnerability"] 
    }
};

const FACTOR_HIGHLIGHTS = { 
    Openness: { High: { "Actions_Ideas": "Curious Explorer & Thinker", "Aesthetics_Feelings": "Imaginative Dreamer & Appreciator", "Fantasy_Values": "Unconventional Visionary", "Fantasy_Aesthetics": "Artistic Visionary", "Ideas_Values": "Philosophical Innovator", "Intellect": "Intellectual Explorer", "Openness": "Creative Visionary", Default: "Highly Open Individual" }, Average: { Default: "Balanced in Openness" }, Low: { "Actions_Ideas": "Practical Realist", "Aesthetics_Feelings": "Down-to-Earth Pragmatist", "Fantasy_Values": "Traditional & Grounded", "Fantasy_Aesthetics": "Concrete Thinker", "Ideas_Values": "Conventional & Focused", "Intellect": "Grounded Thinker", "Openness": "Pragmatic Realist", Default: "Prefers the Familiar" } },
    Conscientiousness: { High: { "Order_Self-Discipline": "Disciplined Organizer", "AchievementStriving_Competence": "Driven Achiever", "Dutifulness_Deliberation": "Methodical Planner", "Competence_Order": "Efficient & Tidy", "Industriousness": "Industrious Achiever", "Orderliness": "Systematic Planner", Default: "Highly Conscientious" }, Average: { Default: "Balanced in Conscientiousness" }, Low: { "Order_Self-Discipline": "Flexible & Spontaneous", "AchievementStriving_Competence": "Easygoing & Adaptable", "Dutifulness_Deliberation": "Relaxed & Unconstrained", "Industriousness": "Adaptable Worker", "Orderliness": "Spontaneous Organizer", Default: "Prefers Flexibility" } },
    Extraversion: { High: { "Gregariousness_Activity": "Energetic Socializer", "Assertiveness_PositiveEmotions": "Enthusiastic Leader", "Warmth_ExcitementSeeking": "Adventurous & Friendly", "Activity_Assertiveness": "Dynamic Go-Getter", "Enthusiasm": "Vivacious & Sociable", "Assertiveness": "Confident & Influential", Default: "Highly Extraverted" }, Average: { Default: "Balanced in Extraversion" }, Low: { "Gregariousness_Activity": "Quiet & Reserved", "Assertiveness_PositiveEmotions": "Calm & Reflective", "Warmth_ExcitementSeeking": "Peaceful & Independent", "Enthusiasm": "Reserved & Thoughtful", "Assertiveness": "Understated & Independent", Default: "Prefers Solitude/Small Groups" } },
    Agreeableness: { High: { "Altruism_TenderMindedness": "Compassionate Helper", "Trust_Compliance": "Cooperative & Trusting", "Straightforwardness_Modesty": "Sincere & Humble", "Compassion": "Empathetic & Caring", "Politeness": "Respectful & Considerate", Default: "Highly Agreeable" }, Average: { Default: "Balanced in Agreeableness" }, Low: { "Trust_Compliance": "Independent & Skeptical", "Straightforwardness_Modesty": "Direct & Self-Assured", "Altruism_TenderMindedness": "Analytical & Self-Reliant", "Compassion": "Objective & Pragmatic", "Politeness": "Forthright & Independent", Default: "More Independent/Critical" } },
    Neuroticism: { High: { "Anxiety_Vulnerability": "Sensitive & Worry-Prone", "Depression_SelfConsciousness": "Introspective & Cautious", "AngryHostility_Impulsiveness": "Passionate & Reactive", "Volatility": "Emotionally Intense", "Withdrawal": "Prone to Worry", Default: "Emotionally Reactive" }, Average: { Default: "Balanced Emotional Reactivity" }, Low: { "Anxiety_Vulnerability": "Calm & Resilient", "Depression_SelfConsciousness": "Confident & Secure", "AngryHostility_Impulsiveness": "Even-Tempered & Composed", "Volatility": "Steady & Composed", "Withdrawal": "Secure & Unworried", Default: "Emotionally Stable" } }
};

const TRAIT_DEFINITIONS = {
    Factors: {
        Openness: "The tendency towards imagination, creativity, intellectual curiosity, and a preference for variety and new experiences.",
        Conscientiousness: "The tendency to be organized, dependable, responsible, self-disciplined, and achievement-oriented.",
        Extraversion: "The tendency to be outgoing, sociable, assertive, energetic, and to enjoy social interaction and stimulation.",
        Agreeableness: "The tendency to be cooperative, empathetic, trusting, kind, and considerate of others' feelings.",
        Neuroticism: "The tendency to experience negative emotions like anxiety, sadness, or stress more frequently or intensely."
    },
    Facets: {
        Openness: {
            Fantasy: "A tendency towards a vivid imagination; creating rich inner worlds or elaborate daydreams.",
            Aesthetics: "A tendency for deep appreciation for art, beauty in various forms, and sensory richness.",
            Feelings: "The tendency to be highly attuned to one's own and others' emotions and to value emotional experiences.",
            Actions: "A tendency to prefer novelty and variety in activities, and a willingness to try new things.",
            Ideas: "The tendency towards intellectual curiosity, enjoying complex and abstract ideas, and philosophical thought.",
            Values: "A tendency towards willingness to re-examine social/political/religious values; less adherence to tradition."
        },
        Conscientiousness: {
            Competence: "The tendency to feel capable, sensible, prudent, and effective in tasks.",
            Order: "A tendency to prefer neatness, tidiness, organization, and structured environments.",
            Dutifulness: "A tendency towards a strong sense of moral obligation and adherence to ethical principles.",
            AchievementStriving: "The tendency for a high drive for personal success, setting ambitious goals, and working hard.",
            "Self-Discipline": "The tendency to persist in tasks, resist distractions, and carry plans through to completion.",
            Deliberation: "A tendency to think carefully and cautiously before acting or making decisions."
        },
        Extraversion: {
            Warmth: "The tendency to be affectionate, friendly, and to form close, expressive attachments easily.",
            Gregariousness: "A tendency to enjoy the company of others, thriving in social gatherings and large groups.",
            Assertiveness: "The tendency to be dominant, forceful, to speak out, and be comfortable taking charge.",
            Activity: "A tendency for a high energy level, preferring a fast-paced life, and liking to be busy.",
            ExcitementSeeking: "A tendency to crave stimulation, thrills, adventure, and novel experiences.",
            PositiveEmotions: "The tendency to frequently experience & express positive feelings like joy and optimism."
        },
        Agreeableness: {
            Trust: "A tendency to assume others are generally well-intentioned, honest, and trustworthy.",
            Straightforwardness: "The tendency to be frank, sincere, and ingenuous; saying what one means directly.",
            Altruism: "A tendency for genuine concern for others' welfare and being generous and considerate.",
            Compliance: "The tendency to defer to others, inhibit aggression, and forgive easily to maintain harmony.",
            Modesty: "A tendency towards being humble, not boasting, and not claiming superiority over others.",
            TenderMindedness: "The tendency to be sympathetic, compassionate, and easily moved by others' needs."
        },
        Neuroticism: {
            Anxiety: "A tendency towards worry, nervousness, tension, and fearfulness, even in everyday situations.",
            AngryHostility: "The tendency to experience anger, frustration, and bitterness easily or frequently.",
            Depression: "A tendency towards feelings of sadness, guilt, discouragement, and hopelessness.",
            SelfConsciousness: "The tendency to be easily embarrassed, shy, and feel awkward or judged in social situations.",
            Impulsiveness: "A tendency for difficulty controlling cravings/urges, especially when experiencing negative emotions.",
            Vulnerability: "The tendency to feel unable to cope effectively with stress, becoming panicky or dependent."
        }
    }
};


const introSlidesContent = [
     {
        type: 'intro',
        id: 'orientationAdvice', 
        title: "Optimal Viewing Experience",
        content: `<div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM16 3a1 1 0 10-2 0v1h2V3zM8 3a1 1 0 10-2 0v1h2V3z" /> <path stroke-linecap="round" stroke-linejoin="round" d="M7 11h10M7 15h10" />
                    </svg>
                    <p class="text-xl">For the best experience on smartphones, please rotate your device to <strong>landscape mode</strong>.</p>
                    <p class="text-slate-400 mt-2">(This slide will dismiss automatically if you're already in landscape or on a wider screen.)</p>
                  </div>`
    },
    {
        type: 'intro',
        title: "'Would You Rather' Personality Insights Tool", 
        content: `<img src="https://placehold.co/600x200/1E293B/A5B4FC?text=Five+Factor+Model+Analysis&font=lora" alt="Analysis banner" class="mx-auto rounded-lg mb-6 shadow-md">
                  <p class="text-xl text-center">This tool utilizes the Five Factor Model to provide insights into personality tendencies.</p>
                  <p class="text-center text-slate-400 mt-2">Through a series of preference-based scenarios, this analysis aims to illuminate your characteristic patterns of thought, feeling, and behavior.</p>`
    },
    { 
        type: 'intro',
        title: "Value & Limitations of This Tool",
        content: `<ul>
                      <li><strong>Value:</strong> This tool can enhance self-awareness by highlighting general tendencies and preferences. It may offer a structured way to reflect on how you typically interact with the world and approach situations. Understanding these patterns can be useful for personal development and interpersonal dynamics.</li>
                      <li><strong>Limitations:</strong> This is not a clinical diagnostic tool, nor does it capture the full complexity of an individual's personality, which is dynamic and context-dependent. Results should be viewed as indicative of general patterns based on your responses to specific scenarios, rather than definitive or exhaustive labels.</li>
                  </ul>`
    },
    {
        type: 'intro',
        title: "The Basics",
        content: `<ul>
                      <li>You'll navigate through <strong>120 scenarios</strong>.</li>
                      <li>For each prompt, choose the option that <em>most genuinely</em> reflects you.</li>
                      <li>There are no right or wrong answers – only insights to be gained!</li>
                      <li>Estimated time: <strong>20-30 minutes</strong>. Find a comfortable moment.</li>
                  </ul>`
    },
    {
        type: 'intro',
        title: "Interaction Guide",
        content: `<ul>
                      <li><strong>Making a Choice:</strong>
                          <ul class="list-disc list-inside ml-6 mt-1">
                              <li>Click your chosen option.</li>
                              <li>OR use Arrow Keys: <kbd>←</kbd> or <kbd>↑</kbd> for Left, <kbd>→</kbd> or <kbd>↓</kbd> for Right.</li>
                          </ul>
                      </li>
                      <li>Selection automatically advances to the next scenario.</li>
                      <li>You can use the "Previous" button to revisit your last answer.</li>
                      <li>The "Skip Question" button (<span class="text-red-400 font-semibold">use sparingly</span>) is available if you genuinely cannot decide between options. Skipping too many questions may reduce the accuracy of your profile.</li>
                  </ul>`
    },
    {
        type: 'intro',
        title: "What You'll Discover",
        content: `<ul>
                      <li>A visual Bar Chart of your personality profile.</li>
                      <li>Interactive breakdowns of specific trait facets.</li>
                      <li>Personalized insights and "Profile Highlights".</li>
                      <li>Areas for self-reflection and growth.</li>
                      <li>A downloadable PDF summary of your complete profile.</li>
                  </ul>
                   <p class="text-sm text-slate-400 pt-4">Your responses are confidential and used solely to generate your profile on this device.</p>`
    }
];

// --- 120 Unique Questions (4 per facet) ---
const questions = [
    // Openness - Fantasy
    { id: "O_Fan1", factor: "Openness", facet: "Fantasy", prompt: "When you have a quiet moment, you're more likely to find your mind:", options: [{ text: "Wandering into elaborate daydreams or imaginative scenarios.", score: 1 }, { text: "Focused on immediate surroundings or practical, current thoughts.", score: 0 }], type: 'question' },
    { id: "O_Fan2", factor: "Openness", facet: "Fantasy", prompt: "When listening to instrumental music without lyrics, you often:", options: [{ text: "Visualize detailed stories or scenes unfolding to the music.", score: 1 }, { text: "Appreciate the melody and rhythm without necessarily forming specific images.", score: 0 }], type: 'question' },
    { id: "O_Fan3", factor: "Openness", facet: "Fantasy", prompt: "If asked to come up with a new idea for a fictional world, your approach is to:", options: [{ text: "Brainstorm many unconventional possibilities, even if some are wild and fantastical.", score: 1 }, { text: "Focus on feasible, logical world-building elements based on existing knowledge.", score: 0 }], type: 'question' },
    { id: "O_Fan4", factor: "Openness", facet: "Fantasy", prompt: "During a long, uneventful journey (e.g., a train ride), you tend to:", options: [{ text: "Mentally 'check out' into a rich inner world of thoughts, memories, and stories.", score: 1 }, { text: "Observe other passengers, read a factual article, or plan your upcoming tasks.", score: 0 }], type: 'question' },
    
    // Openness - Aesthetics
    { id: "O_Aes1", factor: "Openness", facet: "Aesthetics", prompt: "When choosing everyday items (like a notebook or water bottle):", options: [{ text: "You're strongly drawn to items with unique artistic design, even if they cost a bit more.", score: 1 }, { text: "You primarily consider functionality, price, and a simple, practical design.", score: 0 }], type: 'question' },
    { id: "O_Aes2", factor: "Openness", facet: "Aesthetics", prompt: "You find that exposure to art, music, or beautiful natural scenery:", options: [{ text: "Deeply moves you and can significantly impact your mood and inspiration.", score: 1 }, { text: "Is pleasant, but doesn't typically evoke strong emotional responses or profound insights.", score: 0 }], type: 'question' },
    { id: "O_Aes3", factor: "Openness", facet: "Aesthetics", prompt: "If you had a free weekend, you'd be more inclined to:", options: [{ text: "Visit an art exhibition, attend a classical concert, or explore an architecturally interesting area.", score: 1 }, { text: "Engage in a practical hobby, catch up on chores, or relax with familiar entertainment.", score: 0 }], type: 'question' },
    { id: "O_Aes4", factor: "Openness", facet: "Aesthetics", prompt: "The visual presentation of food on a plate or the ambiance of a room:", options: [{ text: "Significantly contributes to your overall enjoyment and experience.", score: 1 }, { text: "Is a minor detail; you focus more on the core substance (taste, comfort).", score: 0 }], type: 'question' },

    // Openness - Feelings
    { id: "O_Fee1", factor: "Openness", facet: "Feelings", prompt: "When you experience a complex emotion (e.g., bittersweetness, awe):", options: [{ text: "You are inclined to delve into it, trying to understand its different layers and meanings.", score: 1 }, { text: "You prefer to acknowledge it briefly and then shift your focus to something more tangible.", score: 0 }], type: 'question' },
    { id: "O_Fee2", factor: "Openness", facet: "Feelings", prompt: "You believe that paying close attention to your inner emotional landscape is:", options: [{ text: "Essential for self-understanding, empathy, and personal growth.", score: 1 }, { text: "Sometimes useful, but can also lead to overthinking or unnecessary emotional indulgence.", score: 0 }], type: 'question' },
    { id: "O_Fee3", factor: "Openness", facet: "Feelings", prompt: "When discussing deeply personal matters with a trusted friend, you are more comfortable:", options: [{ text: "Talking openly and in detail about your feelings and emotional experiences.", score: 1 }, { text: "Focusing more on the events and facts, rather than the intricate emotional aspects.", score: 0 }], type: 'question' },
    { id: "O_Fee4", factor: "Openness", facet: "Feelings", prompt: "You find that art, poetry, or music that evokes a wide range of deep and nuanced emotions is:", options: [{ text: "Particularly compelling, thought-provoking, and enriching.", score: 1 }, { text: "Sometimes overwhelming or less enjoyable than more straightforward or uplifting expressions.", score: 0 }], type: 'question' },
    
    // Openness - Actions
    { id: "O_Act1", factor: "Openness", facet: "Actions", prompt: "When choosing a restaurant for a special occasion:", options: [{ text: "You're excited to try a brand new, perhaps experimental, type of cuisine or dining experience.", score: 1 }, { text: "You prefer to go to a well-loved, familiar restaurant where you know you'll enjoy the food and atmosphere.", score: 0 }], type: 'question' },
    { id: "O_Act2", factor: "Openness", facet: "Actions", prompt: "If presented with an unexpected opportunity to travel to a very different and unfamiliar culture next week:", options: [{ text: "You would feel a strong urge to embrace the adventure, even with the potential for unpredictability.", score: 1 }, { text: "You might feel hesitant due to the lack of planning and prefer destinations that are more similar to your own culture or better researched.", score: 0 }], type: 'question' },
    { id: "O_Act3", factor: "Openness", facet: "Actions", prompt: "Regarding your daily or weekly routines (e.g., commute, exercise, meals):", options: [{ text: "You enjoy actively seeking ways to shake things up, trying different approaches or schedules for variety.", score: 1 }, { text: "You find comfort, predictability, and efficiency in maintaining established and consistent routines.", score: 0 }], type: 'question' },
    { id: "O_Act4", factor: "Openness", facet: "Actions", prompt: "When learning a new practical skill (e.g., cooking a new dish, a DIY project):", options: [{ text: "You are eager to jump in and experiment with different techniques, even if it means making some mistakes along the way.", score: 1 }, { text: "You prefer to learn methodically, following instructions precisely to ensure a successful outcome and avoid errors.", score: 0 }], type: 'question' },

    // Openness - Ideas
    { id: "O_Ide1", factor: "Openness", facet: "Ideas", prompt: "You are more intellectually stimulated and engaged by:", options: [{ text: "Exploring complex, abstract theories, philosophical questions, or scientific paradoxes.", score: 1 }, { text: "Learning practical information, acquiring new skills, or discussing concrete, real-world problems.", score: 0 }], type: 'question' },
    { id: "O_Ide2", factor: "Openness", facet: "Ideas", prompt: "When encountering a new or unconventional idea that challenges your current understanding:", options: [{ text: "Your first instinct is to consider its possibilities and implications with open curiosity, even if it seems strange.", score: 1 }, { text: "Your first instinct is to compare it critically to established knowledge and assess its logical consistency and practicality.", score: 0 }], type: 'question' },
    { id: "O_Ide3", factor: "Openness", facet: "Ideas", prompt: "You enjoy engaging in deep debates or discussions where:", options: [{ text: "A wide range of diverse, even conflicting, viewpoints are explored for their intellectual merit.", score: 1 }, { text: "The primary goal is to reach a clear consensus, a practical solution, or a shared understanding of facts.", score: 0 }], type: 'question' },
    { id: "O_Ide4", factor: "Openness", facet: "Ideas", prompt: "You find yourself more drawn to books, documentaries, or lectures that:", options: [{ text: "Challenge your existing perspectives and introduce novel, thought-provoking concepts.", score: 1 }, { text: "Provide clear, well-structured factual information or teach a specific, useful skill.", score: 0 }], type: 'question' },

    // Openness - Values
    { id: "O_Val1", factor: "Openness", facet: "Values", prompt: "When considering long-standing social or political traditions:", options: [{ text: "You are open to re-examining their relevance and considering progressive changes or alternative systems.", score: 1 }, { text: "You tend to believe that such traditions have proven their worth over time and provide valuable stability.", score: 0 }], type: 'question' },
    { id: "O_Val2", factor: "Openness", facet: "Values", prompt: "If confronted with a complex moral dilemma that deeply challenges your existing ethical framework:", options: [{ text: "You are willing to critically evaluate your stance, consider different ethical theories, and potentially revise your position.", score: 1 }, { text: "You are more likely to seek justifications that align with your existing moral framework and feel uneasy with fundamentally different views.", score: 0 }], type: 'question' },
    { id: "O_Val3", factor: "Openness", facet: "Values", prompt: "You believe that societal rules and moral codes should ideally be:", options: [{ text: "Dynamic and adaptable, evolving to reflect changing times, diverse cultural contexts, and new understandings.", score: 1 }, { text: "Grounded in timeless, universal principles that should be consistently upheld across different situations.", score: 0 }], type: 'question' },
    { id: "O_Val4", factor: "Openness", facet: "Values", prompt: "When learning about religious beliefs or political ideologies very different from your own:", options: [{ text: "You try to understand their internal logic and appeal from the perspective of their adherents, even if you disagree.", score: 1 }, { text: "You tend to evaluate them primarily based on the norms, values, and perceived rationality of your own belief system.", score: 0 }], type: 'question' },
    
    // Conscientiousness - Competence (4 unique)
    { id: "C_Com1", factor: "Conscientiousness", facet: "Competence", prompt: "When you take on a new role or significant responsibility:", options: [{ text: "You generally feel well-prepared and confident in your ability to learn quickly and succeed.", score: 1 }, { text: "You often worry about whether you possess all the necessary skills and knowledge to perform adequately.", score: 0 }], type: 'question' },
    { id: "C_Com2", factor: "Conscientiousness", facet: "Competence", prompt: "After completing a complex and significant task, you are more likely to reflect on:", options: [{ text: "The skills you effectively applied and the challenges you successfully navigated.", score: 1 }, { text: "Any potential shortcomings or areas where you could have performed even better, sometimes feeling it wasn't perfect.", score: 0 }], type: 'question' },
    { id: "C_Com3", factor: "Conscientiousness", facet: "Competence", prompt: "When people describe your general approach to tasks, they would likely say you are:", options: [{ text: "Sensible, prudent, and capable of handling most situations effectively.", score: 1 }, { text: "Sometimes hesitant, needing reassurance, or less effective under pressure than you'd like to be.", score: 0 }], type: 'question' },
    { id: "C_Com4", factor: "Conscientiousness", facet: "Competence", prompt: "Your underlying belief in your own ability to achieve your important goals is generally:", options: [{ text: "Strong and resilient; you see yourself as an effective and capable individual.", score: 1 }, { text: "Moderate or variable; you sometimes doubt your capabilities, especially when facing significant obstacles or setbacks.", score: 0 }], type: 'question' },

    // Conscientiousness - Order
    { id: "C_Ord1", factor: "Conscientiousness", facet: "Order", prompt: "Regarding your personal belongings (e.g., desk, room, digital files):", options: [{ text: "You prefer them to be highly organized and tidy, and you regularly make an effort to maintain this system.", score: 1 }, { text: "You are comfortable with a more casual level of organization, or even some clutter, as long as you can generally find what you need.", score: 0 }], type: 'question' },
    { id: "C_Ord2", factor: "Conscientiousness", facet: "Order", prompt: "When planning an event, a trip, or a multi-step project:", options: [{ text: "You tend to create detailed lists, schedules, and step-by-step plans to ensure everything runs smoothly and efficiently.", score: 1 }, { text: "You prefer a more flexible, less structured approach, dealing with details and making decisions as they arise rather than planning extensively upfront.", score: 0 }], type: 'question' },
    { id: "C_Ord3", factor: "Conscientiousness", facet: "Order", prompt: "A messy or disorganized work or living environment tends to make you feel:", options: [{ text: "Unsettled, distracted, or less productive, often motivating you to tidy up before you can focus properly.", score: 1 }, { text: "Largely indifferent or only mildly bothered; you can function well even if things aren't perfectly neat.", score: 0 }], type: 'question' },
    { id: "C_Ord4", factor: "Conscientiousness", facet: "Order", prompt: "You find a certain satisfaction and peace of mind in:", options: [{ text: "Systematically arranging things, creating well-ordered systems, and having clear procedures to follow.", score: 1 }, { text: "Embracing spontaneity, adapting to changing circumstances, and not being overly constrained by rigid structures or plans.", score: 0 }], type: 'question' },

    // Conscientiousness - Dutifulness
    { id: "C_Dut1", factor: "Conscientiousness", facet: "Dutifulness", prompt: "When you've given your word or made a formal commitment:", options: [{ text: "You feel a very strong sense of moral obligation to see it through, almost regardless of personal inconvenience or sacrifice.", score: 1 }, { text: "You see it as important, but are open to renegotiating or adjusting if unforeseen circumstances make it extremely difficult or unfair.", score: 0 }], type: 'question' },
    { id: "C_Dut2", factor: "Conscientiousness", facet: "Dutifulness", prompt: "Your general stance on adherence to rules, regulations, and established procedures is that:", options: [{ text: "They should generally be valued and followed closely, as they provide necessary structure and fairness.", score: 1 }, { text: "They are often useful guidelines, but can and should be bent or reinterpreted if it seems more practical or ethical in a specific situation.", score: 0 }], type: 'question' },
    { id: "C_Dut3", factor: "Conscientiousness", facet: "Dutifulness", prompt: "If you accidentally broke a minor rule or overlooked an obligation that no one else noticed:", options: [{ text: "You would likely feel a strong need to correct the oversight or confess, driven by your conscience.", score: 1 }, { text: "You would likely assess the impact; if no real harm was done, you might let it go without much concern.", score: 0 }], type: 'question' },
    { id: "C_Dut4", factor: "Conscientiousness", facet: "Dutifulness", prompt: "You believe that fulfilling one's responsibilities and duties, even when they are difficult or unrewarding, is:", options: [{ text: "A core ethical principle and a fundamental mark of strong character.", score: 1 }, { text: "Important, but one must also realistically consider personal well-being, resource limitations, and the overall practicality of every obligation.", score: 0 }], type: 'question' },

    // Conscientiousness - AchievementStriving
    { id: "C_Ach1", factor: "Conscientiousness", facet: "AchievementStriving", prompt: "When you approach a new task, project, or learning opportunity:", options: [{ text: "You are highly motivated to excel, often setting ambitious standards for yourself and pushing your limits.", score: 1 }, { text: "You aim to do a competent and satisfactory job, but are less focused on surpassing expectations or being the absolute best.", score: 0 }], type: 'question' },
    { id: "C_Ach2", factor: "Conscientiousness", facet: "AchievementStriving", prompt: "The idea of working exceptionally long and hard hours to achieve a significant personal or professional goal is:", options: [{ text: "Often appealing and something you are quite willing to do if you believe the goal is worthwhile.", score: 1 }, { text: "Generally less appealing; you prefer a more balanced approach to work and life, even if it means slower progress on some goals.", score: 0 }], type: 'question' },
    { id: "C_Ach3", factor: "Conscientiousness", facet: "AchievementStriving", prompt: "You derive a particularly strong sense of personal satisfaction and fulfillment from:", options: [{ text: "Pushing your limits, overcoming significant challenges, and achieving difficult objectives that showcase your abilities.", score: 1 }, { text: "Completing tasks efficiently, enjoying the process, and having ample time for leisure and other life interests.", score: 0 }], type: 'question' },
    { id: "C_Ach4", factor: "Conscientiousness", facet: "AchievementStriving", prompt: "Compared to your peers, you would likely describe your innate drive for success, recognition, and continuous improvement as:", options: [{ text: "Noticeably higher than average; you are quite ambitious and goal-oriented.", score: 1 }, { text: "About average, or perhaps less intense; you value other things as much as, or more than, constant striving.", score: 0 }], type: 'question' },

    // Conscientiousness - Self-Discipline
    { id: "C_Sel1", factor: "Conscientiousness", facet: "Self-Discipline", prompt: "When faced with a tempting distraction (e.g., social media, a new TV show) while working on an important, deadline-driven task:", options: [{ text: "You can usually resist the distraction effectively and maintain your focus on the task at hand until it's completed.", score: 1 }, { text: "You often find yourself giving in to the distraction, at least for a little while, even if it means a last-minute rush later.", score: 0 }], type: 'question' },
    { id: "C_Sel2", factor: "Conscientiousness", facet: "Self-Discipline", prompt: "Sticking to a long-term personal plan or resolution (e.g., a new diet, a regular exercise routine, a consistent study schedule) is typically:", options: [{ text: "Something you are generally good at, demonstrating willpower and persistence even when it becomes challenging or monotonous.", score: 1 }, { text: "Often difficult for you; you might start with strong intentions but find it hard to maintain the required consistency over time.", score: 0 }], type: 'question' },
    { id: "C_Sel3", factor: "Conscientiousness", facet: "Self-Discipline", prompt: "You would describe your ability to make yourself do necessary things you don't particularly feel like doing (e.g., chores, difficult work) as:", options: [{ text: "Quite strong; you can generally push through a lack of motivation and get the job done.", score: 1 }, { text: "Variable; if you're not in the mood or feeling inspired, it's often very hard for you to get started or persevere.", score: 0 }], type: 'question' },
    { id: "C_Sel4", factor: "Conscientiousness", facet: "Self-Discipline", prompt: "When it comes to managing your day-to-day impulses (e.g., to overspend, to eat unhealthy snacks, to procrastinate on small tasks):", options: [{ text: "You generally have good self-control and can make choices aligned with your long-term interests.", score: 1 }, { text: "You sometimes struggle to keep these minor impulses in check, especially when tired or stressed.", score: 0 }], type: 'question' },

    // Conscientiousness - Deliberation
    { id: "C_Del1", factor: "Conscientiousness", facet: "Deliberation", prompt: "Before making a significant purchase, investment, or life commitment:", options: [{ text: "You tend to spend considerable time researching options, comparing pros and cons, and thinking through potential long-term consequences.", score: 1 }, { text: "You tend to make decisions relatively quickly based on your initial assessment, gut feeling, or the advice of someone you trust.", score: 0 }], type: 'question' },
    { id: "C_Del2", factor: "Conscientiousness", facet: "Deliberation", prompt: "When speaking in a group discussion or an important meeting, you are more likely to:", options: [{ text: "Carefully consider your words before speaking, sometimes pausing to formulate your thoughts precisely to avoid misunderstanding.", score: 1 }, { text: "Speak more spontaneously and freely, saying what comes to mind as the discussion flows, even if it's not perfectly polished.", score: 0 }], type: 'question' },
    { id: "C_Del3", factor: "Conscientiousness", facet: "Deliberation", prompt: "You see yourself as someone who is generally:", options: [{ text: "Cautious and reflective, preferring to think things through thoroughly before taking action or making a statement.", score: 1 }, { text: "More impulsive or action-oriented, willing to take initiative or speak your mind without extensive prior deliberation.", score: 0 }], type: 'question' },
    { id: "C_Del4", factor: "Conscientiousness", facet: "Deliberation", prompt: "When faced with a choice that has several potential risks and benefits:", options: [{ text: "You meticulously analyze the potential downsides and proceed with a well-thought-out plan to mitigate risks.", score: 1 }, { text: "You focus more on the potential upsides and are less deterred by risks, often trusting your ability to handle unforeseen issues.", score: 0 }], type: 'question' },

    // Extraversion - Warmth (4 unique)
    { id: "E_War1", factor: "Extraversion", facet: "Warmth", prompt: "When interacting with service staff (e.g., waiters, cashiers):", options: [{ text: "You are often genuinely friendly, smile, and engage in brief, pleasant conversation, showing interest in them as a person.", score: 1 }, { text: "You are polite and efficient but generally keep interactions brief and focused on the transaction.", score: 0 }], type: 'question' },
    { id: "E_War2", factor: "Extraversion", facet: "Warmth", prompt: "In expressing affection and appreciation to your loved ones:", options: [{ text: "You are comfortable and frequent with physical affection (like hugs) and openly verbalizing your positive feelings for them.", score: 1 }, { text: "You tend to show your affection and care more through supportive actions and quiet dependability rather than overt displays.", score: 0 }], type: 'question' },
    { id: "E_War3", factor: "Extraversion", facet: "Warmth", prompt: "When a new person joins your social circle or workplace, your typical approach is to:", options: [{ text: "Make an active and conscious effort to make them feel included, welcome, and comfortable.", score: 1 }, { text: "Be friendly and polite if approached, but you don't typically go out of your way to proactively integrate them into the group.", score: 0 }], type: 'question' },
    { id: "E_War4", factor: "Extraversion", facet: "Warmth", prompt: "People who know you well would most likely describe you as someone who is:", options: [{ text: "Heartfelt, openly caring, and easy to connect with on a warm, emotional level.", score: 1 }, { text: "More reserved or formal in expressing emotions, though perhaps seen as kind and considerate in your actions.", score: 0 }], type: 'question' },
    
    // Extraversion - Gregariousness
    { id: "E_Gre1", factor: "Extraversion", facet: "Gregariousness", prompt: "At the end of a busy work week, your ideal way to recharge is:", options: [{ text: "Attending a large party, bustling social event, or a lively group activity.", score: 1 }, { text: "Spending a quiet evening at home, perhaps reading, watching a movie, or with one or two close companions.", score: 0 }], type: 'question' },
    { id: "E_Gre2", factor: "Extraversion", facet: "Gregariousness", prompt: "When working on a collaborative project, you prefer an environment that is:", options: [{ text: "Highly interactive, with many people contributing and frequent group discussions.", score: 1 }, { text: "More focused, allowing for independent work or collaboration within a very small, tight-knit team.", score: 0 }], type: 'question' },
    { id: "E_Gre3", factor: "Extraversion", facet: "Gregariousness", prompt: "The thought of spending an entire weekend alone, without social plans, makes you feel:", options: [{ text: "Restless, bored, or a bit down; you'd actively try to find company.", score: 1 }, { text: "Peaceful, relaxed, and looking forward to the opportunity for solitude and personal pursuits.", score: 0 }], type: 'question' },
    { id: "E_Gre4", factor: "Extraversion", facet: "Gregariousness", prompt: "You find that being in large crowds or very busy public spaces is generally:", options: [{ text: "Energizing and stimulating; you enjoy the buzz of many people around.", score: 1 }, { text: "Draining or overwhelming; you prefer quieter, less crowded environments.", score: 0 }], type: 'question' },

    // Extraversion - Assertiveness
    { id: "E_Ass1", factor: "Extraversion", facet: "Assertiveness", prompt: "In a group discussion where you hold a strong, potentially controversial opinion:", options: [{ text: "You are comfortable and likely to voice your perspective clearly and confidently, even if it differs from the majority.", score: 1 }, { text: "You tend to keep your opinion to yourself unless directly asked, especially if you anticipate disagreement or conflict.", score: 0 }], type: 'question' },
    { id: "E_Ass2", factor: "Extraversion", facet: "Assertiveness", prompt: "When a group needs someone to take initiative or a leadership role for a task:", options: [{ text: "You are often inclined to step up, offer direction, and guide the group's efforts.", score: 1 }, { text: "You generally prefer for someone else to take the lead, feeling more comfortable in a supportive role.", score: 0 }], type: 'question' },
    { id: "E_Ass3", factor: "Extraversion", facet: "Assertiveness", prompt: "If you feel your rights are being infringed upon or you're being treated unfairly:", options: [{ text: "You are quick to speak out and stand up for yourself directly and firmly.", score: 1 }, { text: "You might feel upset but are hesitant to create a confrontation, perhaps hoping the situation resolves itself.", score: 0 }], type: 'question' },
    { id: "E_Ass4", factor: "Extraversion", facet: "Assertiveness", prompt: "You see yourself as someone who can effectively:", options: [{ text: "Influence others' opinions and persuade them to your point of view in discussions.", score: 1 }, { text: "Contribute ideas but are less focused on or comfortable with actively trying to sway others.", score: 0 }], type: 'question' },

    // Extraversion - Activity
    { id: "E_Act1", factor: "Extraversion", facet: "Activity", prompt: "Your ideal pace for a typical weekend generally involves:", options: [{ text: "A schedule packed with various activities, errands, social engagements, and being constantly on the move.", score: 1 }, { text: "A mostly unscheduled and relaxed agenda, with plenty of unstructured time for rest, leisure, and spontaneous choices.", score: 0 }], type: 'question' },
    { id: "E_Act2", factor: "Extraversion", facet: "Activity", prompt: "When it comes to physical exertion or hobbies, you are more drawn to:", options: [{ text: "Vigorous physical activities, fast-paced sports, or hobbies that keep you highly active and engaged.", score: 1 }, { text: "Calm, leisurely activities like reading, gentle walks, quiet crafts, or watching movies.", score: 0 }], type: 'question' },
    { id: "E_Act3", factor: "Extraversion", facet: "Activity", prompt: "You feel most alive and productive when your day is:", options: [{ text: "Full of energy, with many tasks to accomplish and a sense of dynamic movement.", score: 1 }, { text: "Calm and unhurried, allowing for deep focus on one or two things at a comfortable pace.", score: 0 }], type: 'question' },
    { id: "E_Act4", factor: "Extraversion", facet: "Activity", prompt: "The idea of a day with nothing specific planned and no obligations makes you feel:", options: [{ text: "A bit restless or bored; you'd likely look for something active to do.", score: 1 }, { text: "Pleased and looking forward to the opportunity to relax and recharge at your own pace.", score: 0 }], type: 'question' },

    // Extraversion - ExcitementSeeking
    { id: "E_Exc1", factor: "Extraversion", facet: "ExcitementSeeking", prompt: "For a truly memorable and thrilling experience, you would prefer:", options: [{ text: "Activities with a degree of risk and high adrenaline, like extreme sports or exploring dangerous terrains.", score: 1 }, { text: "Engaging with thrilling content through safer means, like watching an intense action movie or reading a suspenseful adventure novel.", score: 0 }], type: 'question' },
    { id: "E_Exc2", factor: "Extraversion", facet: "ExcitementSeeking", prompt: "When choosing an environment for leisure or entertainment, you are more drawn to:", options: [{ text: "A bustling city center, a lively festival, or a crowded concert with lots of noise, lights, and activity.", score: 1 }, { text: "A quiet natural setting, a peaceful library, or a calm, predictable environment with minimal external stimulation.", score: 0 }], type: 'question' },
    { id: "E_Exc3", factor: "Extraversion", facet: "ExcitementSeeking", prompt: "The thought of sudden, unexpected changes or a bit of chaos in your plans is:", options: [{ text: "Often exciting and invigorating, adding an element of adventure.", score: 1 }, { text: "Generally unsettling or stressful; you prefer predictability and order.", score: 0 }], type: 'question' },
    { id: "E_Exc4", factor: "Extraversion", facet: "ExcitementSeeking", prompt: "You find that you actively seek out situations that offer:", options: [{ text: "Novelty, intensity, and a high level of sensory stimulation.", score: 1 }, { text: "Comfort, familiarity, and a low level of sensory stimulation.", score: 0 }], type: 'question' },

    // Extraversion - PositiveEmotions
    { id: "E_Pos1", factor: "Extraversion", facet: "PositiveEmotions", prompt: "Reflecting on your general day-to-day mood, you would describe yourself as:", options: [{ text: "Generally cheerful, optimistic, and often experiencing feelings of joy or enthusiasm.", score: 1 }, { text: "More often serious, calm, or perhaps prone to periods of lower spirits and less overt displays of happiness.", score: 0 }], type: 'question' },
    { id: "E_Pos2", factor: "Extraversion", facet: "PositiveEmotions", prompt: "When good things happen to you or those around you, your typical reaction is to:", options: [{ text: "Feel a strong surge of excitement and express your happiness, laughter, and positive feelings openly and readily.", score: 1 }, { text: "Feel a quiet sense of satisfaction or contentment, perhaps with less outward display or intense emotional expression.", score: 0 }], type: 'question' },
    { id: "E_Pos3", factor: "Extraversion", facet: "PositiveEmotions", prompt: "You find it easy and natural to:", options: [{ text: "Laugh often, find humor in situations, and maintain a generally upbeat perspective on life.", score: 1 }, { text: "Be more reserved in expressing amusement, and perhaps have a more serious or contemplative outlook.", score: 0 }], type: 'question' },
    { id: "E_Pos4", factor: "Extraversion", facet: "PositiveEmotions", prompt: "When looking towards the future, your general expectation is one of:", options: [{ text: "Hopefulness and anticipation of positive experiences and outcomes.", score: 1 }, { text: "Realism or caution, with less of a focus on actively anticipating strong positive emotions.", score: 0 }], type: 'question' },

    // Agreeableness - Trust (4 unique)
    { id: "A_Tru1", factor: "Agreeableness", facet: "Trust", prompt: "When someone shares a personal vulnerability with you for the first time:", options: [{ text: "You tend to assume they are being genuine and appreciate their openness, feeling a sense of connection.", score: 1 }, { text: "You might feel a bit reserved, wondering about their reasons for sharing or if there's an ulterior motive you haven't perceived.", score: 0 }], type: 'question' },
    { id: "A_Tru2", factor: "Agreeableness", facet: "Trust", prompt: "If you lend a small amount of money or a commonly used personal item to a casual acquaintance:", options: [{ text: "You generally expect to get it back in good time and condition without much worry or follow-up.", score: 1 }, { text: "You are somewhat prepared for the possibility of not getting it back, or it being returned late/damaged, and might feel hesitant.", score: 0 }], type: 'question' },
    { id: "A_Tru3", factor: "Agreeableness", facet: "Trust", prompt: "When you hear positive news or praise about someone you don't know very well:", options: [{ text: "Your initial reaction is typically to be happy for them and believe the good news at face value.", score: 1 }, { text: "You might feel a bit skeptical, wonder if the praise is exaggerated, or consider if there's another side to the story.", score: 0 }], type: 'question' },
    { id: "A_Tru4", factor: "Agreeableness", facet: "Trust", prompt: "Your general outlook on human nature, when it comes to honesty and intentions, is that:", options: [{ text: "Most people are fundamentally decent, mean well, and can generally be relied upon to be truthful.", score: 1 }, { text: "It's wise to be cautious and discerning, as many people are primarily self-serving and may not always be straightforward.", score: 0 }], type: 'question' },

    // Agreeableness - Straightforwardness
    { id: "A_Str1", factor: "Agreeableness", facet: "Straightforwardness", prompt: "If you believe a friend is making a significant mistake that could harm them:", options: [{ text: "You are more likely to tell them your concerns directly and frankly, even if it risks upsetting them or causing temporary discomfort.", score: 1 }, { text: "You are more likely to hint at your concerns very subtly, or perhaps avoid saying anything directly to prevent conflict or hurt feelings.", score: 0 }], type: 'question' },
    { id: "A_Str2", factor: "Agreeableness", facet: "Straightforwardness", prompt: "In negotiations or when trying to persuade someone to your point of view:", options: [{ text: "You prefer to be completely transparent about your goals, reasoning, and any relevant information, valuing honesty above all.", score: 1 }, { text: "You might be more strategic with the information you share, perhaps emphasizing certain points or omitting others to strengthen your position.", score: 0 }], type: 'question' },
    { id: "A_Str3", factor: "Agreeableness", facet: "Straightforwardness", prompt: "When asked for your honest opinion on something sensitive (e.g., a friend's new haircut you don't like):", options: [{ text: "You try to find a kind but truthful way to express your genuine thoughts, even if it's not entirely positive.", score: 1 }, { text: "You would likely offer a polite, non-committal, or slightly embellished positive response to avoid causing any offense.", score: 0 }], type: 'question' },
    { id: "A_Str4", factor: "Agreeableness", facet: "Straightforwardness", prompt: "You believe that in most interpersonal interactions, it's best to be:", options: [{ text: "Candid and sincere, even if it means occasionally being blunt or causing minor awkwardness.", score: 1 }, { text: "Diplomatic and tactful, sometimes choosing words carefully to preserve harmony, even if it means not being fully direct.", score: 0 }], type: 'question' },

    // Agreeableness - Altruism
    { id: "A_Alt1", factor: "Agreeableness", facet: "Altruism", prompt: "Given the choice for how to spend a significant portion of your free Saturday:", options: [{ text: "You would find deep satisfaction and purpose in volunteering your time and effort to help a local charity or a community event.", score: 1 }, { text: "You would prefer to dedicate the day entirely to your own personal interests, hobbies, relaxation, or catching up on personal tasks.", score: 0 }], type: 'question' },
    { id: "A_Alt2", factor: "Agreeableness", facet: "Altruism", prompt: "When you see someone struggling with a task (e.g., carrying heavy bags, trying to fix something):", options: [{ text: "You almost instinctively offer to help, even if it means a slight inconvenience or interruption to your own plans.", score: 1 }, { text: "You might feel a brief moment of sympathy but generally assume they will manage or that someone else, perhaps better equipped, will offer assistance.", score: 0 }], type: 'question' },
    { id: "A_Alt3", factor: "Agreeableness", facet: "Altruism", prompt: "You find yourself frequently thinking about:", options: [{ text: "The well-being of others (friends, family, or even broader societal issues) and how you might contribute positively.", score: 1 }, { text: "Your own personal goals, ambitions, and the steps needed to achieve them, with less focus on broader altruistic concerns.", score: 0 }], type: 'question' },
    { id: "A_Alt4", factor: "Agreeableness", facet: "Altruism", prompt: "Making sacrifices of your own time or resources for the benefit of others is something you view as:", options: [{ text: "A natural and rewarding part of being a good person and community member.", score: 1 }, { text: "Important in specific circumstances, but something to be balanced carefully against your own needs and priorities.", score: 0 }], type: 'question' },

    // Agreeableness - Compliance
    { id: "A_Com1", factor: "Agreeableness", facet: "Compliance", prompt: "In a minor disagreement with a colleague or friend over a trivial matter:", options: [{ text: "You are often willing to concede your point or compromise easily simply to maintain a harmonious relationship and avoid further argument.", score: 1 }, { text: "You tend to stand your ground on your viewpoint, even on small things, believing it's important to be clear about your position or that you are correct.", score: 0 }], type: 'question' },
    { id: "A_Com2", factor: "Agreeableness", facet: "Compliance", prompt: "If someone cuts you off in traffic or behaves rudely in a public space:", options: [{ text: "You typically try to let it go quickly, avoid escalating the situation, and not let it bother you significantly.", score: 1 }, { text: "You often feel a strong urge to honk, gesture, or verbally express your annoyance and displeasure at their behavior.", score: 0 }], type: 'question' },
    { id: "A_Com3", factor: "Agreeableness", facet: "Compliance", prompt: "When working in a group where there are strong, conflicting opinions on how to proceed:", options: [{ text: "You are more inclined to go along with the group consensus or a dominant opinion to ensure smooth progress, even if it's not your preferred approach.", score: 1 }, { text: "You are more likely to persistently argue for your own ideas if you believe they are superior, even if it creates tension or slows things down.", score: 0 }], type: 'question' },
    { id: "A_Com4", factor: "Agreeableness", facet: "Compliance", prompt: "You find it generally easier to:", options: [{ text: "Forgive others for their mistakes or slights and avoid holding grudges.", score: 1 }, { text: "Remember injustices or unfair treatment for a long time and find it difficult to fully let go of resentment.", score: 0 }], type: 'question' },

    // Agreeableness - Modesty
    { id: "A_Mod1", factor: "Agreeableness", facet: "Modesty", prompt: "When your significant contributions to a successful team project are publicly highlighted:", options: [{ text: "You tend to feel slightly uncomfortable with the spotlight and might quickly emphasize the efforts of the entire team or other contributing factors.", score: 1 }, { text: "You feel comfortable, perhaps even pleased, acknowledging your specific role and accepting direct recognition for your successful work.", score: 0 }], type: 'question' },
    { id: "A_Mod2", factor: "Agreeableness", facet: "Modesty", prompt: "In conversations where your achievements or special skills are relevant:", options: [{ text: "You are more likely to downplay them or only mention them if directly asked and absolutely necessary.", score: 1 }, { text: "You are comfortable sharing your accomplishments or expertise when appropriate, seeing it as providing useful information.", score: 0 }], type: 'question' },
    { id: "A_Mod3", factor: "Agreeableness", facet: "Modesty", prompt: "You believe that boasting or frequently talking about one's own successes is generally:", options: [{ text: "Unbecoming and something to be avoided.", score: 1 }, { text: "Acceptable if done in moderation and factually, as a way of sharing positive news or establishing credibility.", score: 0 }], type: 'question' },
    { id: "A_Mod4", factor: "Agreeableness", facet: "Modesty", prompt: "Compared to others, you see yourself as:", options: [{ text: "No more special or deserving than anyone else, regardless of your accomplishments.", score: 1 }, { text: "Someone who has unique talents and achievements that set you apart and are worth noting.", score: 0 }], type: 'question' },

    // Agreeableness - TenderMindedness
    { id: "A_Ten1", factor: "Agreeableness", facet: "TenderMindedness", prompt: "When witnessing someone else's emotional pain or hardship (e.g., in a movie, news story, or real life):", options: [{ text: "You often feel a strong sense of empathy, your emotions mirroring theirs, and a deep urge to offer comfort and support.", score: 1 }, { text: "You feel concerned and sympathetic, but your primary focus is often on thinking about practical solutions or maintaining a degree of emotional composure.", score: 0 }], type: 'question' },
    { id: "A_Ten2", factor: "Agreeableness", facet: "TenderMindedness", prompt: "When making decisions that will impact other people's feelings and well-being:", options: [{ text: "You give very significant weight to the potential emotional consequences for everyone involved, sometimes prioritizing this over pure logic or efficiency.", score: 1 }, { text: "You focus primarily on the logical, practical, and fair outcomes, believing that rational decisions ultimately serve everyone best, even if some feelings are temporarily hurt.", score: 0 }], type: 'question' },
    { id: "A_Ten3", factor: "Agreeableness", facet: "TenderMindedness", prompt: "Stories or situations involving vulnerability, kindness, or injustice tend to:", options: [{ text: "Move you quite easily, perhaps even to tears or a strong emotional response.", score: 1 }, { text: "Evoke a thoughtful or concerned response, but you generally maintain a more detached or analytical emotional perspective.", score: 0 }], type: 'question' },
    { id: "A_Ten4", factor: "Agreeableness", facet: "TenderMindedness", prompt: "You are more naturally inclined to be:", options: [{ text: "Soft-hearted, sympathetic, and easily touched by appeals to your compassion.", score: 1 }, { text: "More tough-minded, pragmatic, and less swayed by sentimentality or emotional appeals.", score: 0 }], type: 'question' },

            // Neuroticism - Anxiety (4 unique)
            { id: "N_Anx1", factor: "Neuroticism", facet: "Anxiety", prompt: "Before an important meeting, presentation, or social event:", options: [{ text: "You often experience significant anticipatory worry, butterflies, or a general sense of dread about potential negative outcomes.", score: 1 }, { text: "You typically feel focused and composed, perhaps with a normal level of anticipation or excitement, but not excessive worry.", score: 0 }], type: 'question' },
            { id: "N_Anx2", factor: "Neuroticism", facet: "Anxiety", prompt: "When waiting for significant news that could be either good or bad (e.g., exam results, a medical test outcome, a job offer):", options: [{ text: "You find it very difficult to relax, and your mind often races, dwelling on worst-case scenarios and feeling a knot in your stomach.", score: 1 }, { text: "You can generally distract yourself, remain patient, and manage your thoughts without letting excessive worry take over.", score: 0 }], type: 'question' },
            { id: "N_Anx3", factor: "Neuroticism", facet: "Anxiety", prompt: "In unfamiliar social settings where you don't know many people and need to make a good impression:", options: [{ text: "You frequently feel tense, self-conscious, and preoccupied with how others are perceiving you, sometimes replaying interactions in your mind.", score: 1 }, { text: "You generally feel curious and relatively at ease, able to engage naturally and focus on the interactions themselves rather than on self-monitoring.", score: 0 }], type: 'question' },
            { id: "N_Anx4", factor: "Neuroticism", facet: "Anxiety", prompt: "You would describe your general baseline level of day-to-day worry and nervousness as:", options: [{ text: "Often present and noticeable, even about relatively small things or potential future problems that may not materialize.", score: 1 }, { text: "Generally low and manageable; you don't tend to worry or feel tense unless there's a clear, specific, and significant reason to do so.", score: 0 }], type: 'question' },
            
            // Neuroticism - AngryHostility
            { id: "N_Ang1", factor: "Neuroticism", facet: "AngryHostility", prompt: "When someone criticizes you unfairly or treats you disrespectfully:", options: [{ text: "You often feel a quick surge of anger or resentment and may have a strong urge to retaliate verbally or argue heatedly.", score: 1 }, { text: "You might feel annoyed or hurt, but you are usually able to address the situation calmly or let it go without much lingering bitterness.", score: 0 }], type: 'question' },
            { id: "N_Ang2", factor: "Neuroticism", facet: "AngryHostility", prompt: "When things don't go your way, you encounter minor frustrations, or deal with incompetence from others:", options: [{ text: "You find yourself easily irritated, frustrated, and may be quick to express your annoyance or impatience.", score: 1 }, { text: "You generally take such things in stride with minimal frustration, perhaps seeing them as unavoidable parts of life.", score: 0 }], type: 'question' },
            { id: "N_Ang3", factor: "Neuroticism", facet: "AngryHostility", prompt: "You find that you sometimes hold onto feelings of anger or resentment towards people who you feel have wronged you:", options: [{ text: "Yes, it can be difficult for you to forgive and forget, and these feelings might simmer for a while.", score: 1 }, { text: "No, you tend to process such feelings relatively quickly and are usually able to move on without holding grudges.", score: 0 }], type: 'question' },
            { id: "N_Ang4", factor: "Neuroticism", facet: "AngryHostility", prompt: "Your temper could be described as:", options: [{ text: "Sometimes quick to flare up, especially when provoked or under stress.", score: 1 }, { text: "Generally even and slow to anger; it takes a lot to make you truly lose your composure.", score: 0 }], type: 'question' },

            // Neuroticism - Depression
            { id: "N_Dep1", factor: "Neuroticism", facet: "Depression", prompt: "After experiencing a significant disappointment or personal failure:", options: [{ text: "You tend to feel quite down, self-critical, or pessimistic about your future prospects for a noticeable period.", score: 1 }, { text: "You feel disappointed initially but are usually able to recover your spirits, learn from the experience, and focus on moving forward relatively quickly.", score: 0 }], type: 'question' },
            { id: "N_Dep2", factor: "Neuroticism", facet: "Depression", prompt: "Reflecting on your general mood over the past few months, you would say:", options: [{ text: "You've had more periods than you'd like where you felt sad, discouraged, lacking in energy, or found little pleasure in activities.", score: 1 }, { text: "You've generally felt pretty upbeat, energetic, and able to bounce back from any temporary low moods quickly.", score: 0 }], type: 'question' },
            { id: "N_Dep3", factor: "Neuroticism", facet: "Depression", prompt: "When things are not going well in your life, your outlook tends to become:", options: [{ text: "Quite gloomy, and you might struggle to see how things will improve or find motivation.", score: 1 }, { text: "Concerned but still hopeful, and you actively look for ways to address the problems and improve the situation.", score: 0 }], type: 'question' },
            { id: "N_Dep4", factor: "Neuroticism", facet: "Depression", prompt: "You find it difficult to shake off feelings of sadness or a sense of hopelessness:", options: [{ text: "Yes, these feelings can sometimes linger and affect your daily functioning.", score: 1 }, { text: "No, you are generally resilient and can find ways to lift your spirits or shift your perspective when feeling down.", score: 0 }], type: 'question' },

            // Neuroticism - SelfConsciousness
            { id: "N_Sel1", factor: "Neuroticism", facet: "SelfConsciousness", prompt: "In social situations where you are the center of attention (e.g., giving a presentation, being introduced to a large group):", options: [{ text: "You often feel noticeably uncomfortable, awkward, and highly worried about what others are thinking of you or if you'll make a mistake.", score: 1 }, { text: "You generally feel reasonably comfortable, perhaps a little nervous, but able to focus on the situation without excessive self-monitoring or fear of judgment.", score: 0 }], type: 'question' },
            { id: "N_Sel2", factor: "Neuroticism", facet: "SelfConsciousness", prompt: "If you accidentally did something mildly embarrassing in public (e.g., tripping, spilling a drink on yourself, mispronouncing a word):", options: [{ text: "You would likely feel mortified, blush easily, and dwell on the incident for a long time afterward.", score: 1 }, { text: "You might feel a brief moment of awkwardness but would likely laugh it off, recover quickly, and not think much about it later.", score: 0 }], type: 'question' },
            { id: "N_Sel3", factor: "Neuroticism", facet: "SelfConsciousness", prompt: "When meeting new people, especially those you want to impress:", options: [{ text: "You are often very aware of yourself, carefully choosing your words and actions, and worrying about their perception of you.", score: 1 }, { text: "You try to be yourself, engage genuinely, and are less preoccupied with constantly monitoring their reactions to you.", score: 0 }], type: 'question' },
            { id: "N_Sel4", factor: "Neuroticism", facet: "SelfConsciousness", prompt: "You are sensitive to criticism or any hint of disapproval from others:", options: [{ text: "Yes, even mild criticism can make you feel quite inadequate or self-critical.", score: 1 }, { text: "No, while you consider feedback, you are not overly sensitive to criticism and can usually take it constructively without feeling personally attacked.", score: 0 }], type: 'question' },

            // Neuroticism - Impulsiveness (distress-related)
            { id: "N_Imp1", factor: "Neuroticism", facet: "Impulsiveness", prompt: "When feeling particularly stressed, anxious, or upset, you find it:", options: [{ text: "Quite difficult to resist urges for immediate gratification, like comfort eating, impulse shopping, or excessive media consumption.", score: 1 }, { text: "Relatively easy to stick to your healthy coping mechanisms and long-term goals, even when distressed.", score: 0 }], type: 'question' },
            { id: "N_Imp2", factor: "Neuroticism", facet: "Impulsiveness", prompt: "If you're trying to stick to a challenging commitment (e.g., a strict diet, a tight budget, quitting a habit), strong negative emotions make it:", options: [{ text: "Very difficult to maintain self-control, and you often give in to temptation as a way to feel better temporarily.", score: 1 }, { text: "Harder, but you generally have good control over your impulses and can stay on track despite emotional discomfort.", score: 0 }], type: 'question' },
            { id: "N_Imp3", factor: "Neuroticism", facet: "Impulsiveness", prompt: "You have sometimes acted rashly or said things you later regretted when:", options: [{ text: "You were feeling overwhelmed by negative emotions like anger, frustration, or sadness.", score: 1 }, { text: "Even when emotional, you can usually pause and consider the consequences before acting or speaking.", score: 0 }], type: 'question' },
            { id: "N_Imp4", factor: "Neuroticism", facet: "Impulsiveness", prompt: "Your ability to delay gratification and resist immediate pleasures for the sake of future benefits is:", options: [{ text: "Often compromised when you are experiencing emotional distress or strong cravings.", score: 1 }, { text: "Generally strong, and you can make disciplined choices even when faced with temptation or negative feelings.", score: 0 }], type: 'question' },

            // Neuroticism - Vulnerability
            { id: "N_Vul1", factor: "Neuroticism", facet: "Vulnerability", prompt: "When faced with a highly stressful situation, unexpected crisis, or significant pressure:", options: [{ text: "You often feel overwhelmed, panicky, dependent on others, and unsure of your ability to cope effectively on your own.", score: 1 }, { text: "You generally feel challenged but also confident in your ability to manage the situation, stay composed, and find solutions.", score: 0 }], type: 'question' },
            { id: "N_Vul2", factor: "Neuroticism", facet: "Vulnerability", prompt: "During periods of intense or prolonged life stress (e.g., job loss, relationship difficulties, health concerns):", options: [{ text: "You feel like you're barely holding it together, easily become disorganized, and struggle to function normally.", score: 1 }, { text: "You feel like you can rise to the occasion, maintain your responsibilities, and manage the pressure effectively, even if it's tough.", score: 0 }], type: 'question' },
            { id: "N_Vul3", factor: "Neuroticism", facet: "Vulnerability", prompt: "When encountering unexpected difficulties or setbacks in your plans:", options: [{ text: "You can become easily discouraged, feel helpless, or struggle to see a way forward.", score: 1 }, { text: "You view them as obstacles to overcome, adapt your plans, and maintain a belief in your ability to eventually succeed.", score: 0 }], type: 'question' },
            { id: "N_Vul4", factor: "Neuroticism", facet: "Vulnerability", prompt: "Your general sense of being able to handle life's inevitable challenges and stressors is:", options: [{ text: "Often shaky; you sometimes feel ill-equipped to deal with significant adversity.", score: 1 }, { text: "Quite robust; you generally trust your resilience and resourcefulness to see you through tough times.", score: 0 }], type: 'question' },
        ];
        // --- END CONFIGURATION & DATA ---


        // --- STATE VARIABLES ---
        let currentSlideIndex = 0; 
        let userAnswers = new Array(questions.length).fill(null); 
        let questionDisplayOrders = new Array(questions.length).fill(false); 
        let factorScores = {}; 
        let facetScores = {}; 
        let mainFactorChart = null; 
        let currentFacetChart = null;
        let currentlyDisplayedFacetFactor = null;
        const allContentSlides = [...introSlidesContent, ...questions]; 
        // --- END STATE VARIABLES ---

        // --- DOM ELEMENTS ---
        const introSequenceScreen = document.getElementById('introSequenceScreen');
        const introSlideDisplayArea = document.getElementById('introSlideDisplayArea');
        const introNavigation = document.getElementById('introNavigation');
        const introPrevButton = document.getElementById('introPrevButton');
        const introNextButton = document.getElementById('introNextButton');
        
        const quizScreen = document.getElementById('quizScreen');
        const resultsScreen = document.getElementById('resultsScreen');
        
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        const questionPromptText = document.getElementById('questionPromptText');
        const optionsParentContainer = document.getElementById('optionsParentContainer'); 
        const prevQuestionButton = document.getElementById('prevQuestionButton');
        const skipQuestionButton = document.getElementById('skipQuestionButton');

        const facetBreakdownContainer = document.getElementById('facetBreakdownContainer');
        const facetChartTitle = document.getElementById('facetChartTitle');
        const closeFacetViewButton = document.getElementById('closeFacetViewButton');


        const resultsHeadline = document.getElementById('resultsHeadline');
        const scoresTableBody = document.getElementById('scoresTableBody');
        const detailedInsightsContainer = document.getElementById('detailedInsightsContainer');
        const traitInteractionsText = document.getElementById('traitInteractionsText');
        const facetSpotlightContainer = document.getElementById('facetSpotlightContainer');
        const exportPdfButton = document.getElementById('exportPdfButton');

        const pdfExportContainer = document.getElementById('pdfExportContainer');
        const pdfTitle = document.getElementById('pdfTitle');
        const pdfDate = document.getElementById('pdfDate');
        const pdfChartImage = document.getElementById('pdfChartImage');
        const pdfScoresTableBody = pdfExportContainer.querySelector('#pdfScoresTable tbody');
        const pdfInsightsContainer = document.getElementById('pdfInsightsContainer');
        const pdfFacetSpotlightContainer = document.createElement('div'); 
        pdfFacetSpotlightContainer.id = "pdfFacetSpotlightContainer";
        const pdfTraitInteractionsContainer = document.createElement('div');
        pdfTraitInteractionsContainer.id = "pdfTraitInteractionsContainer";
        const customTooltip = document.getElementById('customTooltip');


        // --- END DOM ELEMENTS ---

        // --- INITIALIZATION ---
        function initializeApp() { 
            currentSlideIndex = 0;
            userAnswers = new Array(questions.length).fill(null); 
            questionDisplayOrders = new Array(questions.length).fill(false);
            factorScores = {};
            facetScores = {}; 
            Object.keys(FACTORS).forEach(factorName => {
                factorScores[factorName] = 0;
                facetScores[factorName] = {};
                FACTORS[factorName].facets.forEach(facetName => {
                    facetScores[factorName][facetName] = 0;
                });
            });
            introSequenceScreen.classList.remove('hidden'); 
            quizScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            facetBreakdownContainer.classList.remove('visible');
            currentlyDisplayedFacetFactor = null;
            if(currentFacetChart) currentFacetChart.destroy();
            document.removeEventListener('keydown', handleGlobalKeyPress); 
            document.addEventListener('keydown', handleGlobalKeyPress); 
            displayCurrentSlide();
            checkOrientation(); 
        }
        // --- END INITIALIZATION ---
        
        // --- ORIENTATION CHECK ---
        function isLandscape() {
            if (window.matchMedia("(orientation: landscape)").matches && (screen.availHeight < 700)) return true;
            return window.innerWidth > window.innerHeight && window.innerWidth > 768; 
        }

        function checkOrientation() {
            const orientationSlide = introSlidesContent.find(slide => slide.id === 'orientationAdvice');
            if (orientationSlide && currentSlideIndex === introSlidesContent.indexOf(orientationSlide)) {
                if (isLandscape()) {
                    navigateIntro(1); 
                }
            }
        }
        window.addEventListener('orientationchange', checkOrientation);
        window.addEventListener('resize', checkOrientation); 
        // --- END ORIENTATION CHECK ---


        // --- SLIDE & QUIZ LOGIC ---
        function displayCurrentSlide() {
            const slideData = allContentSlides[currentSlideIndex];
            const displayArea = slideData.type === 'intro' ? introSlideDisplayArea : document.getElementById('questionDisplayArea');
            
            displayArea.classList.remove('fade-in');
            displayArea.classList.add('fade-out');

            setTimeout(() => {
                if (slideData.type === 'intro') {
                    introSequenceScreen.classList.remove('hidden');
                    quizScreen.classList.add('hidden');
                    introSlideDisplayArea.innerHTML = `
                        <h1 class="text-3xl md:text-4xl font-bold text-indigo-400 mb-6 text-center">${slideData.title}</h1>
                        <div class="intro-slide-content">${slideData.content}</div>
                    `;
                    updateIntroNavigation();
                } else { 
                    introSequenceScreen.classList.add('hidden');
                    quizScreen.classList.remove('hidden');
                    displayQuestionContent(slideData); 
                }
                displayArea.classList.remove('fade-out');
                displayArea.classList.add('fade-in');
            }, 300);
        }

        function displayQuestionContent(questionData) {
            questionPromptText.textContent = questionData.prompt; 
            optionsParentContainer.innerHTML = ''; 
            
            const questionIndexInQuiz = currentSlideIndex - introSlidesContent.length;

            if (userAnswers[questionIndexInQuiz] === null || userAnswers[questionIndexInQuiz] === 'skipped') {
                 questionDisplayOrders[questionIndexInQuiz] = Math.random() < 0.5;
            }
            const isReversed = questionDisplayOrders[questionIndexInQuiz];
            const optionLeftData = isReversed ? questionData.options[1] : questionData.options[0];
            const optionRightData = isReversed ? questionData.options[0] : questionData.options[1];
            const optionsToDisplay = [optionLeftData, optionRightData];

            optionsToDisplay.forEach((optionData, displayIndex) => { 
                const button = document.createElement('button');
                button.classList.add('option-button-dark', 'm-1', 'md:m-2', 'text-sm', 'md:text-base'); 
                const arrow = displayIndex === 0 ? '(←)' : '(→)';
                button.innerHTML = `<span class="font-bold mr-1">${arrow}</span> ${optionData.text}`;
                button.onclick = () => handleAnswerSelection(displayIndex); 
                
                const storedAnswer = userAnswers[questionIndexInQuiz];
                if (storedAnswer !== null && storedAnswer !== 'skipped') {
                    if (storedAnswer === displayIndex) {
                        button.classList.add('selected');
                    }
                }
                optionsParentContainer.appendChild(button);
            });
            updateQuizProgress();
            updateQuizNavigationButtons();
        }
        
        function handleGlobalKeyPress(event) {
            if (!introSequenceScreen.classList.contains('hidden')) { 
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    navigateIntro(-1);
                } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    navigateIntro(1);
                }
            } else if (!quizScreen.classList.contains('hidden')) { 
                 if (optionsParentContainer.children.length > 0) { 
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                        event.preventDefault();
                        handleAnswerSelection(0); 
                    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                        event.preventDefault();
                        handleAnswerSelection(1); 
                    }
                }
            }
        }

        function navigateIntro(direction) {
            const newSlideIndex = currentSlideIndex + direction;
            if (newSlideIndex >= 0 && newSlideIndex < introSlidesContent.length) { 
                currentSlideIndex = newSlideIndex;
                displayCurrentSlide();
            } 
        }
        
        function updateIntroNavigation() {
            introPrevButton.disabled = currentSlideIndex === 0;
            introPrevButton.classList.toggle('opacity-50', introPrevButton.disabled);
            introPrevButton.classList.toggle('cursor-not-allowed', introPrevButton.disabled);

            if (currentSlideIndex === introSlidesContent.length - 1) {
                introNextButton.textContent = "Start Quiz"; 
                introNextButton.onclick = () => { 
                    currentSlideIndex++; 
                    initializeQuizStateForNewRun(); 
                    displayCurrentSlide();
                };
            } else {
                introNextButton.textContent = "Next (→ / ↓)";
                introNextButton.onclick = () => navigateIntro(1); 
            }
        }


        function handleAnswerSelection(physicalButtonIndex) { 
            const questionIndexInQuiz = currentSlideIndex - introSlidesContent.length;
            userAnswers[questionIndexInQuiz] = physicalButtonIndex;
            
            const buttons = optionsParentContainer.querySelectorAll('.option-button-dark');
            buttons.forEach((btn, idx) => {
                btn.classList.toggle('selected', idx === physicalButtonIndex);
            });
            
            setTimeout(() => {
                processQuizAnswerAndAdvance();
            }, 250); 
        }

        function handleSkip() {
            const questionIndexInQuiz = currentSlideIndex - introSlidesContent.length;
            userAnswers[questionIndexInQuiz] = 'skipped';
            setTimeout(() => {
                processQuizAnswerAndAdvance();
            }, 250);
        }
        
        function processQuizAnswerAndAdvance() {
            const questionDisplayArea = document.getElementById('questionDisplayArea');
            questionDisplayArea.classList.remove('fade-in');
            questionDisplayArea.classList.add('fade-out');

            setTimeout(() => {
                currentSlideIndex++;
                if (currentSlideIndex < allContentSlides.length) { 
                    displayCurrentSlide(); 
                } else {
                    // Quiz finished
                    showResults();
                }
            }, 300); 
        }
        
        function prevQuizQuestion() {
            if (currentSlideIndex > introSlidesContent.length) { 
                currentSlideIndex--;
                displayCurrentSlide(); 
            }
        }

        function updateQuizProgress() {
            const questionNumber = currentSlideIndex - introSlidesContent.length + 1;
            progressBar.style.width = `${(questionNumber / questions.length) * 100}%`;
            progressText.textContent = `Question ${questionNumber} of ${questions.length}`;
        }
        
        function updateQuizNavigationButtons() {
            prevQuestionButton.disabled = (currentSlideIndex - introSlidesContent.length) === 0;
            prevQuestionButton.classList.toggle('opacity-50', prevQuestionButton.disabled);
            prevQuestionButton.classList.toggle('cursor-not-allowed', prevQuestionButton.disabled);
        }
        
        introPrevButton.onclick = () => navigateIntro(-1);
        introNextButton.onclick = () => navigateIntro(1); 
        
        skipQuestionButton.onclick = handleSkip;
        prevQuestionButton.onclick = prevQuizQuestion;

        closeFacetViewButton.onclick = () => {
            facetBreakdownContainer.classList.remove('visible');
            currentlyDisplayedFacetFactor = null;
        };


        function initializeQuizStateForNewRun() { 
             Object.keys(FACTORS).forEach(factorName => {
                factorScores[factorName] = 0;
                facetScores[factorName] = {};
                FACTORS[factorName].facets.forEach(facetName => {
                    facetScores[factorName][facetName] = 0;
                });
            });
        }
        
        function calculateAllScores() { 
            Object.keys(FACTORS).forEach(factorName => {
                factorScores[factorName] = 0;
                FACTORS[factorName].facets.forEach(facetName => {
                    facetScores[factorName][facetName] = 0;
                });
            });

            for (let i = 0; i < questions.length; i++) { 
                const physicalButtonIndex = userAnswers[i]; 
                if (physicalButtonIndex !== null && physicalButtonIndex !== 'skipped') {
                    const questionData = questions[i];
                    const isReversed = questionDisplayOrders[i];
                    
                    let chosenOriginalOption;
                    if (physicalButtonIndex === 0) { 
                        chosenOriginalOption = isReversed ? questionData.options[1] : questionData.options[0];
                    } else { 
                        chosenOriginalOption = isReversed ? questionData.options[0] : questionData.options[1];
                    }
                    
                    if (chosenOriginalOption.score === 1) {
                        factorScores[questionData.factor]++;
                        facetScores[questionData.factor][questionData.facet]++;
                    }
                }
            }
        }
        // --- END QUIZ LOGIC ---

        // --- RESULTS DISPLAY ---
        function showResults() {
            introSequenceScreen.classList.add('hidden');
            quizScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            window.scrollTo(0, 0); 

            calculateAllScores(); 

            const standardizedScores = {};
            const deviationScores = {};
            const generalLevels = {};
            const profileHighlights = {};
            
            Object.keys(FACTORS).forEach(factorName => {
                let answeredQuestionsForFactor = 0;
                let currentFactorRawScore = 0; 
                
                questions.forEach((q, index) => { 
                    if (q.factor === factorName) {
                        const answer = userAnswers[index]; 
                        if (answer !== null && answer !== 'skipped') {
                            answeredQuestionsForFactor++;
                            const physicalButtonIndex = answer;
                            const isReversed = questionDisplayOrders[index];
                            const actualSelectedOriginalOption = isReversed ? q.options[1 - physicalButtonIndex] : q.options[physicalButtonIndex];
                            if (actualSelectedOriginalOption.score === 1) {
                                currentFactorRawScore++;
                            }
                        }
                    }
                });
                factorScores[factorName] = currentFactorRawScore; 

                if (answeredQuestionsForFactor > 0) {
                    standardizedScores[factorName] = Math.round((currentFactorRawScore / answeredQuestionsForFactor) * 100);
                } else {
                    standardizedScores[factorName] = 50; 
                }
                
                deviationScores[factorName] = standardizedScores[factorName] - 50;
                generalLevels[factorName] = getGeneralLevel(standardizedScores[factorName]);
                profileHighlights[factorName] = getProfileHighlight(factorName, standardizedScores[factorName], facetScores[factorName]); 
            });

            const prominentTraitValue = Math.max(...Object.values(standardizedScores));
            const prominentTraitKey = Object.keys(standardizedScores).find(key => standardizedScores[key] === prominentTraitValue) || Object.keys(FACTORS)[0];
            resultsHeadline.textContent = `Your Profile: A Spotlight on Your ${FACTORS[prominentTraitKey].name}!`;

            renderMainFactorBarChart(standardizedScores); 
            renderScoresTable(standardizedScores, deviationScores, generalLevels, profileHighlights);
            renderDetailedInsights(standardizedScores, generalLevels, profileHighlights);
            renderTraitInteractions(standardizedScores, generalLevels);
            renderFacetSpotlight(facetScores); 
        }

        function getGeneralLevel(score) {
            if (score >= 80) return "Very High";
            if (score >= 65) return "High";
            if (score >= 35) return "Average";
            if (score >= 20) return "Low";
            return "Very Low";
        }
        
        function getProfileHighlight(factorName, standardizedScore, currentFacetScoresForFactor) {
            const level = getGeneralLevel(standardizedScore);
            const highlightsConfig = FACTOR_HIGHLIGHTS[factorName];
            let levelConfig = {};

            if (level === "Very High" || level === "High") levelConfig = highlightsConfig.High;
            else if (level === "Low" || level === "Very Low") levelConfig = highlightsConfig.Low;
            else levelConfig = highlightsConfig.Average;

            if (!levelConfig || Object.keys(currentFacetScoresForFactor).length === 0) return levelConfig.Default || "Balanced Profile";

            const aspectMap = FACET_TO_ASPECT_MAP[factorName];
            let aspectScores = {};
            if (aspectMap) {
                Object.keys(aspectMap).forEach(aspectName => {
                    aspectScores[aspectName] = 0;
                    aspectMap[aspectName].forEach(facet => {
                        aspectScores[aspectName] += (currentFacetScoresForFactor[facet] || 0);
                    });
                });
            }
            
            let sortedAspects = Object.entries(aspectScores).sort(([,a],[,b]) => b-a).map(([name]) => name);
            if (level === "Low" || level === "Very Low") {
                 sortedAspects = Object.entries(aspectScores).sort(([,a],[,b]) => a-b).map(([name]) => name);
            }


            let bestMatchKey = "Default";
            if (sortedAspects.length >= 1) {
                const topAspect = sortedAspects[0];
                const top2AspectsKey = sortedAspects.length >= 2 ? [sortedAspects[0], sortedAspects[1]].sort().join('_') : topAspect; 

                if (levelConfig[top2AspectsKey]) { 
                    bestMatchKey = top2AspectsKey;
                } else if (levelConfig[topAspect]) { 
                    bestMatchKey = topAspect;
                } else if (sortedAspects.length >= 2 && levelConfig[sortedAspects[1]]) { 
                    bestMatchKey = sortedAspects[1];
                }
            }
            return levelConfig[bestMatchKey] || levelConfig.Default || "Notable Tendencies";
        }
        
        function wrapText(text, maxWidth) {
            if (!text) return [""];
            const words = text.split(' ');
            const lines = [];
            if (words.length === 0) return [""];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                if (currentLine.length + words[i].length + 1 < maxWidth) {
                    currentLine += ' ' + words[i];
                } else {
                    lines.push(currentLine);
                    currentLine = words[i];
                }
            }
            lines.push(currentLine);
            return lines;
        }


        function renderMainFactorBarChart(scores) {
            const ctx = document.getElementById('mainFactorBarChart').getContext('2d');
            const factorNames = Object.keys(FACTORS);
            const dataValues = factorNames.map(name => scores[name]);
            const factorColors = factorNames.map(name => FACTORS[name].color);
            Chart.defaults.color = '#9CA3AF'; 
            Chart.defaults.borderColor = '#374151'; 

            if (mainFactorChart) {
                mainFactorChart.destroy(); 
            }

            mainFactorChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: factorNames.map(name => FACTORS[name].name),
                    datasets: [{
                        label: 'Your Score',
                        data: dataValues,
                        backgroundColor: factorColors,
                        borderColor: factorColors.map(color => Chart.helpers.color(color).darken(0.2).rgbString()), 
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'x', 
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: '#374151' },
                            ticks: { color: '#9CA3AF' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#D1D5DB', font: {size: 13} } 
                        }
                    },
                    plugins: {
                        legend: { display: false }, 
                        tooltip: {
                            backgroundColor: '#1F2937', 
                            titleColor: '#E5E7EB', 
                            bodyColor: '#D1D5DB',
                            callbacks: {
                                title: function(tooltipItems) {
                                    return tooltipItems[0].label; 
                                },
                                label: function(context) {
                                    const factorName = context.label;
                                    const score = context.parsed.y.toFixed(0);
                                    const rawDefinition = TRAIT_DEFINITIONS.Factors[factorName] || "";
                                    const definitionLines = wrapText(rawDefinition, 40); 
                                    return [`Score: ${score}`, ...definitionLines.map(line => `  ${line}`)];
                                }
                            }
                        },
                        annotation: { 
                            annotations: {
                                line1: {
                                    type: 'line',
                                    yMin: 50,
                                    yMax: 50,
                                    borderColor: '#6B7280', 
                                    borderWidth: 2,
                                    borderDash: [6, 6],
                                    label: {
                                        content: 'Average',
                                        enabled: true,
                                        position: 'end',
                                        backgroundColor: 'rgba(107, 114, 128, 0.7)',
                                        color: '#E5E7EB',
                                        font: { size: 10 }
                                    }
                                }
                            }
                        }
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const clickedIndex = elements[0].index;
                            const clickedFactorName = factorNames[clickedIndex];
                            
                            if (currentlyDisplayedFacetFactor === clickedFactorName) {
                                facetBreakdownContainer.classList.remove('visible');
                                currentlyDisplayedFacetFactor = null;
                            } else {
                                renderFacetBarChart(clickedFactorName, facetScores[clickedFactorName]);
                                currentlyDisplayedFacetFactor = clickedFactorName;
                            }
                        }
                    }
                }
            });
        }
        
        function renderFacetBarChart(factorName, currentFacetScoresForFactor) {
            const ctx = document.getElementById('facetBarChart').getContext('2d');
            const factorConfig = FACTORS[factorName];
            const facetNames = factorConfig.facets;
            
            const facetData = facetNames.map(facet => {
                const rawScore = currentFacetScoresForFactor[facet];
                let answeredForFacet = 0;
                let questionsInThisFacet = 0;
                 questions.forEach((q, index) => { 
                    if (q.factor === factorName && q.facet === facet) {
                        questionsInThisFacet++;
                        const userAnswerIndex = index; 
                        if (userAnswers[userAnswerIndex] !== null && userAnswers[userAnswerIndex] !== 'skipped') {
                            answeredForFacet++;
                        }
                    }
                });
                return answeredForFacet > 0 ? Math.round((rawScore / answeredForFacet) * 100) : 0; 
            });

            facetChartTitle.textContent = `Facets of ${factorName}`;
            facetChartTitle.className = `text-xl font-semibold ${factorConfig.textClass} mb-3 text-center`;


            if (currentFacetChart) {
                currentFacetChart.destroy();
            }

            currentFacetChart = new Chart(ctx, {
                type: 'bar', 
                data: {
                    labels: facetNames.map(name => name.replace(/([A-Z])/g, ' $1').trim()), 
                    datasets: [{
                        label: 'Facet Score',
                        data: facetData,
                        backgroundColor: Chart.helpers.color(factorConfig.color).alpha(0.7).rgbString(),
                        borderColor: factorConfig.color,
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', 
                    responsive: true,
                    maintainAspectRatio: false,
                     interaction: { 
                        mode: 'index',
                        axis: 'y',
                        intersect: false
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: '#374151' },
                            ticks: { color: '#9CA3AF' }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: '#D1D5DB', font: {size: 10} }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1F2937', 
                            titleColor: '#E5E7EB', 
                            bodyColor: '#D1D5DB',
                             callbacks: {
                                title: function(tooltipItems) {
                                    return tooltipItems[0].label; 
                                },
                                label: function(context) {
                                    const facetDisplayName = context.label; 
                                    const facetKey = facetDisplayName.replace(/\s/g, ''); 
                                    const score = context.parsed.x.toFixed(0);
                                    let rawDefinition = "";
                                    if (TRAIT_DEFINITIONS.Facets[factorName] && TRAIT_DEFINITIONS.Facets[factorName][facetKey]) {
                                        rawDefinition = TRAIT_DEFINITIONS.Facets[factorName][facetKey];
                                    }
                                    const definitionLines = wrapText(rawDefinition, 35);
                                    return [`Score: ${score}`, ...definitionLines.map(line => `  ${line}`)];
                                }
                            }
                        }
                    }
                }
            });
            facetBreakdownContainer.classList.add('visible');
        }


        function renderScoresTable(scores, deviations, levels, highlights) {
            scoresTableBody.innerHTML = '';
            Object.keys(FACTORS).forEach(factorName => {
                const row = scoresTableBody.insertRow();
                row.innerHTML = `
                    <td class="py-3 px-4 border-b border-slate-600 ${FACTORS[factorName].textClass} font-semibold">${FACTORS[factorName].name}</td>
                    <td class="py-3 px-4 border-b border-slate-600">${scores[factorName]}</td>
                    <td class="py-3 px-4 border-b border-slate-600">${deviations[factorName] > 0 ? '+' : ''}${deviations[factorName]}</td>
                    <td class="py-3 px-4 border-b border-slate-600">${levels[factorName]}</td>
                    <td class="py-3 px-4 border-b border-slate-600 text-sm italic">${highlights[factorName]}</td>
                `;
            });
        }

        function renderDetailedInsights(scores, levels, highlights) {
            detailedInsightsContainer.innerHTML = '';
            Object.keys(FACTORS).forEach(factorName => {
                const factorConfig = FACTORS[factorName];
                const score = scores[factorName];
                const level = levels[factorName];
                const highlight = highlights[factorName];
                
                const aspectMap = FACET_TO_ASPECT_MAP[factorName];
                let dominantAspectName = "";
                let aspectInterpretation = "";
                if(aspectMap) {
                    let aspectScoresTemp = {};
                    Object.keys(aspectMap).forEach(aspName => {
                        aspectScoresTemp[aspName] = 0;
                        aspectMap[aspName].forEach(facet => {
                            aspectScoresTemp[aspName] += (facetScores[factorName][facet] || 0);
                        });
                    });
                    if(Object.keys(aspectScoresTemp).length > 0) {
                        let maxAspectScore = -1;
                        Object.entries(aspectScoresTemp).forEach(([aspName, aspScore]) => {
                            if (aspScore > maxAspectScore) {
                                maxAspectScore = aspScore;
                                dominantAspectName = aspName;
                            }
                        });
                        if (dominantAspectName) {
                             aspectInterpretation = `<p class="text-slate-300 mb-1">Within ${factorName}, your responses suggest a stronger leaning towards the <strong>${dominantAspectName}</strong> aspect (as per the DeYoung et al. 10-aspect model).</p>`;
                        }
                    }
                }


                let interpretation = `Your score for ${factorConfig.name} is ${score}, which is considered ${level}. `;
                let strengths = "";
                let ponderPoints = "";
                let reflectivePrompt = `Consider how your level of ${factorConfig.name} (highlighted as: ${highlight}${dominantAspectName ? `, with emphasis on ${dominantAspectName}` : ''}) influences your daily life and interactions.`;

                if (factorName === "Openness") {
                    if (level === "Very High" || level === "High") {
                        interpretation += "This suggests you are highly imaginative, curious, and receptive to new experiences. You likely enjoy art, abstract ideas, and novel situations.";
                        strengths = "Often creative, adaptable, and intellectually engaged. You bring fresh perspectives.";
                        ponderPoints = "May find routine less appealing or sometimes question established norms more readily. Balancing novelty with practicality can be key.";
                    } else if (level === "Average") {
                        interpretation += "This indicates a balance between appreciating novelty and valuing the familiar. You can be open to new things but also find comfort in routine.";
                        strengths = "Flexible yet grounded, can appreciate both new ideas and proven methods. Adaptable to various situations.";
                        ponderPoints = "May sometimes feel torn between adventure and stability. Recognizing when to explore versus when to consolidate can be useful.";
                    } else { 
                        interpretation += "This suggests you tend to be more practical, conventional, and prefer familiar routines and experiences. You might value tradition and concrete facts over abstract ideas.";
                        strengths = "Often practical, down-to-earth, and decisive based on known facts. Provides stability and focus.";
                        ponderPoints = "May be less inclined to explore unconventional ideas or step outside comfort zones. Could miss out on benefits of novelty if too resistant to change.";
                    }
                }
                 else if (factorName === "Conscientiousness") {
                    if (level === "Very High" || level === "High") {
                        interpretation += "This indicates a strong tendency towards being organized, dependable, and achievement-oriented. You likely plan carefully and are self-disciplined.";
                        strengths = "Reliable, organized, persistent, and driven to succeed. Excellent at follow-through.";
                        ponderPoints = "May sometimes struggle with perfectionism, be perceived as rigid, or have difficulty relaxing if tasks are unfinished.";
                    } else if (level === "Average") {
                        interpretation += "This suggests a balance between being organized and spontaneous. You can be responsible but also flexible when needed.";
                        strengths = "Dependable yet adaptable, can manage tasks effectively without being overly rigid. Good at prioritizing.";
                        ponderPoints = "May occasionally struggle with consistency on very long-term projects if not mindful. Finding the right level of structure is important.";
                    } else {
                        interpretation += "This suggests a more spontaneous, flexible, and less structured approach. You might be less focused on meticulous planning or strict adherence to schedules.";
                        strengths = "Adaptable, comfortable with ambiguity, and can be spontaneous. Not easily stressed by lack of order.";
                        ponderPoints = "May face challenges with organization, procrastination, or meeting deadlines that require long-term discipline. Important to find systems that work for you.";
                    }
                }
                 else if (factorName === "Extraversion") {
                    if (level === "Very High" || level === "High") {
                        interpretation += "This suggests you are outgoing, sociable, assertive, and draw energy from interacting with others. You likely enjoy being in groups and stimulating environments.";
                        strengths = "Enthusiastic, socially skilled, comfortable in groups, often takes initiative and energizes others.";
                        ponderPoints = "May find solitude draining or sometimes overwhelm quieter individuals. Important to ensure others have space to contribute.";
                    } else if (level === "Average") {
                        interpretation += "This indicates a balance between being outgoing and enjoying quieter time. You can be sociable but also appreciate solitude for recharging.";
                        strengths = "Can adapt to both social and solitary situations, good balance of social energy and reflective capacity. Can connect well with a variety of people.";
                        ponderPoints = "May need to consciously choose when to engage socially versus withdraw to manage energy levels effectively.";
                    } else {
                        interpretation += "This suggests you are more reserved, prefer solitary activities or small groups, and may find large social gatherings draining. You likely gain energy from quiet time.";
                        strengths = "Often reflective, observant, and capable of deep focus independently. Forms strong, close relationships.";
                        ponderPoints = "May miss out on some social opportunities or be perceived as aloof if not careful to engage when desired. Important to proactively seek connections if they are important to you.";
                    }
                }
                 else if (factorName === "Agreeableness") {
                    if (level === "Very High" || level === "High") {
                        interpretation += "This indicates you are cooperative, empathetic, trusting, and considerate of others. You likely value harmony and are helpful.";
                        strengths = "Kind, compassionate, helpful, good at building harmonious relationships and fostering teamwork.";
                        ponderPoints = "May sometimes find it hard to assert own needs, say 'no', or be firm when necessary, potentially leading to being taken advantage of.";
                    } else if (level === "Average") {
                        interpretation += "This suggests a balance between being cooperative and being assertive. You can be empathetic but also stand up for your own interests.";
                        strengths = "Can be both supportive and self-advocating, maintaining fair and balanced relationships. Good at negotiating compromises.";
                        ponderPoints = "May need to navigate situations requiring a clear stance carefully, deciding when to prioritize harmony versus directness.";
                    } else {
                        interpretation += "This suggests a more competitive, skeptical, and potentially challenging approach to social interactions. You might be more focused on your own interests and less concerned with others' feelings.";
                        strengths = "Often analytical, capable of making tough decisions, and not easily swayed by sentiment. Can be a strong advocate for your own views.";
                        ponderPoints = "May sometimes be perceived as uncooperative, critical, or insensitive. Building trust and rapport might require more conscious effort.";
                    }
                }
                 else if (factorName === "Neuroticism") { 
                    if (level === "Very High" || level === "High") {
                        interpretation += "This suggests a tendency to experience negative emotions like anxiety, sadness, or irritability more frequently or intensely. You might be more sensitive to stress and perceive situations as threatening.";
                        strengths = "Often highly attuned to potential threats or problems, can be empathetic due to own emotional depth. This sensitivity can lead to carefulness.";
                        ponderPoints = "May struggle with worry, mood swings, or coping effectively with stress. Can sometimes lead to rumination or difficulty relaxing.";
                    } else if (level === "Average") {
                        interpretation += "This indicates a typical level of emotional reactivity. You experience ups and downs but generally manage stress adequately and maintain a balanced emotional state.";
                        strengths = "Experiences a normal range of emotions and can generally cope with stress. Emotionally responsive but not overly reactive.";
                        ponderPoints = "Standard emotional experiences, with occasional stress or worry, which is typical. Awareness of coping strategies is always beneficial.";
                    } else { 
                        interpretation += "This suggests high emotional stability. You likely experience negative emotions infrequently and tend to be calm, resilient, and even-keeled, even under stress.";
                        strengths = "Calm under pressure, resilient, optimistic, and handles stress well. Provides a steadying influence on others.";
                        ponderPoints = "May sometimes find it hard to understand or empathize with more emotionally reactive individuals. Important to validate others' feelings even if not personally experiencing them.";
                    }
                }

                const insightHTML = `
                    <div class="p-4 rounded-lg shadow-md ${factorConfig.lightBgDark}">
                        <h3 class="text-xl font-semibold mb-1 ${factorConfig.textClass}">${factorConfig.name} (Score: ${score} - ${level})</h3>
                        <p class="text-sm italic ${factorConfig.textClass} mb-2">Key Profile Highlight: ${highlight}</p>
                        <p class="text-slate-300 mb-2"><strong>What This Suggests:</strong> ${interpretation}</p>
                        ${aspectInterpretation}
                        <p class="text-slate-300 mb-2"><strong>Potential Strengths:</strong> ${strengths || "Balanced traits offer adaptability."}</p>
                        <p class="text-slate-300 mb-2"><strong>Points to Ponder:</strong> ${ponderPoints || "Maintaining balance is key."}</p>
                        <p class="text-slate-400 italic mt-3"><strong>Reflect:</strong> ${reflectivePrompt}</p>
                    </div>
                `;
                detailedInsightsContainer.innerHTML += insightHTML;
            });
        }
        
        function renderTraitInteractions(scores, levels) {
            const sortedFactors = Object.entries(scores).sort(([,a],[,b]) => b-a);
            let interactionText = "Your unique combination of traits creates a complex personality. ";

            if (sortedFactors.length >= 2) {
                const highestFactor = sortedFactors[0][0];
                const highestLevel = levels[highestFactor];
                const lowestFactor = sortedFactors[sortedFactors.length - 1][0];
                const lowestLevel = levels[lowestFactor];

                interactionText += `For example, your ${highestLevel} ${FACTORS[highestFactor].name} combined with your ${lowestLevel} ${FACTORS[lowestFactor].name} might suggest that `;

                if ((highestFactor === "Openness" && (highestLevel === "High" || highestLevel === "Very High")) && 
                    (lowestFactor === "Conscientiousness" && (lowestLevel === "Low" || lowestLevel === "Very Low"))) {
                    interactionText += "you are brimming with innovative ideas but may find structured execution less naturally appealing. How can you harness your creativity while finding systems that support follow-through?";
                } else if ((highestFactor === "Extraversion" && (highestLevel === "High" || highestLevel === "Very High")) &&
                           (lowestFactor === "Agreeableness" && (lowestLevel === "Low" || lowestLevel === "Very Low"))) {
                    interactionText += "you are very outgoing and assertive, which can be great for leadership, but it might be beneficial to be mindful of how your directness impacts others in social or collaborative settings.";
                } else if ((highestFactor === "Conscientiousness" && (highestLevel === "High" || highestLevel === "Very High")) &&
                           (lowestFactor === "Openness" && (lowestLevel === "Low" || lowestLevel === "Very Low"))) {
                    interactionText += "you are highly diligent and organized, excelling at executing plans, but perhaps you could benefit from occasionally stepping outside your comfort zone to explore novel approaches or ideas.";
                } else if ((highestFactor === "Agreeableness" && (highestLevel === "High" || highestLevel === "Very High")) &&
                           (lowestFactor === "Extraversion" && (lowestLevel === "Low" || lowestLevel === "Very Low"))) {
                    interactionText += "you are deeply compassionate and cooperative, excellent at building rapport in close relationships, but might sometimes find it challenging to assert your needs in larger, more competitive group settings.";
                } else if ((highestFactor === "Neuroticism" && (highestLevel === "High" || highestLevel === "Very High")) &&
                           (lowestFactor === "Extraversion" && (lowestLevel === "Low" || lowestLevel === "Very Low"))) {
                    interactionText += "you experience emotions intensely and are quite introverted. This might mean you have a rich inner life but could find emotionally charged social situations particularly draining. What coping strategies work best for you in such scenarios?";
                }
                else {
                    interactionText += "you possess a unique blend of characteristics. Reflect on how these dominant and less dominant traits interact in your daily life.";
                }
            } else {
                interactionText += "Consider how your different trait levels interact to shape your experiences."
            }
            traitInteractionsText.textContent = interactionText;
        }


        function renderFacetSpotlight(currentFacetScores) { 
            facetSpotlightContainer.innerHTML = '';
            Object.keys(FACTORS).forEach(factorName => {
                const factorConfig = FACTORS[factorName];
                const facets = factorConfig.facets;
                let facetHTML = `<div class="p-4 rounded-lg shadow-md ${factorConfig.lightBgDark}">
                                    <h4 class="text-lg font-semibold mb-3 ${factorConfig.textClass}">${factorConfig.name} Facets</h4>
                                    <ul class="space-y-2">`;
                
                facets.forEach(facet => {
                    const rawFacetScore = currentFacetScores[factorName][facet];
                    let answeredForFacet = 0;
                    let questionsInThisFacet = 0;
                    questions.forEach((q, index) => {
                        if (q.factor === factorName && q.facet === facet) {
                            questionsInThisFacet++;
                            if (userAnswers[index] !== null && userAnswers[index] !== 'skipped') {
                                answeredForFacet++;
                            }
                        }
                    });

                    const maxScoreForFacetDisplay = questionsInThisFacet; 
                    const percentage = answeredForFacet > 0 ? (rawFacetScore / answeredForFacet) * 100 : 0; 
                    
                    const listItem = document.createElement('li');
                    listItem.classList.add('text-sm', 'text-slate-300', 'cursor-default');
                    listItem.innerHTML = `
                        <div class="flex justify-between mb-1">
                            <span>${facet.replace(/([A-Z])/g, ' $1').trim()}:</span> 
                            <span>${rawFacetScore}/${maxScoreForFacetDisplay} (${percentage.toFixed(0)}%) ${answeredForFacet === 0 && questionsInThisFacet > 0 ? '(All Skipped)' : ''}</span>
                        </div>
                        <div class="w-full bg-slate-600 rounded-full h-2.5">
                            <div class="h-2.5 rounded-full" style="width: ${percentage}%; background-color: ${factorConfig.color};"></div>
                        </div>
                    `;
                    listItem.addEventListener('mouseenter', (event) => {
                         showCustomTooltip(event, facet, factorName, rawFacetScore, maxScoreForFacetDisplay, percentage);
                    });
                    listItem.addEventListener('mouseleave', hideCustomTooltip);
                    facetHTML += listItem.outerHTML; 
                });
                // Correctly append list items to preserve event listeners
                const ulElement = document.createElement('ul');
                ulElement.className = 'space-y-2';
                facets.forEach(facet => {
                    const rawFacetScore = currentFacetScores[factorName][facet];
                    let answeredForFacet = 0;
                    let questionsInThisFacet = 0;
                    questions.forEach((q, index) => {
                        if (q.factor === factorName && q.facet === facet) {
                            questionsInThisFacet++;
                            if (userAnswers[index] !== null && userAnswers[index] !== 'skipped') {
                                answeredForFacet++;
                            }
                        }
                    });
                    const maxScoreForFacetDisplay = questionsInThisFacet;
                    const percentage = answeredForFacet > 0 ? (rawFacetScore / answeredForFacet) * 100 : 0;
                    
                    const listItem = document.createElement('li');
                    listItem.classList.add('text-sm', 'text-slate-300', 'cursor-default');
                    listItem.innerHTML = `
                        <div class="flex justify-between mb-1">
                            <span>${facet.replace(/([A-Z])/g, ' $1').trim()}:</span> 
                            <span>${rawFacetScore}/${maxScoreForFacetDisplay} (${percentage.toFixed(0)}%) ${answeredForFacet === 0 && questionsInThisFacet > 0 ? '(All Skipped)' : ''}</span>
                        </div>
                        <div class="w-full bg-slate-600 rounded-full h-2.5">
                            <div class="h-2.5 rounded-full" style="width: ${percentage}%; background-color: ${factorConfig.color};"></div>
                        </div>
                    `;
                    listItem.addEventListener('mouseenter', (event) => {
                         showCustomTooltip(event, facet, factorName, rawFacetScore, maxScoreForFacetDisplay, percentage);
                    });
                    listItem.addEventListener('mouseleave', hideCustomTooltip);
                    ulElement.appendChild(listItem);
                });


                facetSpotlightContainer.innerHTML += `
                    <div class="p-4 rounded-lg shadow-md ${factorConfig.lightBgDark}">
                        <h4 class="text-lg font-semibold mb-3 ${factorConfig.textClass}">${factorConfig.name} Facets</h4>
                        ${ulElement.outerHTML}
                    </div>`;
            });
        }

        function showCustomTooltip(event, facetKey, factorName, rawScore, maxScore, percentage) {
            const definition = TRAIT_DEFINITIONS.Facets[factorName]?.[facetKey] || "No definition available.";
            const definitionLines = wrapText(definition, 35); 

            customTooltip.innerHTML = `
                <strong class="${FACTORS[factorName].textClass}">${facetKey.replace(/([A-Z])/g, ' $1').trim()}</strong>
                Score: ${rawScore}/${maxScore} (${percentage.toFixed(0)}%)<br>
                ${definitionLines.map(line => `&nbsp;&nbsp;${line}`).join('<br>')}
            `;

            let x = event.pageX + 15;
            let y = event.pageY + 15;
            
            const tooltipRect = customTooltip.getBoundingClientRect(); 
            if (x + tooltipRect.width > window.innerWidth) {
                x = event.pageX - tooltipRect.width - 15;
            }
            if (y + tooltipRect.height > window.innerHeight) {
                y = event.pageY - tooltipRect.height - 15;
            }
            if (y < 0) y = 15; 

            customTooltip.style.left = `${x}px`;
            customTooltip.style.top = `${y}px`;
            customTooltip.classList.remove('hidden');
        }

        function hideCustomTooltip() {
            customTooltip.classList.add('hidden');
        }

        // --- END RESULTS DISPLAY ---

        // --- PDF EXPORT ---
        function generatePdfContent() { 
            return new Promise((resolve) => {
                pdfDate.textContent = `Report Generated: ${new Date().toLocaleDateString()}`;
                
                pdfScoresTableBody.innerHTML = ''; 
                const factorNames = Object.keys(FACTORS);
                factorNames.forEach(factorName => {
                    let answeredQuestionsForFactor = 0;
                    let currentFactorRawScore = 0;
                    questions.forEach((q, index) => {
                        if (q.factor === factorName && userAnswers[index] !== null && userAnswers[index] !== 'skipped') {
                            answeredQuestionsForFactor++;
                            const physicalButtonIndex = userAnswers[index];
                            const isReversed = questionDisplayOrders[index];
                            const actualSelectedOriginalOption = isReversed ? q.options[1 - physicalButtonIndex] : q.options[physicalButtonIndex];
                            if (actualSelectedOriginalOption.score === 1) {
                                currentFactorRawScore++;
                            }
                        }
                    });
                    const maxPossibleScoreForAnswered = answeredQuestionsForFactor;
                    const stdScore = maxPossibleScoreForAnswered > 0 ? Math.round((currentFactorRawScore / maxPossibleScoreForAnswered) * 100) : 50;
                    const devScore = stdScore - 50;
                    const genLevel = getGeneralLevel(stdScore);
                    const highlight = getProfileHighlight(factorName, stdScore, facetScores[factorName]);

                    const row = pdfScoresTableBody.insertRow();
                    row.innerHTML = `<td>${FACTORS[factorName].name}</td><td>${stdScore}</td><td>${devScore > 0 ? '+' : ''}${devScore}</td><td>${genLevel}</td><td class="profile-highlight-pdf">${highlight}</td>`;
                });

                pdfInsightsContainer.innerHTML = ''; 
                pdfFacetSpotlightContainer.innerHTML = '<h2 style="font-size: 14pt; border-bottom: 1px solid #eee; padding-bottom: 0.1in; margin-top:0.3in;">Facet Score Details</h2>';
                pdfTraitInteractionsContainer.innerHTML = '<h2 style="font-size: 14pt; border-bottom: 1px solid #eee; padding-bottom: 0.1in; margin-top:0.3in;">Potential Trait Interactions</h2>';


                factorNames.forEach(factorName => {
                    const factorConfig = FACTORS[factorName];
                     let answeredQuestionsForFactor = 0;
                    let currentFactorRawScore = 0;
                    questions.forEach((q, index) => {
                        if (q.factor === factorName && userAnswers[index] !== null && userAnswers[index] !== 'skipped') {
                            answeredQuestionsForFactor++;
                            const physicalButtonIndex = userAnswers[index];
                            const isReversed = questionDisplayOrders[index];
                            const actualSelectedOriginalOption = isReversed ? q.options[1 - physicalButtonIndex] : q.options[physicalButtonIndex];
                            if (actualSelectedOriginalOption.score === 1) {
                                currentFactorRawScore++;
                            }
                        }
                    });
                    const maxPossibleScoreForAnswered = answeredQuestionsForFactor;
                    const score = maxPossibleScoreForAnswered > 0 ? Math.round((currentFactorRawScore / maxPossibleScoreForAnswered) * 100) : 50;
                    const level = getGeneralLevel(score);
                    const highlight = getProfileHighlight(factorName, score, facetScores[factorName]);

                    let interpretation = `Your score for ${factorConfig.name} is ${score} (${level}). Highlight: ${highlight}. `;
                    if (factorName === "Openness") interpretation += (level === "Very High" || level === "High") ? "This suggests high imagination and curiosity." : (level === "Average" ? "This indicates a balance of novelty and familiarity." : "This suggests a practical, conventional approach.");
                    if (factorName === "Conscientiousness") interpretation += (level === "Very High" || level === "High") ? "This indicates strong organization and self-discipline." : (level === "Average" ? "This suggests a balance of planning and flexibility." : "This suggests a more spontaneous, less structured style.");
                    if (factorName === "Extraversion") interpretation += (level === "Very High" || level === "High") ? "This suggests an outgoing, sociable nature." : (level === "Average" ? "This indicates a balance of social engagement and solitude." : "This suggests a more reserved, quieter preference.");
                    if (factorName === "Agreeableness") interpretation += (level === "Very High" || level === "High") ? "This indicates a cooperative and empathetic disposition." : (level === "Average" ? "This suggests a balance of cooperation and self-interest." : "This suggests a more competitive, analytical approach.");
                    if (factorName === "Neuroticism") interpretation += (level === "Very High" || level === "High") ? "This suggests a tendency towards experiencing negative emotions more readily." : (level === "Average" ? "This indicates a typical level of emotional reactivity." : "This suggests high emotional stability and resilience.");

                    pdfInsightsContainer.innerHTML += `<div class="pdf-factor-insight-block">
                        <h3 style="font-size: 11pt; font-weight: bold; color: ${factorConfig.color}; margin-bottom: 0.05in;">${factorConfig.name}</h3>
                        <p>${interpretation}</p>
                    </div>`;
                    
                    pdfFacetSpotlightContainer.innerHTML += `<div class="pdf-factor-insight-block"><h3 style="font-size: 11pt; font-weight: bold; color: ${factorConfig.color}; margin-bottom: 0.05in;">${factorConfig.name} Facets:</h3><ul class="pdf-facet-list">`;
                    factorConfig.facets.forEach(facet => {
                        const rawFacetScore = facetScores[factorName][facet];
                        let answeredForFacet = 0;
                        let questionsInThisFacet = 0;
                        questions.forEach((q, index) => {
                            if (q.factor === factorName && q.facet === facet) {
                                questionsInThisFacet++;
                                if (userAnswers[index] !== null && userAnswers[index] !== 'skipped') {
                                    answeredForFacet++;
                                }
                            }
                        });
                        const maxScoreForFacetDisplay = questionsInThisFacet;
                        const percentage = answeredForFacet > 0 ? (rawFacetScore / answeredForFacet) * 100 : 0;
                        pdfFacetSpotlightContainer.innerHTML += `<li><strong>${facet.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${rawFacetScore}/${maxScoreForFacetDisplay} (${percentage.toFixed(0)}%) ${answeredForFacet === 0 && questionsInThisFacet > 0 ? '(All Skipped)' : ''}</li>`;
                    });
                    pdfFacetSpotlightContainer.innerHTML += `</ul></div>`;
                });
                pdfInsightsContainer.appendChild(pdfTraitInteractionsContainer); 
                pdfInsightsContainer.appendChild(pdfFacetSpotlightContainer); 
                pdfTraitInteractionsContainer.innerHTML = `<p>${traitInteractionsText.textContent}</p>`; 


                const chartCanvas = document.getElementById('mainFactorBarChart'); 
                if (chartCanvas && mainFactorChart) { 
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = chartCanvas.width; 
                    tempCanvas.height = chartCanvas.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.fillStyle = 'white'; 
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    tempCtx.drawImage(chartCanvas, 0, 0); 
                    const chartImage = tempCanvas.toDataURL('image/png', 1.0);
                    
                    pdfChartImage.onload = () => { 
                        resolve();
                    };
                    pdfChartImage.onerror = () => {
                        console.error("PDF Chart image failed to load.");
                        pdfChartImage.alt = "Chart could not be rendered for PDF.";
                        resolve(); 
                    };
                    pdfChartImage.src = chartImage;

                } else {
                    pdfChartImage.alt = "Chart was not available for PDF.";
                     console.warn("Main factor chart or canvas not found for PDF export.");
                    resolve(); 
                }
            });
        }
        
        exportPdfButton.onclick = async () => {
            const { jsPDF } = window.jspdf;
            if (!jsPDF) {
                alert("PDF library not loaded. Please try again.");
                return;
            }
            
            const originalButtonText = exportPdfButton.innerHTML;
            exportPdfButton.innerHTML = `Generating PDF... <svg class="animate-spin h-5 w-5 ml-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            exportPdfButton.disabled = true;

            try {
                await generatePdfContent(); 
                await new Promise(resolve => setTimeout(resolve, 300)); 

                const pdfContentElement = document.getElementById('pdfExportContainer');
                const canvas = await html2canvas(pdfContentElement, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff',
                });
                const imgData = canvas.toDataURL('image/png');
                
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'in',
                    format: 'letter' 
                });

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Personality_Profile_Summary.pdf');

            } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Sorry, there was an error generating the PDF. Please try again or check the console.");
            } finally {
                exportPdfButton.innerHTML = originalButtonText;
                exportPdfButton.disabled = false;
            }
        };
        
        // --- END PDF EXPORT ---

        // --- STARTUP ---
        initializeApp(); 
        // --- END STARTUP ---

    </script>
</body>
</html>

