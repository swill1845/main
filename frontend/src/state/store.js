export const store = {
  activeTab: "ad",
  activeRoute: "#/ad/dashboard",
  currentSchool: "UF",

  schools: [
    { id: "UF", name: "Florida", conference: "SEC", prestige: 78 },
    { id: "FSU", name: "Florida State", conference: "ACC", prestige: 76 },
    { id: "UCF", name: "UCF", conference: "Big 12", prestige: 70 },
    { id: "USF", name: "USF", conference: "AAC", prestige: 62 },
    { id: "MIAMI", name: "Miami", conference: "ACC", prestige: 74 }
  ],

  sportsRoster: {
    Men: ["Football", "Basketball", "Baseball", "Track & Field"],
    Women: ["Basketball", "Softball", "Soccer", "Track & Field"]
  },

  budgetCategories: ["Scholarships", "Salaries", "Travel", "Facilities", "Recruiting", "Medical", "Operations"],

  sportBudgets: {},   // sportBudgets[schoolId][sportName][category] = amount
  facilityData: {},   // facilityData[schoolId] = { stadium, arena, complex, notes, items[] }
  venueData: {},      // venueData[schoolId][sportName] = venueName

  statusLine: "Ready."
};

export function initStore() {
  for (const s of store.schools) {
    store.sportBudgets[s.id] = store.sportBudgets[s.id] || {};
    store.facilityData[s.id] = store.facilityData[s.id] || { stadium: "", arena: "", complex: "", notes: "", items: [] };
    store.venueData[s.id] = store.venueData[s.id] || {};

    const sports = uniqueSports();
    for (const sp of sports) {
      store.sportBudgets[s.id][sp] = store.sportBudgets[s.id][sp] || {};
      for (const cat of store.budgetCategories) {
        if (store.sportBudgets[s.id][sp][cat] === undefined) store.sportBudgets[s.id][sp][cat] = 0;
      }
    }
  }
}

export function uniqueSports() {
  return [...new Set([...store.sportsRoster.Men, ...store.sportsRoster.Women])].sort();
}

export function setStatus(msg) {
  store.statusLine = msg;
}
