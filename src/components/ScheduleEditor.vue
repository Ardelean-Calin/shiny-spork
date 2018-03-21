<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="50%">
    <v-card class="mainCard">
      <p class="text-xs-left setareCurenta">Setați orarul</p>
      <div class="mainLayout">
        <v-select
          @input="selectedFreq = true"
          :items="frecvente"
          v-model="frecventa"
          overflow
          solo
          label="Frecvența"
          class="selectZi"
        ></v-select>
        <v-select
          @input="selectedDay = true"
          :items="zile"
          v-model="zi"
          overflow
          solo
          label="Ziua"
          class="selectZi"
        ></v-select>
        <div style="padding: 0 0.5rem 0 1rem">la ora</div>
        <v-btn class="btnOra" flat outline>
          {{ ora }}
          <v-icon>alarm</v-icon>
        </v-btn>
        <div style="padding: 0 0.5rem 0 0.5rem">începând cu data de</div>
        <v-btn class="btnOra" flat outline>
          {{primaData}}
          <v-icon>date_range</v-icon>
        </v-btn>
      </div>
      <br>
      <div v-if="selectedFreq && selectedDay" class="saveDiv">
        <div>
          <v-icon color="red">warning</v-icon>
          <span style="color: red; margin-left: 0.5rem">Dacă salvați suprascrieți toate datele din orar.</span>
        </div>
        <v-btn flat outline color="red">Salvează</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      zile: ["Luni", "Marți", "Miercuri", "Joi", "Vineri"],
      frecvente: ["Săptămânal", "Bilunar", "Lunar"],
      zi: null,
      frecventa: null,
      ora: new Date().toLocaleTimeString("ro-RO", {
        hour12: true,
        hour: "numeric",
        minute: "numeric"
      }),
      primaData: new Date().toLocaleDateString(),
      selectedFreq: false,
      selectedDay: false
    };
  }
};
</script>

<style scoped>
.btnOra {
  font-weight: 700;
  font-size: 1.2rem;
  color: hsl(0, 0%, 49%);
}

.mainCard {
  padding: 1rem;
}

.mainLayout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.saveDiv {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selectZi {
  /* max-width: 10rem; */
  /* flex-grow: 0.15; */
  margin: 0 0.5rem;
}

.setareCurenta {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
