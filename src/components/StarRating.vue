<template>
  <div class="starDiv">
    <v-icon 
      v-for="i in 5" :key="i"
      x-large
      color="orange">
      {{getStarShape(i)}}
    </v-icon>
    <h3>Scor mediu: 
      <span class="ratingText" :style="{color: ratingColor}">
        {{rating.toFixed(1)}}
      </span>
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 0,
      validator: value => value >= 0 && value <= 5
    }
  },
  computed: {
    ratingColor: function() {
      if (this.rating <= 2) return "tomato";
      else if (this.rating >= 4) return "mediumseagreen";
      else return "orange";
    }
  },
  methods: {
    getStarShape(index) {
      const distance = Math.round(this.rating * 2) - 2 * index;

      if (distance >= 0) {
        return "star";
      } else if (distance >= -1) {
        return "star_half";
      } else {
        return "star_border";
      }
    }
  }
};
</script>

<style scoped>
h3 {
  text-align: center;
  font-weight: 600;
}
.ratingText {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 700;
}
.starDiv {
  display: inline-block;
}
</style>
