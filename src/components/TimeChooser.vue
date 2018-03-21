<template>
  <v-menu ref="menu" v-model="menu" offset-y lazy transition="scale-transition" :close-on-content-click="false">
    <v-btn class="btnTime" flat outline slot="activator">
      {{ time }}
      <v-icon>alarm</v-icon>
    </v-btn>
    <v-time-picker v-model="selectedTime">
      <v-spacer></v-spacer>
      <v-btn flat outline color="red" @click="menu = false">Cancel</v-btn>
      <v-btn depressed color="primary" @click="submitTime">OK</v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["time", "value"],
  data: function() {
    return {
      menu: false,
      selectedTime: null
    };
  },
  methods: {
    submitTime() {
      this.$refs.menu.save(this.selectedTime);
      this.$emit("input", this.selectedTime);
    }
  }
};
</script>

<style scoped>
.btnTime {
  font-weight: 700;
  text-transform: none;
  color: hsl(0, 0%, 49%);
  width: 10rem;
}
</style>
