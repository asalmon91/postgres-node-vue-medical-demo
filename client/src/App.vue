<template>
  <div id="app">
    <h1>Patients</h1>
    <form @submit.prevent="addPatient">
      <input id="first-name" v-model="newPatient.first_name" placeholder="Patient first name" 
        required minlength="1" />
      <input id="last-name" v-model="newPatient.last_name" placeholder="Patient last name" 
        required minlength="1" />
      <button type="submit" title="Add">Create</button>
    </form>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        {{ patient.last_name }}, {{ patient.first_name}}
        <div>
          <button @click="showEditForm(patient.id)" title="Edit">Edit</button>
          <form :id="'edit-patient-' + patient.id" 
          @submit.prevent="editPatient(patient.id)" style="display: none;">
            <input v-model="updatedPatient.first_name" 
            placeholder="Patient first name" required minlength="1"/>
            <input v-model="updatedPatient.last_name" 
            placeholder="Patient last name" required minlength="1"/>
            <div>
              <button type="submit" title="Update">Update</button>
              <button @click="hideEditForm(patient.id)" type="reset" title="Cancel">Cancel</button>
            </div>
          </form>
          <button @click="deletePatient(patient.id)" title="Remove">Delete</button>
        </div>
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
      },
      updatedPatient: {
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
        alert('Error adding patient:' + error.response.data);
      }
    },
    async showEditForm(id) {
      document.getElementById('edit-patient-' + id).style="display:block;";
    },
    async hideEditForm(id) {
      this.updatedPatient.id = null;
      this.first_name = null;
      this.last_name = null;
      document.getElementById('edit-patient-' + id).style="display:none;";
    },
    async editPatient(id) {
      try {
        console.debug('Attempting to update', id);
        await axios.put(`http://localhost:3000/api/patients/${id}`, {
          patient: {
            first_name: this.updatedPatient.first_name,
            last_name: this.updatedPatient.last_name,
          }
        });
        this.updatedPatient.first_name = null;
        this.updatedPatient.last_name = null;
        this.hideEditForm(id);
        this.fetchPatients(); // Refresh
      } catch (error) {
        console.error('Error updating patient:', error);
        alert('Error updating patient:' + error.response.data);
      }
    },
    async deletePatient(id) {
      try {
        console.debug('Attempting to delete', id);
        await axios.delete(`http://localhost:3000/api/patients/${id}`);
        this.fetchPatients(); // Refresh
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient: ' + error.response.data);
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
