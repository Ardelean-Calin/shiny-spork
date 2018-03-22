<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="35%" scrollable>
    <v-card style="padding: 1rem">
      <v-select solo v-model="selType" :items="['Curs', 'Laborator']"></v-select>
      <v-text-field label="Titlu" v-model="shortTitle"></v-text-field>
      <v-text-field label="Subtitlu" v-model="longTitle"></v-text-field>
      <div>
        <v-text-field label="Descriere" multi-line v-model="descriere"></v-text-field>
      </div>
      <div class="flexRow">
        <span style="font-size: 1.2rem; font-weight: 700; color: hsl(0, 0%, 35%)">Dată:</span>
        <date-chooser style="margin-left: 1.3rem" v-model="dateStart" :date="dateStart"/>
      </div>
      <div class="flexRow">
        <span style="font-size: 1.2rem; font-weight: 700; color: hsl(0, 0%, 35%)">Oră:</span>
        <time-chooser style="margin-left: 1.9rem" v-model="timeStart" :time="timeStart"/>
      </div>
      <div class="flexRow">
        <span style="font-size: 1.2rem; font-weight: 700; color: hsl(0, 0%, 35%)">Durată:</span>
        <div style="width: 10rem; margin-left: 0.5rem">
          <v-text-field solo suffix="h" type="number" min="0.5" step="0.5" v-model="timeDelta" />
        </div>
        <div style="flex-grow: 1"></div>
        <v-btn @click="submitItem" color="primary" :disabled="!readyToSubmit">
          <v-icon>add_circle_outline</v-icon>
          Add
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
  props: ["value"],
  components: {
    DateChooser,
    TimeChooser
  },
  computed: {
    dateEnd: function() {
      if (this.dateStartMS) {
        return this.dateStartMS + this.timeDelta * 3600000;
      }
    },
    dateStartMS: function() {
      return new Date(this.dateStart + " " + this.timeStart).getTime();
    },
    readyToSubmit: function() {
      return (
        this.shortTitle && this.longTitle && this.descriere && this.timeDelta
      );
    }
  },
  data: function() {
    return {
      shortTitle: null,
      longTitle: null,
      descriere: null,
      dateStart: new Date().toDateString(),
      timeStart: new Date().toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timeDelta: null,
      selType: "Curs"
    };
  },
  methods: {
    submitItem() {
      const newItem = {
        dateStart: this.dateStartMS,
        dateEnd: this.dateEnd,
        shortTitle: this.shortTitle,
        longTitle: this.longTitle,
        descriere: this.descriere
      };

      const reference = this.selType == "Curs" ? "cursuri" : "laboratoare";
      firebase
        .database()
        .ref("discipline/" + this.$route.params.id + "/" + reference)
        .push()
        .set(newItem);
      this.$emit("input");
    }
  }
};
</script>

<style scoped>
.flexRow {
  display: flex;
  align-items: center;
}
</style>
