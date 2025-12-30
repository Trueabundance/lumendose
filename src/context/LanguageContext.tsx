import { createContext, useContext, useState, useCallback, type ReactNode, type FC } from 'react';

interface Translations {
    [key: string]: {
        [key: string]: string | ((...args: any[]) => string);
    };
}

// Full translations object would go here, simplified for brevity but extensible
export const translations: Translations = {
    en: {
        app_title: "LumenDose",
        header_premium_button: "Go Premium",
        header_premium_status: "Premium",
        section_title_impact: "Real-Time Brain Impact",
        section_subtitle_impact: "Educational model of alcohol's short-term effects.",
        label_total_alcohol: "Total Alcohol",
        section_title_control: "Alcohol Intake",
        button_log_drink: "Log a Drink",
        button_scan_drink: "Scan Drink",
        disclaimer_title: "Disclaimer",
        disclaimer_text: "LumenDose is an educational tool, not medical advice. Drink responsibly.",
        section_title_log: "Current Session Log",
        log_empty: "No drinks logged yet.",
        section_title_premium: "Premium Features",
        premium_feature_trends_title: "Historical Trends",
        premium_feature_trends_desc: "Track consumption over weeks, months, and years.",
        premium_feature_insights_title: "Personalized Insights",
        premium_feature_insights_desc: "AI-powered advice based on your unique patterns.",
        premium_unlocked_trends: "Historical Trends Unlocked!",
        premium_unlocked_trends_desc: "View your consumption patterns over time.",
        premium_unlocked_insights: "Personalized Insights Unlocked!",
        premium_unlocked_insights_desc: "Receive AI-driven feedback based on your habits.",
        modal_title: "Log a Drink",
        modal_drink_type: "Drink Type",
        modal_volume: "Volume (ml)",
        modal_abv: "ABV (%)",
        modal_add_button: "Add to Log",
        drink_beer: "Beer",
        drink_wine: "Wine",
        drink_spirit: "Spirit (Shot)",
        drink_liqueur: "Liqueur",
        drink_sake: "Sake",
        drink_soju: "Soju",
        impact_low: "Low",
        impact_moderate: "Moderate",
        impact_high: "High",
        impact_nominal: "Nominal impact at this level.",
        impact_noticeable: (func: string) => `Noticeable impairment to ${func}`,
        impact_significant: (func: string) => `Significant disruption of ${func}`,
        ai_coach_title: "AI Coach Insight",
        ai_coach_generating: "Generating insight...",
        ai_coach_no_key: "AI Coach is disabled. A Gemini API key is required for this feature.",
        premium_modal_title: "Unlock Premium!",
        premium_modal_text: "Access historical trends, advanced AI insights, and more by going Premium!",
        premium_modal_button: "Proceed to Checkout",
        premium_dashboard_title: "Premium Dashboard",
        historical_trends_title: "Your Weekly Trends",
        long_term_insights_title: "Long-Term AI Insights",
        chart_loading: "Loading historical data...",
        chart_no_data: "Not enough data to display trends. Keep logging your drinks!",
        quick_log_title: "Quick Add",
        quick_add_beer_standard: "Pint of Beer (4.5%)",
        quick_add_wine_glass: "Large Wine (175ml, 13%)",
        quick_add_spirit_single: "Single Shot (25ml, 40%)",
        quick_add_cider: "Pint of Cider (4.5%)",
        quick_add_cocktail: "Cocktail (100ml, 20%)",
        quick_add_beer_can: "Can of Beer (355ml, 5%)",
        quick_add_wine_glass_us: "Glass of Wine (147ml, 12%)",
        quick_add_spirit_shot_us: "Shot (44ml, 40%)",
        quick_add_cider_can: "Can of Cider (355ml, 5%)",
        quick_add_cocktail_us: "Cocktail (150ml, 20%)",
        region_selector_title: "Region",
        region_uk: "United Kingdom",
        region_us: "United States",
        region_au: "Australia",
        region_de: "Germany",
        reminder_title: "Time to Log?",
        reminder_text: "Don't forget to log your recent drinks to keep your insights accurate!",
        reminder_log_button: "Log Now",
        reminder_dismiss_button: "Dismiss",
        region_frontalLobe: "Frontal Lobe",
        region_temporalLobe: "Temporal Lobe",
        region_parietalLobe: "Parietal Lobe",
        region_occipitalLobe: "Occipital Lobe",
        region_cerebellum: "Cerebellum",
        region_brainstem: "Brainstem",
        manage_quick_adds: "Manage Quick Adds",
        add_custom_quick_add: "Add Custom Quick Add",
        edit_custom_quick_add: "Edit Custom Quick Add",
        custom_quick_add_label: "Button Label",
        custom_quick_add_type: "Drink Type",
        custom_quick_add_volume: "Volume (ml)",
        abv: "ABV (%)",
        save_quick_add: "Save Quick Add",
        delete_quick_add: "Delete",
        no_custom_quick_adds: "No custom quick adds yet.",
        daily_goal_title: "Daily Alcohol Goal",
        set_goal: "Set Goal (grams)",
        current_progress: "Current Progress",
        goal_set_success: "Daily goal set!",
        goal_delete_success: "Daily goal removed.",
        goal_not_set: "No daily goal set.",
        goal_exceeded: "Goal Exceeded!",
        goal_remaining: "remaining",
        achievements_title: "Achievements",
        achievement_first_log_name: "First Sip",
        achievement_first_log_desc: "Logged your first drink!",
        achievement_7_day_streak_name: "7-Day Streak",
        achievement_7_day_streak_desc: "Logged drinks for 7 consecutive days!",
        achievement_30_day_streak_name: "30-Day Streak",
        achievement_30_day_streak_desc: "Logged drinks for 30 consecutive days!",
        achievement_5_goal_name: "Goal Setter Novice",
        achievement_5_goal_desc: "Hit your daily goal 5 times!",
        achievement_10_drinks_name: "Social Drinker",
        achievement_10_drinks_desc: "Logged 10 drinks!",
        achievement_50_drinks_name: "Regular Logger",
        achievement_50_drinks_desc: "50 drinks logged!",
        achievement_100_drinks_name: "Dedicated Tracker",
        achievement_100_drinks_desc: "100 drinks logged!",
        no_achievements_yet: "No achievements earned yet. Keep logging!",
        share_progress_button: "Share Progress",
        share_message_goal: "Today I consumed {grams}g of alcohol, staying within my goal of {goal}g with LumenDose! #ResponsibleDrinking #LumenDose",
        share_message_over_goal: "Today I consumed {grams}g of alcohol, exceeding my goal of {goal}g. Time to reflect with LumenDose! #HealthJourney #LumenDose",
        share_message_no_goal: "Today I consumed {grams}g of alcohol. Track your intake with LumenDose! #HealthApp",
        daily_challenge_title: "Daily Challenge",
        daily_challenge_completed: "Completed!",
        daily_challenge_log_n_drinks: "Log at least {value} drink(s) today.",
        daily_challenge_stay_below_goal: "Stay below {value}g alcohol today.",
        daily_challenge_use_custom_quick_add: "Use a custom quick add button.",
        daily_challenge_no_challenge: "No challenge for today. Enjoy your tracking!",
        current_streak: "Current Streak",
        days: "days",
        daily_challenge_not_completed: "Not completed",
        camera_modal_title: "Scan Drink Label",
        camera_modal_prompt: "Point your camera at the drink's label.",
        camera_modal_capture: "Capture",
        camera_modal_analyzing: "Analyzing...",
        scan_fail_alert: "Could not automatically detect drink details. Please enter them manually.",
        scan_error_alert: "An error occurred during scanning. Please check your connection and try again.",
        settings_title: "Settings",
        settings_gender_select: "Select Character Set (Visual Only)",
        settings_gender_male: "Male",
        settings_gender_female: "Female",
        settings_gender_saved: "Preference saved!",
    },
    // Add other languages here
};

const LanguageContext = createContext<{
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string, ...args: any[]) => string;
} | undefined>(undefined);

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const t = useCallback((key: string, ...args: any[]): string => {
        const translation = translations[language]?.[key] || translations['en']?.[key];
        if (typeof translation === 'function') {
            return translation(...args);
        }
        return translation as string || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
