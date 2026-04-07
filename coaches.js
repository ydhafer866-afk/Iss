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
            coaches: coachesData,
            selectedCoach: null,
            dialog: false,
            searchQuery: '',
            filterSpecialty: 'all'
        };
    },
    computed: {
        filteredCoaches() {
            let filtered = this.coaches;
            
            if (this.searchQuery) {
                filtered = filtered.filter(coach => 
                    coach.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    coach.specialty.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            if (this.filterSpecialty !== 'all') {
                filtered = filtered.filter(coach => 
                    coach.specialty.toLowerCase().includes(this.filterSpecialty.toLowerCase())
                );
            }
            
            return filtered;
        },
        specialties() {
            const specs = ['all'];
            this.coaches.forEach(coach => {
                const spec = coach.specialty.split('&')[0].trim();
                if (!specs.includes(spec.toLowerCase())) {
                    specs.push(spec.toLowerCase());
                }
            });
            return specs;
        }
    },
    methods: {
        viewCoach(coach) {
            this.selectedCoach = coach;
            this.dialog = true;
        },
        enrollPlan(coach, plan) {
            const enrollment = {
                coach: coach.name,
                plan: plan.name,
                startDate: new Date().toISOString(),
                duration: plan.duration
            };
            
            let enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
            enrollments.push(enrollment);
            localStorage.setItem('enrollments', JSON.stringify(enrollments));
            
            alert(`Successfully enrolled in "${plan.name}" with ${coach.name}!`);
            this.dialog = false;
        }
    }
});

app.use(vuetify);
app.mount('#app');
