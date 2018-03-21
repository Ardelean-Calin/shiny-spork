<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="50%">
    <v-card class="mainCard">
      <v-divider></v-divider>
      <template v-for="(val, key, index) in items">
        <div class="course" :key="index">
          <div class="courseTitle">{{ val.shortTitle }}</div>
          <div class="btnContainer">
            <date-chooser class="chooser" v-model="dates[key]" :date="getDate(key)"/>
            <time-chooser class="chooser" v-model="hours[key]" :time="getTime(key)"/>
            <div style="display: inline-block">
              <v-text-field solo v-model="deltas[key]" @input="(value) => setDuration(key, value)" style="width: 7rem" type="number" min="0.5" step="0.5" suffix="h"/>
            </div>
          </div>
        </div>
        <v-divider :key="`${index}_div`"></v-divider>
      </template>
    <div style="text-align: right">
      <v-btn @click="updateDatabase" color="primary">
        <v-icon>save</v-icon>
        Save
      </v-btn>
    </div>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase/app";

import DateChooser from "@/components/DateChooser.vue";
import TimeChooser from "@/components/TimeChooser.vue";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    subject: {
      type: Object
    }
  },
  components: {
    DateChooser,
    TimeChooser
  },
  data: function() {
    return {
      items: { ...this.subject.cursuri, ...this.subject.laboratoare },
      dates: {},
      hours: {}
    };
  },
  computed: {
    deltas: function() {
      return Object.keys(this.items)
        .map(key => {
          let temp = {
            delta:
              (this.items[key].dateEnd - this.items[key].dateStart) / 3600000,
            key: key
          };
          return temp;
        })
        .reduce((prev, curr) => {
          prev[curr.key] = curr.delta;
          return prev;
        }, {});
    }
  },
  watch: {
    items: {
      handler: function() {
        Object.keys(this.subject.cursuri).map(
          key => (this.subject.cursuri[key] = this.items[key])
        );
        Object.keys(this.subject.laboratoare).map(
          key => (this.subject.laboratoare[key] = this.items[key])
        );
      },
      deep: true
    },
    dates: {
      handler: function() {
        const keys = Object.keys(this.dates);
        keys.map(key => {
          const time = new Date(this.items[key].dateStart).toLocaleTimeString();
          const newDate = new Date(this.dates[key]).toLocaleDateString();
          const newDateTimeString = newDate + " " + time;

          this.items[key].dateStart = new Date(newDateTimeString).getTime();
          this.items[key].dateEnd = new Date(
            this.items[key].dateStart + this.deltas[key] * 3600000
          ).getTime();
        });
      },
      deep: true
    },
    hours: {
      handler: function() {
        const keys = Object.keys(this.hours);
        keys.map(key => {
          const date = new Date(this.items[key].dateStart).toLocaleDateString();
          const newTime = this.hours[key];
          const newDateTimeString = date + " " + newTime;

          this.items[key].dateStart = new Date(newDateTimeString).getTime();
          this.items[key].dateEnd = new Date(
            this.items[key].dateStart + this.deltas[key] * 3600000
          ).getTime();
        });
      },
      deep: true
    }
  },
  methods: {
    getDate(key) {
      return this.newDate(this.items[key].dateStart);
    },
    getTime(key) {
      return this.newTime(this.items[key].dateStart);
    },
    getDuration(key) {
      const timeDelta = this.items[key].dateEnd - this.items[key].dateStart;
      return (timeDelta / 3600000).toFixed(2);
    },
    setDuration(key, value) {
      this.deltas[key] = value;
      this.items[key].dateEnd = this.items[key].dateStart + value * 3600000;
    },
    newDate(time = null) {
      time = time ? time : new Date().getTime();

      return new Date(time).toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "2-digit"
      });
    },
    newTime(time = null) {
      time = time ? time : new Date().getTime();

      return new Date(time).toLocaleTimeString("ro-RO", {
        hour12: true,
        hour: "numeric",
        minute: "numeric"
      });
    },
    updateDatabase() {
      firebase
        .database()
        .ref("discipline/" + this.$route.params.id)
        .set(this.subject);
    }
  }
};
</script>

<style scoped>
.mainCard {
  padding: 2rem;
  overflow: hidden;
}

.course {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.courseTitle {
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
