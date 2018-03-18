<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="30%" persistent>
    <h1 class="display-1 text-xs-left">Planificare rapoarte</h1>
    <v-card class="mainCard" flat>
      <div class="formContainer">
        <v-text-field
          label="E-mail profesor"
          v-model="email"
          prepend-icon="mail"
          clearable
        ></v-text-field>
        <div style="position: relative">
          <v-slider class="frequencySlider" label="Trimite raport" v-model="frequency" step="1" max="2" ticks></v-slider>
          <div class="frequencyString">{{ frequencyString }}</div>
        </div>
      </div>
      <div class="datePicker">
        <p class="text-xs-left dateText">Incepand cu data de: </p>
        <v-date-picker v-model="startDate"></v-date-picker>
      </div>
    </v-card>
    <div class="btnDiv">
      <v-btn color="red" @click.native="$emit('input')" outline>
        <v-icon left>cancel</v-icon>
        Anulează
      </v-btn>
      <v-btn color="primary" @click.native="$emit('input')">
        <v-icon left>save</v-icon>
        Salvează
      </v-btn>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
  data: function() {
    return {
      email: "acp.calin@gmail.com",
      startDate: "2018-03-02",
      frequency: 0
    };
  },
  computed: {
    frequencyString: function() {
      switch (this.frequency) {
        case 0:
          return "Săptămânal";
        case 1:
          return "Bilunar";
        case 2:
          return "Lunar";
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.btnDiv {
  background: hsl(0, 0%, 89%);
  text-align: right;
  padding: 0.5rem 0;
}
.display-1 {
  background: hsl(0, 0%, 89%);
  padding: 0.8rem 1rem;
  font-weight: 600;
}
.dateText {
  font-size: 1.3rem;
  font-weight: 600;
  color: hsl(0, 0%, 49%);
  padding: 0 1rem;
}
.frequencyString {
  color: hsl(0, 0%, 35%);
  font-weight: 600;
  position: absolute;
  top: 2rem;
  right: 0;
}
.frequencySlider {
  padding: 0;
  font-weight: 600;
  color: hsl(0, 0%, 49%);
}
.formContainer {
  padding: 1rem;
}
.mainCard {
  padding: 1rem;
}
</style>
