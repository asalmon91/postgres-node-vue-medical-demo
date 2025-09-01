<template>
  <div id="app">
    <h1>Patients</h1>
    <form @submit.prevent="addPatient">
      <input id="first-name" v-model="newPatient.first_name" placeholder="Patient first name" required/>
      <input id="last-name" v-model="newPatient.last_name" placeholder="Patient last name" required/>
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        {{ patient.id }},  {{ patient.last_name }}, {{ patient.first_name}}
        <button @click="deletePatient(patient.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      patients: [],
      newPatient: {
        id: null,
        first_name: null,
        last_name: null,
      }
    };
  },
  created() {
    this.fetchPatients();
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await axios.get('http://localhost:3000/api/patients');
        this.patients = response.data;
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    },
    async addPatient() {
      if (!this.newPatient) return;
      try {
        await axios.post('http://localhost:3000/api/patients', 
        {patient: {
          first_name: this.newPatient.first_name,
          last_name: this.newPatient.last_name,
        }});
        this.newPatient.id = null;
        this.newPatient.first_name = null;
        this.newPatient.last_name = null;
        this.fetchPatients(); // Refresh
      } catch (error) {
        console.error('Error adding patient:', error);
      }
    },
    async deletePatient(id) {
      try {
        console.debug('Attempting to delete', id)
        await axios.delete(`http://localhost:3000/api/patients/${id}`);
        this.fetchPatients(); // Refresh
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul {
  list-style-type: none;
  padding: 0;
  width: 300px;
  margin: 20px auto;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
input {
  padding: 8px;
}
button {
  padding: 8px 12px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
