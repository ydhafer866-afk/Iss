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
            muscleGroups: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'],
            selectedMuscles: [],
            level: 'intermediate',
            restTime: 60,
            injuries: [],
            generatedWorkout: null,
            savedWorkouts: [],
            selectedExercise: null,
            exerciseDialog: false,
            levels: ['beginner', 'intermediate', 'advanced'],
            commonInjuries: ['Knee', 'Shoulder', 'Back', 'Wrist', 'Ankle', 'Elbow'],
            motivationalQuotes: [
                { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
                { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
                { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
                { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
                { text: "Success starts with self-discipline.", author: "Unknown" }
            ],
            currentQuote: null
        };
    },
    methods: {
        generateWorkout() {
            if (this.selectedMuscles.length === 0) {
                alert('Please select at least one muscle group');
                return;
            }

            const workout = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                muscles: [...this.selectedMuscles],
                level: this.level,
                restTime: this.restTime,
                exercises: []
            };

            // Generate exercises for each muscle group
            this.selectedMuscles.forEach(muscle => {
                const exercises = exerciseDatabase[muscle] || [];
                const numExercises = this.level === 'beginner' ? 2 : this.level === 'intermediate' ? 3 : 4;
                
                // Get random exercises
                const selectedExercises = this.getRandomExercises(exercises, numExercises);
                
                selectedExercises.forEach(exercise => {
                    // Adjust for injuries
                    let modifiedExercise = { ...exercise, muscleGroup: muscle };
                    
                    if (this.injuries.length > 0) {
                        modifiedExercise.injuryWarning = this.checkInjuryConflict(exercise, muscle);
                        if (modifiedExercise.injuryWarning) {
                            modifiedExercise.alternatives = exercise.alternatives || [];
                        }
                    }
                    
                    workout.exercises.push(modifiedExercise);
                });
            });

            this.generatedWorkout = workout;
            this.currentQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        },
        getRandomExercises(exercises, count) {
            const shuffled = [...exercises].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, shuffled.length));
        },
        checkInjuryConflict(exercise, muscle) {
            const injuryMap = {
                'Knee': ['Legs', 'Full Body'],
                'Shoulder': ['Shoulders', 'Chest', 'Back', 'Arms'],
                'Back': ['Back', 'Legs', 'Full Body'],
                'Wrist': ['Arms', 'Chest', 'Shoulders'],
                'Ankle': ['Legs', 'Full Body'],
                'Elbow': ['Arms', 'Chest', 'Shoulders', 'Back']
            };

            for (let injury of this.injuries) {
                if (injuryMap[injury] && injuryMap[injury].includes(muscle)) {
                    return `⚠️ Caution: You have a ${injury} injury. Consider using alternative exercises or reducing weight/intensity.`;
                }
            }
            return null;
        },
        saveWorkout() {
            if (!this.generatedWorkout) return;
            
            this.savedWorkouts.push({ ...this.generatedWorkout });
            localStorage.setItem('savedWorkouts', JSON.stringify(this.savedWorkouts));
            alert('Workout saved successfully!');
        },
        viewExercise(exercise) {
            this.selectedExercise = exercise;
            this.exerciseDialog = true;
        },
        deleteWorkout(index) {
            this.savedWorkouts.splice(index, 1);
            localStorage.setItem('savedWorkouts', JSON.stringify(this.savedWorkouts));
        },
        loadWorkout(workout) {
            this.generatedWorkout = workout;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    mounted() {
        // Load saved workouts
        const saved = localStorage.getItem('savedWorkouts');
        if (saved) {
            this.savedWorkouts = JSON.parse(saved);
        }
        
        // Set random quote
        this.currentQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
    }
});

app.use(vuetify);
app.mount('#app');
