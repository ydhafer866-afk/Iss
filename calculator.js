const { createApp } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00'
                }
            }
        }
    }
});

const app = createApp({
    data() {
        return {
            drawer: false,
            age: null,
            gender: 'male',
            height: null,
            weight: null,
            activityLevel: '1.2',
            goal: 'maintain',
            result: null,
            activityLevels: [
                { value: '1.2', title: 'Sedentary (little or no exercise)' },
                { value: '1.375', title: 'Lightly active (1-3 days/week)' },
                { value: '1.55', title: 'Moderately active (3-5 days/week)' },
                { value: '1.725', title: 'Very active (6-7 days/week)' },
                { value: '1.9', title: 'Extremely active (physical job + exercise)' }
            ],
            goals: [
                { value: 'lose', title: 'Lose Weight (-500 cal/day)' },
                { value: 'maintain', title: 'Maintain Weight' },
                { value: 'gain', title: 'Gain Muscle (+300 cal/day)' }
            ]
        };
    },
    methods: {
        calculateCalories() {
            if (!this.age || !this.height || !this.weight) {
                alert('Please fill in all fields');
                return;
            }

            // Calculate BMI
            const heightInMeters = this.height / 100;
            const bmi = this.weight / (heightInMeters * heightInMeters);
            
            // Determine BMI category
            let bmiCategory = '';
            let bmiColor = '';
            if (bmi < 18.5) {
                bmiCategory = 'Underweight';
                bmiColor = 'bmi-underweight';
            } else if (bmi < 25) {
                bmiCategory = 'Normal';
                bmiColor = 'bmi-normal';
            } else if (bmi < 30) {
                bmiCategory = 'Overweight';
                bmiColor = 'bmi-overweight';
            } else {
                bmiCategory = 'Obese';
                bmiColor = 'bmi-obese';
            }

            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (this.gender === 'male') {
                bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
            } else {
                bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
            }

            // Calculate TDEE
            const tdee = bmr * parseFloat(this.activityLevel);

            // Adjust based on goal
            let targetCalories = tdee;
            let goalText = '';
            if (this.goal === 'lose') {
                targetCalories -= 500;
                goalText = 'Weight Loss';
            } else if (this.goal === 'gain') {
                targetCalories += 300;
                goalText = 'Muscle Gain';
            } else {
                goalText = 'Maintenance';
            }

            // Calculate macros
            const protein = this.weight * 2; // 2g per kg
            const fat = targetCalories * 0.25 / 9; // 25% of calories
            const carbs = (targetCalories - (protein * 4) - (fat * 9)) / 4;

            this.result = {
                bmi: bmi.toFixed(1),
                bmiCategory,
                bmiColor,
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                targetCalories: Math.round(targetCalories),
                goalText,
                protein: Math.round(protein),
                carbs: Math.round(carbs),
                fat: Math.round(fat)
            };

            // Save to localStorage
            localStorage.setItem('userProfile', JSON.stringify({
                age: this.age,
                gender: this.gender,
                height: this.height,
                weight: this.weight,
                activityLevel: this.activityLevel,
                goal: this.goal,
                result: this.result
            }));
        },
        reset() {
            this.age = null;
            this.gender = 'male';
            this.height = null;
            this.weight = null;
            this.activityLevel = '1.2';
            this.goal = 'maintain';
            this.result = null;
        }
    },
    mounted() {
        // Load saved data if exists
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const data = JSON.parse(saved);
            this.age = data.age;
            this.gender = data.gender;
            this.height = data.height;
            this.weight = data.weight;
            this.activityLevel = data.activityLevel;
            this.goal = data.goal;
            this.result = data.result;
        }
    }
});

app.use(vuetify);
app.mount('#app');
