<template>
  <v-menu ref="menu" v-model="menu" offset-y lazy transition="scale-transition" :close-on-content-click="false">
    <v-btn class="btnDate" flat outline slot="activator">
      {{ date }}
      <v-icon>date_range</v-icon>
    </v-btn>
    <v-date-picker v-model="selectedDate" no-title scrollable>
      <v-spacer></v-spacer>
      <v-btn flat outline color="red" @click="menu = false">Cancel</v-btn>
      <v-btn depressed color="primary" @click="submitDate">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["date", "value"],
  data: function() {
    return {
      menu: false,
      selectedDate: ""
    };
  },
  methods: {
    submitDate() {
      this.$refs.menu.save(this.selectedDate);
      this.$emit("input", new Date(this.selectedDate).toDateString());
    }
  }
};
</script>

<style scoped>
.btnDate {
  font-weight: 700;
  text-transform: none;
  color: hsl(0, 0%, 49%);
  width: 10rem;
}
</style>
